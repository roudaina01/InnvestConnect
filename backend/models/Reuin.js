const mongoose = require('mongoose');

const reunionSchema = mongoose.Schema({
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
    statut: {
        type: String,
        enum: ['en_attente', 'planifiee', 'annulee'],
        default: 'en_attente'
    },
    decision: {
        type: String,
        enum: ['en_attente', 'accepte', 'refuse'],
        default: 'en_attente'
    },
    date_reunion: Date,
    heure_reunion: String,
    lien_meet: String,
    message: String,
    DateCreation: {
        type: Date,
        default: Date.now
    }
});

const reunion = mongoose.model('reunion', reunionSchema);
module.exports = reunion;