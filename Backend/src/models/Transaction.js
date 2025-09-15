const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Identifiants
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Parties impliquées
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Véhicule concerné
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  
  // Montants
  carPrice: {
    type: Number,
    required: true,
    min: 0
  },
  commission: {
    type: Number,
    required: true,
    min: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  sellerAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Statut de la transaction
  status: {
    type: String,
    enum: [
      'pending_payment',      // En attente de paiement par l'acheteur
      'payment_received',     // Paiement reçu par OccazCar
      'car_delivered',        // Véhicule livré à l'acheteur
      'inspection_period',    // Période d'inspection (7 jours)
      'inspection_approved',  // Inspection approuvée par l'acheteur
      'inspection_disputed',  // Litige sur l'inspection
      'payment_released',     // Paiement versé au vendeur
      'transaction_completed', // Transaction terminée
      'transaction_cancelled', // Transaction annulée
      'refund_processed'      // Remboursement effectué
    ],
    default: 'pending_payment'
  },
  
  // Paiement Stripe
  stripePaymentIntentId: {
    type: String,
    required: true
  },
  stripeChargeId: {
    type: String
  },
  
  // Dates importantes
  paymentDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  inspectionDeadline: {
    type: Date
  },
  approvalDate: {
    type: Date
  },
  releaseDate: {
    type: Date
  },
  
  // Inspection et validation
  inspection: {
    buyerApproved: {
      type: Boolean,
      default: false
    },
    buyerComments: {
      type: String
    },
    inspectionDate: {
      type: Date
    },
    issues: [{
      description: String,
      severity: {
        type: String,
        enum: ['minor', 'major', 'critical']
      },
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Livraison
  delivery: {
    method: {
      type: String,
      enum: ['pickup', 'delivery', 'meeting_point'],
      default: 'pickup'
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String
    },
    trackingNumber: String,
    deliveryNotes: String
  },
  
  // Documents
  documents: {
    billOfSale: String,        // Contrat de vente
    deliveryReceipt: String,   // Bon de livraison
    inspectionReport: String   // Rapport d'inspection
  },
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['system', 'buyer', 'seller', 'admin'],
      default: 'system'
    }
  }],
  
  // Métadonnées
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware pour mettre à jour updatedAt
transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index pour les recherches fréquentes
transactionSchema.index({ buyer: 1, status: 1 });
transactionSchema.index({ seller: 1, status: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ stripePaymentIntentId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
