const mongoose = require('mongoose');

const contratSchema = mongoose.Schema({
    reunion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reunion',
        required: true
    },
    projet_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'projet',
        required: true
    },
    entrepreneur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'enp'
    },
    investisseur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inv',
        required: true
    },
    montant: Number,
    pourcentage_participation: Number,
    statut: {
        type: String,
        enum: ['en_negociation', 'signe', 'annule'],
        default: 'en_negociation'
    },
    details: String,
    DateCreation: {
        type: Date,
        default: Date.now
    }
});

const contrat = mongoose.model('contrat', contratSchema);
module.exports = contrat;