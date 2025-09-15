const express = require('express');
const router = express.Router();
const {
  createEscrowTransaction,
  confirmPayment,
  markAsDelivered,
  approveInspection,
  disputeInspection,
  getTransactionDetails,
  getUserTransactions
} = require('../controllers/escrowController');
const auth = require('../middleware/auth');

// Créer une nouvelle transaction escrow
router.post('/create', auth, createEscrowTransaction);

// Confirmer le paiement
router.post('/:transactionId/confirm-payment', auth, confirmPayment);

// Marquer comme livré
router.post('/:transactionId/deliver', auth, markAsDelivered);

// Approuver l'inspection
router.post('/:transactionId/approve-inspection', auth, approveInspection);

// Signaler des problèmes lors de l'inspection
router.post('/:transactionId/dispute-inspection', auth, disputeInspection);

// Obtenir les détails d'une transaction
router.get('/:transactionId', auth, getTransactionDetails);

// Obtenir les transactions d'un utilisateur
router.get('/', auth, getUserTransactions);

module.exports = router;
