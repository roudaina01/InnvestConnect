const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = 'const JWT_SECRET = process.env.JWT_SECRET;';
// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Projets')
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB :', err.message));

// Import des modèles
const projet = require('./models/Proj');
const inv = require('./models/Inv');
const enp = require('./models/Entr');
const adm = require('./models/Admin');
const reunion = require('./models/Reuin');
const contrat = require('./models/Contrat');
app.get('/', (req, res) => {
  res.json({ message: 'API InnvestConnect en ligne' });
});
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://invest-connect-eight.vercel.app',
    process.env.CLIENT_URL,
  ].filter(Boolean),
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH', 'PUT'],
  allowedHeaders: ['Origin', 'Accept', 'Content-Type', 'X-Requested-With', 'Authorization'],
}));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// ===== Ajouter un projet (statut par défaut: en_attente) =====
app.post('/Projet', (req, res) => {
    console.log('projet reçu');

    const data = new projet({
        Titre_projet: req.body.Titre_projet,
        Localisation_projet: req.body.Localisation_projet,
        bud_min_projet: req.body.bud_min_projet,
        bud_max_projet: req.body.bud_max_projet,
        secteur: req.body.secteur,
        type_projet: req.body.type_projet,
        entrepreneur_id: req.body.entrepreneur_id || undefined,
        statut: 'en_attente',
        DateCreation: Date.now()
    });

    data.save()
        .then(() => {
            res.json({ message: 'Projet soumis avec succès, en attente de validation par l\'administrateur.' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de l\'ajout', error: err });
        });
});



// ===== Récupérer les projets: admin -> tous, sinon -> uniquement validés =====
// ===== Récupérer les projets: admin -> tous, sinon -> uniquement validés =====
app.get('/Projets', (req, res) => {
    const { secteurs, vue } = req.query;

    let filter = {};
    if (vue !== 'admin') {
        filter.statut = 'valide';
    }
    if (secteurs) {
        const secteursArray = secteurs.split(',').map(s => s.trim()).filter(Boolean);
        if (secteursArray.length > 0) {
            filter.secteur = { $in: secteursArray };
        }
    }

    projet.find(filter)
        .populate('entrepreneur_id', '-mot_de_passe') // ⚠️ AJOUT : sans ça, entrepreneur_id reste un id brut
        .sort({ DateCreation: -1 })
        .then((projets) => {
            res.json(projets);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la récupération des projets', error: err });
        });
});

// ===== Valider un projet (admin) -> il devient public =====
app.patch('/Projet/:id/valider', (req, res) => {
    projet.findByIdAndUpdate(req.params.id, { statut: 'valide' }, { new: true })
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Projet introuvable' });
            res.json({ message: 'Projet validé, il est maintenant public.', projet: updated });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la validation', error: err });
        });
});

// ===== Refuser un projet (admin) =====
app.patch('/Projet/:id/refuser', (req, res) => {
    projet.findByIdAndUpdate(req.params.id, { statut: 'refuse' }, { new: true })
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Projet introuvable' });
            res.json({ message: 'Projet refusé.', projet: updated });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors du refus', error: err });
        });
});
// ===== Compter les projets par secteur (les plus demandés en premier) =====
app.get('/Projets/secteurs-count', (req, res) => {
    projet.aggregate([
        { $group: { _id: '$secteur', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors du comptage des secteurs', error: err });
        });
});

// ===== Supprimer un investisseur (admin) =====
app.delete('/Investisseur/:id', (req, res) => {
    inv.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Investisseur supprimé' }))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la suppression', error: err }); });
});

// ===== Supprimer un entrepreneur (admin) =====
app.delete('/Entrepreneur/:id', (req, res) => {
    enp.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Entrepreneur supprimé' }))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la suppression', error: err }); });
});

// ===== Liste des investisseurs (filtrée par secteurs, sans mot de passe) =====
app.get('/Investisseurs', (req, res) => {
    const { secteurs } = req.query;
    let filter = {};
    if (secteurs) {
        const secteursArray = secteurs.split(',').map(s => s.trim()).filter(Boolean);
        if (secteursArray.length > 0) {
            filter = { secteurs: { $in: secteursArray } };
        }
    }
    inv.find(filter)
        .select('-mot_de_passe')
        .then((users) => res.json(users))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des investisseurs', error: err }); });
});

