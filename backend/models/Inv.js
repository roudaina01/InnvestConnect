const mongoose = require('mongoose');

const invSchema = mongoose.Schema({
     statut: String,
    nom: String,
    prenom: String,
    email: String,
    mot_de_passe: String,
    gouvernorat: String,
    secteurs: mongoose.Schema.Types.Mixed,
    
   


   
});

const inv = mongoose.model('inv', invSchema);
module.exports = inv;