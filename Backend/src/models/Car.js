const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  // Informations de base
  title: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  version: {
    type: String,
    trim: true
  },
  
  // Prix et vente
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  isNegotiable: {
    type: Boolean,
    default: true
  },
  
  // Caractéristiques techniques
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  fuel: {
    type: String,
    enum: ['essence', 'diesel', 'hybride', 'electrique', 'gpl', 'ethanol'],
    required: true
  },
  transmission: {
    type: String,
    enum: ['manuelle', 'automatique', 'semi-automatique'],
    required: true
  },
  power: {
    type: Number,
    min: 0
  },
  doors: {
    type: Number,
    min: 2,
    max: 5
  },
  seats: {
    type: Number,
    min: 2,
    max: 9
  },
  color: {
    type: String,
    trim: true
  },
  
  // Localisation
  location: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  
  // Description et détails
  description: {
    type: String,
    required: true,
    trim: true
  },
  equipment: [{
    type: String,
    trim: true
  }],
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  // Propriétaire
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Statut de l'annonce
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'sold', 'archived'],
    default: 'draft'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Vérification OccazCar
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationReport: {
      technicalInspection: {
        type: String,
        enum: ['passed', 'failed', 'pending'],
        default: 'pending'
      },
      historyCheck: {
        type: String,
        enum: ['clean', 'accident', 'pending'],
        default: 'pending'
      },
      documentsCheck: {
        type: String,
        enum: ['valid', 'invalid', 'pending'],
        default: 'pending'
      },
      mileageCheck: {
        type: String,
        enum: ['verified', 'suspicious', 'pending'],
        default: 'pending'
      }
    },
    issues: [{
      type: {
        type: String,
        enum: ['technical', 'documentation', 'history', 'mileage']
      },
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
  
  // Garantie
  warranty: {
    hasWarranty: {
      type: Boolean,
      default: false
    },
    warrantyType: {
      type: String,
      enum: ['manufacturer', 'extended', 'occazcar']
    },
    warrantyDuration: Number, // en mois
    warrantyDetails: String
  },
  
  // Statistiques
  stats: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    contacts: {
      type: Number,
      default: 0
    }
  },
  
  // Dates importantes
  firstRegistration: Date,
  lastTechnicalInspection: Date,
  nextTechnicalInspection: Date,
  
  // Métadonnées
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date,
  soldAt: Date
});

// Index pour les recherches
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: 1 });
carSchema.index({ mileage: 1 });
carSchema.index({ fuel: 1 });
carSchema.index({ location: 1 });
carSchema.index({ owner: 1 });
carSchema.index({ status: 1, isAvailable: 1 });
carSchema.index({ 'verification.isVerified': 1 });

// Index géospatial
carSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Middleware pour mettre à jour updatedAt
carSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Mettre à jour publishedAt lors de la publication
  if (this.isModified('status') && this.status === 'approved' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Mettre à jour soldAt lors de la vente
  if (this.isModified('isAvailable') && !this.isAvailable && !this.soldAt) {
    this.soldAt = new Date();
  }
  
  next();
});

// Méthodes virtuelles
carSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.year;
});

carSchema.virtual('isNew').get(function() {
  return this.age <= 1;
});

carSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg || this.images[0];
});

// Méthodes d'instance
carSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save();
};

carSchema.methods.incrementFavorites = function() {
  this.stats.favorites += 1;
  return this.save();
};

carSchema.methods.incrementContacts = function() {
  this.stats.contacts += 1;
  return this.save();
};

module.exports = mongoose.model('Car', carSchema);