// ===== Liste des entrepreneurs (filtrée par secteurs, sans mot de passe) =====
app.get('/Entrepreneurs', (req, res) => {
    const { secteurs } = req.query;
    let filter = {};
    if (secteurs) {
        const secteursArray = secteurs.split(',').map(s => s.trim()).filter(Boolean);
        if (secteursArray.length > 0) {
            filter = { secteurs: { $in: secteursArray } };
        }
    }
    enp.find(filter)
        .select('-mot_de_passe')
        .then((users) => res.json(users))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des entrepreneurs', error: err }); });
});

// ===== Statistiques réelles de la plateforme (pour la section counter) =====
app.get('/Stats', (req, res) => {
    Promise.all([
        projet.countDocuments(),
        inv.countDocuments(),
        enp.countDocuments(),
        projet.distinct('secteur')
    ])
        .then(([totalProjets, totalInvestisseurs, totalEntrepreneurs, secteursDistincts]) => {
            res.json({
                totalProjets,
                totalInvestisseurs,
                totalEntrepreneurs,
                secteursActifs: secteursDistincts.length,
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors du calcul des statistiques', error: err });
        });
});

// ============================================================
// ===================== RÉUNIONS ============================
// ============================================================

// ===== Créer une demande de réunion (investisseur -> admin) =====
app.post('/Reunion', async (req, res) => {
    try {
        const { projet_id, investisseur_id, message } = req.body;

        if (!projet_id || !investisseur_id) {
            return res.status(400).json({ message: 'projet_id et investisseur_id sont requis' });
        }

        const projetTrouve = await projet.findById(projet_id);
        if (!projetTrouve) {
            return res.status(404).json({ message: 'Projet introuvable' });
        }

        const data = new reunion({
            projet_id,
            entrepreneur_id: projetTrouve.entrepreneur_id || undefined,
            investisseur_id,
            message: message || '',
            statut: 'en_attente',
        });

        await data.save();
        res.json({ message: 'Demande de réunion envoyée avec succès' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur lors de la création de la demande', error: err });
    }
});

// ===== Liste de toutes les demandes de réunion (vue admin) =====
app.get('/Reunions', (req, res) => {
    reunion.find({})
        .populate('projet_id')
        .populate('entrepreneur_id', '-mot_de_passe')
        .populate('investisseur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((reunions) => res.json(reunions))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des réunions', error: err }); });
});

// ===== Réunions liées à un investisseur précis =====
app.get('/Reunions/investisseur/:id', (req, res) => {
    reunion.find({ investisseur_id: req.params.id })
        .populate('projet_id')
        .populate('entrepreneur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((reunions) => res.json(reunions))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des réunions', error: err }); });
});

// ===== Réunions liées à un entrepreneur précis =====
app.get('/Reunions/entrepreneur/:id', (req, res) => {
    reunion.find({ entrepreneur_id: req.params.id })
        .populate('projet_id')
        .populate('investisseur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((reunions) => res.json(reunions))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des réunions', error: err }); });
});

// ===== Admin planifie la date/heure, ou enregistre la décision post-réunion =====
app.put('/Reunion/:id', (req, res) => {
    const { date_reunion, heure_reunion, statut, decision, lien_meet } = req.body;

    const updateFields = {};
    if (date_reunion) updateFields.date_reunion = date_reunion;
    if (heure_reunion) updateFields.heure_reunion = heure_reunion;
    if (statut) updateFields.statut = statut;
    if (decision) updateFields.decision = decision;
    if (lien_meet !== undefined) updateFields.lien_meet = lien_meet;

    reunion.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Réunion introuvable' });
            res.json({ message: 'Réunion mise à jour avec succès', reunion: updated });
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); });
});

// ===== Annuler / supprimer une réunion =====
app.delete('/Reunion/:id', (req, res) => {
    reunion.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Réunion supprimée' }))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la suppression', error: err }); });
});

// ============================================================
// ===================== CONTRATS ============================
// ============================================================

