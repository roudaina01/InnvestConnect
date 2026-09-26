const mongoose = require('mongoose');

const admSchema = mongoose.Schema({
    statut: String,
    nom: String,
    email: String,
    mot_de_passe: String,
});

const adm = mongoose.model('adm', admSchema, 'Admins');
module.exports = adm;