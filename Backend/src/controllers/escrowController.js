const Transaction = require('../models/Transaction');
const Car = require('../models/Car');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

// Créer une nouvelle transaction escrow
const createEscrowTransaction = async (req, res) => {
  try {
    const { carId, deliveryMethod, deliveryAddress } = req.body;
    const buyerId = req.user.id;

    // Vérifier que la voiture existe et est disponible
    const car = await Car.findById(carId).populate('owner');
    if (!car) {
      return res.status(404).json({ error: 'Véhicule non trouvé' });
    }

    if (!car.isAvailable || car.status !== 'approved') {
      return res.status(400).json({ error: 'Ce véhicule n\'est pas disponible à la vente' });
    }

    // Vérifier que l'acheteur n'est pas le vendeur
    if (car.owner._id.toString() === buyerId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas acheter votre propre véhicule' });
    }

    // Calculer les montants
    const carPrice = car.price;
    const commissionRate = parseFloat(process.env.OCCAZCAR_COMMISSION_RATE) || 2.5;
    const commission = Math.max(
      Math.min(carPrice * (commissionRate / 100), 500), // Max 500€
      50 // Min 50€
    );
    const totalAmount = carPrice + commission;
    const sellerAmount = carPrice - commission;

    // Créer l'intent de paiement Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe utilise les centimes
      currency: 'eur',
      metadata: {
        carId: carId,
        buyerId: buyerId,
        sellerId: car.owner._id.toString(),
        commission: commission.toString()
      }
    });

    // Créer la transaction
    const transaction = new Transaction({
      transactionId: uuidv4(),
      buyer: buyerId,
      seller: car.owner._id,
      car: carId,
      carPrice: carPrice,
      commission: commission,
      totalAmount: totalAmount,
      sellerAmount: sellerAmount,
      status: 'pending_payment',
      stripePaymentIntentId: paymentIntent.id,
      delivery: {
        method: deliveryMethod || 'pickup',
        address: deliveryAddress
      }
    });

    await transaction.save();

    // Marquer la voiture comme vendue
    car.isAvailable = false;
    car.status = 'sold';
    await car.save();

    res.status(201).json({
      success: true,
      transaction: transaction,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Erreur création transaction escrow:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la transaction' });
  }
};

// Confirmer le paiement et passer à l'étape suivante
const confirmPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId)
      .populate('buyer seller car');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.status !== 'pending_payment') {
      return res.status(400).json({ error: 'Cette transaction n\'est pas en attente de paiement' });
    }

    // Vérifier le statut du paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
      transaction.stripePaymentIntentId
    );

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: 'Le paiement n\'a pas été confirmé' });
    }

    // Mettre à jour la transaction
    transaction.status = 'payment_received';
    transaction.paymentDate = new Date();
    transaction.stripeChargeId = paymentIntent.latest_charge;

    // Ajouter un message système
    transaction.messages.push({
      sender: null,
      message: 'Paiement confirmé. Le véhicule peut maintenant être livré.',
      type: 'system'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Paiement confirmé avec succès',
      transaction: transaction
    });

  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({ error: 'Erreur lors de la confirmation du paiement' });
  }
};

// Marquer le véhicule comme livré
const markAsDelivered = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { deliveryNotes, trackingNumber } = req.body;

    const transaction = await Transaction.findById(transactionId)
      .populate('buyer seller car');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.status !== 'payment_received') {
      return res.status(400).json({ error: 'Le paiement doit être confirmé avant la livraison' });
    }

    // Mettre à jour la transaction
    transaction.status = 'car_delivered';
    transaction.deliveryDate = new Date();
    transaction.inspectionDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 jours
    transaction.delivery.deliveryNotes = deliveryNotes;
    transaction.delivery.trackingNumber = trackingNumber;

    // Ajouter un message système
    transaction.messages.push({
      sender: null,
      message: 'Véhicule livré. Période d\'inspection de 7 jours commencée.',
      type: 'system'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Véhicule marqué comme livré',
      transaction: transaction
    });

  } catch (error) {
    console.error('Erreur marquage livraison:', error);
    res.status(500).json({ error: 'Erreur lors du marquage de la livraison' });
  }
};

