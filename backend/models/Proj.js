const mongoose = require('mongoose');

const projetSchema = mongoose.Schema({
    Titre_projet: String,
    Localisation_projet: String,
    bud_min_projet: Number,
    bud_max_projet: Number,
    secteur: {
        type: String,
        enum: ["technologie", "construction et immobilier", "agriculture et agroalimentaire", "commerce et e-commerce", "sante", "education", "energie et environnement"]
    },
    type_projet: {
        type: String,
        enum: ["en ligne", "physique"]  
    },

    entrepreneur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'enp'
    },

    statut: {
        type: String,
        enum: ["en_attente", "valide", "refuse"],
        default: "en_attente"   //  "en_attente" par défaut
    },

    DateCreation: {
        type: Date,
        default: Date.now
    }
});

const projet = mongoose.model('projet', projetSchema);
module.exports = projet;