// ===== Créer un contrat (auto-créé quand l'admin accepte une réunion) =====
app.post('/Contrat', async (req, res) => {
    try {
        const { reunion_id, projet_id, entrepreneur_id, investisseur_id } = req.body;

        if (!projet_id || !investisseur_id) {
            return res.status(400).json({ message: 'projet_id et investisseur_id sont requis' });
        }

        // Évite les doublons si un contrat existe déjà pour cette réunion
        const existing = await contrat.findOne({ reunion_id });
        if (existing) {
            return res.json({ message: 'Contrat déjà existant', contrat: existing });
        }

        const data = new contrat({
            reunion_id,
            projet_id,
            entrepreneur_id: entrepreneur_id || undefined,
            investisseur_id,
        });

        await data.save();
        res.json({ message: 'Contrat créé avec succès', contrat: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Erreur lors de la création du contrat', error: err });
    }
});

// ===== Un seul contrat (détails complets, pour affichage/impression) =====
app.get('/Contrat/:id', (req, res) => {
    contrat.findById(req.params.id)
        .populate('projet_id')
        .populate('entrepreneur_id', '-mot_de_passe')
        .populate('investisseur_id', '-mot_de_passe')
        .then((c) => {
            if (!c) return res.status(404).json({ message: 'Contrat introuvable' });
            res.json(c);
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération du contrat', error: err }); });
});

// ===== Liste de tous les contrats (vue admin) =====
app.get('/Contrats', (req, res) => {
    contrat.find({})
        .populate('projet_id')
        .populate('entrepreneur_id', '-mot_de_passe')
        .populate('investisseur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((contrats) => res.json(contrats))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error: err }); });
});

// ===== Contrats liés à un investisseur =====
app.get('/Contrats/investisseur/:id', (req, res) => {
    contrat.find({ investisseur_id: req.params.id })
        .populate('projet_id')
        .populate('entrepreneur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((contrats) => res.json(contrats))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error: err }); });
});

// ===== Contrats liés à un entrepreneur =====
app.get('/Contrats/entrepreneur/:id', (req, res) => {
    contrat.find({ entrepreneur_id: req.params.id })
        .populate('projet_id')
        .populate('investisseur_id', '-mot_de_passe')
        .sort({ DateCreation: -1 })
        .then((contrats) => res.json(contrats))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération des contrats', error: err }); });
});

// ===== Admin met à jour un contrat (montant, %, statut, détails) =====
app.put('/Contrat/:id', (req, res) => {
    const { montant, pourcentage_participation, statut, details } = req.body;

    const updateFields = {};
    if (montant !== undefined) updateFields.montant = montant;
    if (pourcentage_participation !== undefined) updateFields.pourcentage_participation = pourcentage_participation;
    if (statut) updateFields.statut = statut;
    if (details !== undefined) updateFields.details = details;

    contrat.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Contrat introuvable' });
            res.json({ message: 'Contrat mis à jour avec succès', contrat: updated });
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); });
});

// ============================================================

app.post('/Register', (req, res) => {
    console.log('inscription recu');
     console.log('secteurs reçus:', req.body.secteurs); 
     console.log('body complet reçu:', req.body);     
    console.log('secteurs reçus:', req.body.secteurs); 

    const data = new inv({
        statut: req.body.statut,
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe,
        gouvernorat: req.body.gouvernorat,
        secteurs: Array.from(req.body.secteurs),
       
    });

     data.save()
        .then(() => {
            res.json({ message: 'profile ajouté avec succès' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la création du compte' });
        });
});

app.post('/Register_enp', (req, res) => {
    console.log('inscription recu');
    console.log('body complet reçu:', req.body);
    console.log('secteurs reçus:', req.body.secteurs);

    const data = new enp({
        statut: req.body.statut,
        nom_prenom: req.body.nom_prenom,
        pays_de_residence: req.body.pays_de_residence,
        ville_de_residence: req.body.ville_de_residence,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe,
        secteurs: Array.from(req.body.secteurs),
    });

    data.save()
        .then(() => {
            res.json({ message: 'profile ajouté avec succès' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la création du compte' });
        });
});


// ============================================================
// Routes à ajouter dans server.js pour que Modifier/Supprimer
// fonctionnent aussi sur Projets, Investisseurs, Entrepreneurs.
// ============================================================

// ----- PROJETS -----

// ===== Modifier un projet (admin) =====
app.put('/Projet/:id', (req, res) => {
    const { Titre_projet, Localisation_projet, bud_min_projet, bud_max_projet, secteur, type_projet } = req.body;

    const updateFields = {};
    if (Titre_projet !== undefined) updateFields.Titre_projet = Titre_projet;
    if (Localisation_projet !== undefined) updateFields.Localisation_projet = Localisation_projet;
    if (bud_min_projet !== undefined) updateFields.bud_min_projet = bud_min_projet;
    if (bud_max_projet !== undefined) updateFields.bud_max_projet = bud_max_projet;
    if (secteur !== undefined) updateFields.secteur = secteur;
    if (type_projet !== undefined) updateFields.type_projet = type_projet;

    projet.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Projet introuvable' });
            res.json({ message: 'Projet mis à jour avec succès', projet: updated });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err });
        });
});

// ===== Supprimer un projet (admin) =====
app.delete('/Projet/:id', (req, res) => {
    projet.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Projet supprimé' }))
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la suppression', error: err }); });
});


// ----- INVESTISSEURS -----

// ===== Modifier un investisseur (admin) =====
app.put('/Investisseur/:id', (req, res) => {
    const { nom, prenom, email, gouvernorat, secteurs } = req.body;

    const updateFields = {};
    if (nom !== undefined) updateFields.nom = nom;
    if (prenom !== undefined) updateFields.prenom = prenom;
    if (email !== undefined) updateFields.email = email;
    if (gouvernorat !== undefined) updateFields.gouvernorat = gouvernorat;
    if (secteurs !== undefined) updateFields.secteurs = secteurs;

    inv.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .select('-mot_de_passe')
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Investisseur introuvable' });
            res.json({ message: 'Investisseur mis à jour avec succès', investisseur: updated });
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); });
});


