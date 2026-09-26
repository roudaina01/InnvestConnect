const mongoose = require('mongoose');

const enpSchema = mongoose.Schema({
     statut: String,
     nom_prenom: String,
     pays_de_residence: String,
     ville_de_residence: String,

    email: String,
    mot_de_passe: String,
    
   
    
    secteurs: mongoose.Schema.Types.Mixed,
    
   


   
});

const enp = mongoose.model('enp', enpSchema);
module.exports = enp;