// Approuver l'inspection (acheteur)
const approveInspection = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { comments } = req.body;

    const transaction = await Transaction.findById(transactionId)
      .populate('buyer seller car');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.status !== 'car_delivered' && transaction.status !== 'inspection_period') {
      return res.status(400).json({ error: 'Le véhicule doit être livré pour approuver l\'inspection' });
    }

    // Vérifier que c'est bien l'acheteur qui approuve
    if (transaction.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Seul l\'acheteur peut approuver l\'inspection' });
    }

    // Mettre à jour la transaction
    transaction.status = 'inspection_approved';
    transaction.approvalDate = new Date();
    transaction.inspection.buyerApproved = true;
    transaction.inspection.buyerComments = comments;
    transaction.inspection.inspectionDate = new Date();

    // Ajouter un message
    transaction.messages.push({
      sender: req.user.id,
      message: `Inspection approuvée par l'acheteur${comments ? ': ' + comments : ''}`,
      type: 'buyer'
    });

    await transaction.save();

    // Libérer le paiement au vendeur
    await releasePaymentToSeller(transaction);

    res.json({
      success: true,
      message: 'Inspection approuvée. Le paiement sera versé au vendeur.',
      transaction: transaction
    });

  } catch (error) {
    console.error('Erreur approbation inspection:', error);
    res.status(500).json({ error: 'Erreur lors de l\'approbation de l\'inspection' });
  }
};

// Signaler un problème lors de l'inspection
const disputeInspection = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { issues } = req.body;

    const transaction = await Transaction.findById(transactionId)
      .populate('buyer seller car');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    if (transaction.status !== 'car_delivered' && transaction.status !== 'inspection_period') {
      return res.status(400).json({ error: 'Le véhicule doit être livré pour signaler des problèmes' });
    }

    // Vérifier que c'est bien l'acheteur qui signale
    if (transaction.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Seul l\'acheteur peut signaler des problèmes' });
    }

    // Mettre à jour la transaction
    transaction.status = 'inspection_disputed';
    transaction.inspection.issues = issues;
    transaction.inspection.inspectionDate = new Date();

    // Ajouter un message
    transaction.messages.push({
      sender: req.user.id,
      message: `Problèmes signalés lors de l'inspection: ${issues.map(i => i.description).join(', ')}`,
      type: 'buyer'
    });

    await transaction.save();

    res.json({
      success: true,
      message: 'Problèmes signalés. Notre équipe va examiner la situation.',
      transaction: transaction
    });

  } catch (error) {
    console.error('Erreur signalement problème:', error);
    res.status(500).json({ error: 'Erreur lors du signalement des problèmes' });
  }
};

// Libérer le paiement au vendeur (fonction interne)
const releasePaymentToSeller = async (transaction) => {
  try {
    // Ici, vous implémenteriez la logique pour transférer l'argent au vendeur
    // via Stripe Connect ou un virement bancaire
    
    transaction.status = 'payment_released';
    transaction.releaseDate = new Date();

    // Ajouter un message système
    transaction.messages.push({
      sender: null,
      message: 'Paiement versé au vendeur avec succès.',
      type: 'system'
    });

    await transaction.save();

    // Mettre à jour les statistiques du vendeur
    const seller = await User.findById(transaction.seller);
    if (seller) {
      seller.stats.totalSales += transaction.sellerAmount;
      seller.stats.totalTransactions += 1;
      await seller.save();
    }

    // Mettre à jour les statistiques de l'acheteur
    const buyer = await User.findById(transaction.buyer);
    if (buyer) {
      buyer.stats.totalPurchases += transaction.totalAmount;
      buyer.stats.totalTransactions += 1;
      await buyer.save();
    }

  } catch (error) {
    console.error('Erreur libération paiement:', error);
    throw error;
  }
};

// Obtenir les détails d'une transaction
const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId)
      .populate('buyer seller car');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction non trouvée' });
    }

    // Vérifier que l'utilisateur a le droit de voir cette transaction
    const userId = req.user.id;
    if (transaction.buyer._id.toString() !== userId && 
        transaction.seller._id.toString() !== userId && 
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès non autorisé à cette transaction' });
    }

    res.json({
      success: true,
      transaction: transaction
    });

  } catch (error) {
    console.error('Erreur récupération transaction:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la transaction' });
  }
};

// Obtenir les transactions d'un utilisateur
const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type } = req.query;

    let query = {
      $or: [
        { buyer: userId },
        { seller: userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('buyer seller car')
      .sort({ createdAt: -1 });

    // Filtrer par type si spécifié
    let filteredTransactions = transactions;
    if (type === 'buying') {
      filteredTransactions = transactions.filter(t => t.buyer._id.toString() === userId);
    } else if (type === 'selling') {
      filteredTransactions = transactions.filter(t => t.seller._id.toString() === userId);
    }

    res.json({
      success: true,
      transactions: filteredTransactions
    });

  } catch (error) {
    console.error('Erreur récupération transactions utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des transactions' });
  }
};

module.exports = {
  createEscrowTransaction,
  confirmPayment,
  markAsDelivered,
  approveInspection,
  disputeInspection,
  getTransactionDetails,
  getUserTransactions
};