// ----- ENTREPRENEURS -----

// ===== Modifier un entrepreneur (admin) =====
app.put('/Entrepreneur/:id', (req, res) => {
    const { nom_prenom, pays_de_residence, ville_de_residence, email, secteurs } = req.body;

    const updateFields = {};
    if (nom_prenom !== undefined) updateFields.nom_prenom = nom_prenom;
    if (pays_de_residence !== undefined) updateFields.pays_de_residence = pays_de_residence;
    if (ville_de_residence !== undefined) updateFields.ville_de_residence = ville_de_residence;
    if (email !== undefined) updateFields.email = email;
    if (secteurs !== undefined) updateFields.secteurs = secteurs;

    enp.findByIdAndUpdate(req.params.id, updateFields, { new: true })
        .select('-mot_de_passe')
        .then((updated) => {
            if (!updated) return res.status(404).json({ message: 'Entrepreneur introuvable' });
            res.json({ message: 'Entrepreneur mis à jour avec succès', entrepreneur: updated });
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err }); });
});

// ===== Login (investisseur / entrepreneur / admin) =====
app.post('/Login', (req, res) => {
  console.log('login reçu:', req.body);

  const { statut, email, mot_de_passe } = req.body;

  let Model;
  if (statut === 'investisseur') {
    Model = inv;
  } else if (statut === 'entrepreneur') {
    Model = enp;
  } else if (statut === 'admin') {
    Model = adm;
  } else {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  Model.findOne({ email: email, mot_de_passe: mot_de_passe })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, statut: user.statut },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user._id,
          email: user.email,
          statut: user.statut,
          nom: user.nom || undefined,
          prenom: user.prenom || undefined,
          nom_prenom: user.nom_prenom || undefined,
          secteurs: user.secteurs || undefined,
        }
      });
    })
    .catch((err) => {
      console.log('ERREUR LOGIN:', err);
      res.status(500).json({ message: 'Erreur serveur', error: err });
    });
});
// ===== Récupérer un investisseur précis (pour la page "Mon profil") =====
app.get('/Investisseur/:id', (req, res) => {
    inv.findById(req.params.id)
        .select('-mot_de_passe')
        .then((user) => {
            if (!user) return res.status(404).json({ message: 'Investisseur introuvable' });
            res.json(user);
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération', error: err }); });
});

// ===== Récupérer un entrepreneur précis (pour la page "Mon profil") =====
app.get('/Entrepreneur/:id', (req, res) => {
    enp.findById(req.params.id)
        .select('-mot_de_passe')
        .then((user) => {
            if (!user) return res.status(404).json({ message: 'Entrepreneur introuvable' });
            res.json(user);
        })
        .catch((err) => { console.log(err); res.status(500).json({ message: 'Erreur lors de la récupération', error: err }); });
});
module.exports = app;