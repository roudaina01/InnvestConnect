import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../api'
const STATUT_LABELS = {
  en_attente: 'En attente',
  planifiee: 'Planifiée',
  annulee: 'Annulée',
};

const STATUT_COLORS = {
  en_attente: 'bg-yellow text-white',
  planifiee: 'bg-primary text-white',
  annulee: 'bg-red text-white',
};

const DECISION_LABELS = {
  en_attente: 'Décision en attente',
  accepte: '✅ Accepté — vers le contrat',
  refuse: '❌ Refusé',
};

const DECISION_COLORS = {
  en_attente: 'bg-surface text-secondary',
  accepte: 'bg-green text-white',
  refuse: 'bg-red text-white',
};

export default function Liste_des_reuinions() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [reunions, setReunions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Formulaire de planification (admin uniquement)
  const [openFormId, setOpenFormId] = useState(null);
  const [dateInput, setDateInput] = useState('');
  const [heureInput, setHeureInput] = useState('');
  const [lienMeetInput, setLienMeetInput] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    // RequireAuth garantit déjà qu'un utilisateur est connecté à ce stade
    setUser(parsedUser);
    fetchReunions(parsedUser);
  }, []);

  const fetchReunions = (currentUser) => {
    setLoading(true);

    let url = 'http://localhost:8000/Reunions';
    if (currentUser.statut === 'investisseur') {
      url = `http://localhost:8000/Reunions/investisseur/${currentUser.id}`;
    } else if (currentUser.statut === 'entrepreneur') {
      url = `http://localhost:8000/Reunions/entrepreneur/${currentUser.id}`;
    }
    // admin -> garde l'URL par défaut (toutes les réunions)

    axios.get(url)
      .then((res) => {
        setReunions(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg('Impossible de charger les réunions.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenForm = (reunionItem) => {
    setOpenFormId(reunionItem._id);
    setDateInput(reunionItem.date_reunion ? reunionItem.date_reunion.substring(0, 10) : '');
    setHeureInput(reunionItem.heure_reunion || '');
    setLienMeetInput(reunionItem.lien_meet || '');
  };

  const handlePlanifier = (id) => {
    if (!dateInput || !heureInput) {
      alert('Choisissez une date et une heure.');
      return;
    }

    axios.put(`http://localhost:8000/Reunion/${id}`, {
      date_reunion: dateInput,
      heure_reunion: heureInput,
      lien_meet: lienMeetInput,
      statut: 'planifiee',
    })
      .then(() => {
        setOpenFormId(null);
        fetchReunions(user);
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la planification.');
      });
  };

  const handleAnnuler = (id) => {
    if (!window.confirm('Annuler cette réunion ?')) return;

    axios.put(`http://localhost:8000/Reunion/${id}`, { statut: 'annulee' })
      .then(() => fetchReunions(user))
      .catch((err) => {
        console.log(err);
        alert("Erreur lors de l'annulation.");
      });
  };

  const handleDecision = (id, decision) => {
    const confirmMsg = decision === 'accepte'
      ? 'Confirmer: cette réunion a eu lieu et on passe au contrat ?'
      : 'Confirmer: cette réunion a eu lieu mais on ne donne pas suite ?';
    if (!window.confirm(confirmMsg)) return;

    axios.put(`http://localhost:8000/Reunion/${id}`, { decision })
      .then(() => {
        if (decision === 'accepte') {
          const r = reunions.find((x) => x._id === id);
          if (r) {
            return axios.post('http://localhost:8000/Contrat', {
              reunion_id: id,
              projet_id: r.projet_id ? r.projet_id._id : undefined,
              entrepreneur_id: r.entrepreneur_id ? r.entrepreneur_id._id : undefined,
              investisseur_id: r.investisseur_id ? r.investisseur_id._id : undefined,
            });
          }
        }
      })
      .then(() => fetchReunions(user))
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de l\'enregistrement de la décision.');
      });
  };

  const handleSupprimer = (id) => {
    if (!window.confirm('Supprimer définitivement cette demande ?')) return;

    axios.delete(`http://localhost:8000/Reunion/${id}`)
      .then(() => fetchReunions(user))
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la suppression.');
      });
  };

  if (!user) {
    return (
      <div className="container sm:pt-28 pt-24 pb-20 flex flex-col items-center gap-4">
        <p className="body2 text-secondary text-center">
          Connectez-vous pour voir vos réunions.
        </p>
        <button className="button-main" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </div>
    );
  }

  const isAdmin = user.statut === 'admin';

  const pageTitle = isAdmin ? 'Gestion des réunions' : 'Mes réunions';
  const pageSubtitle = isAdmin
    ? 'Demandes de réunion entre investisseurs et entrepreneurs'
    : user.statut === 'investisseur'
      ? "Suivez ici l'état de vos demandes de réunion"
      : 'Réunions demandées pour vos projets';

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="breadcrumb_inner relative h-[330px] flex items-center pt-16 sm:pt-20">
          <div className="breadcrumb_bg absolute top-0 left-0 w-full h-full">
            <img
              src="/assets/images/logo.png"
              alt="breadcrumb"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative h-full flex flex-col justify-center">
            <h3 className="heading3 text-white mt-2">{pageTitle}</h3>
            <p className="body2 text-white mt-2">{pageSubtitle}</p>
          </div>
        </div>
      </section>

      <div className="container pt-10 pb-20">

      <div className="mt-8">
        {loading && (
          <p className="body2 text-secondary text-center py-10">Chargement...</p>
        )}

        {!loading && errorMsg && (
          <p className="body2 text-center py-10 text-red-600">{errorMsg}</p>
        )}

        {!loading && !errorMsg && reunions.length === 0 && (
          <p className="body2 text-secondary text-center py-10">
            {isAdmin ? 'Aucune demande de réunion pour le moment.' : "Vous n'avez aucune réunion pour le moment."}
          </p>
        )}

        {!loading && !errorMsg && reunions.length > 0 && (
          <div className="flex flex-col gap-4">
            {reunions.map((r) => (
              <div key={r._id} className="p-5 rounded-lg bg-white shadow-md border border-line">

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <strong className="heading6">
                      {r.projet_id ? r.projet_id.Titre_projet : 'Projet supprimé'}
                    </strong>

                    {isAdmin && (
                      <>
                        <p className="caption1 text-secondary mt-1">
                          Investisseur: <span className="text-black">{r.investisseur_id ? r.investisseur_id.email : '—'}</span>
                        </p>
                        <p className="caption1 text-secondary">
                          Entrepreneur: <span className="text-black">{r.entrepreneur_id ? r.entrepreneur_id.nom_prenom : '—'}</span>
                        </p>
                      </>
                    )}

                    {user.statut === 'investisseur' && (
                      <p className="caption1 text-secondary mt-1">
                        Entrepreneur: <span className="text-black">{r.entrepreneur_id ? r.entrepreneur_id.nom_prenom : 'En attente de contact'}</span>
                      </p>
                    )}

                    {user.statut === 'entrepreneur' && (
                      <p className="caption1 text-secondary mt-1">
                        Investisseur: <span className="text-black">{r.investisseur_id ? r.investisseur_id.email : '—'}</span>
                      </p>
                    )}

                    {r.message && (
                      <p className="caption1 text-secondary mt-1">Message: {r.message}</p>
                    )}

                    {r.statut === 'planifiee' && (
                      <p className="caption1 mt-2 text-primary font-semibold">
                        📅 {r.date_reunion ? new Date(r.date_reunion).toLocaleDateString('fr-FR') : ''} à {r.heure_reunion}
                      </p>
                    )}

                    {r.statut === 'planifiee' && r.lien_meet && (
                      <p className="caption1 mt-1">
                        🔗 <a
                          href={r.lien_meet}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          {r.lien_meet}
                        </a>
                      </p>
                    )}

                    {r.statut === 'planifiee' && r.decision && r.decision !== 'en_attente' && (
                      <span className={`inline-block mt-2 caption2 px-3 py-1 rounded-full ${DECISION_COLORS[r.decision]}`}>
                        {DECISION_LABELS[r.decision]}
                      </span>
                    )}

                    {r.decision === 'accepte' && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="text-primary caption1 hover:underline"
                          onClick={() => navigate('/Liste_des_contrats')}
                        >
                          Voir le contrat →
                        </button>
                      </div>
                    )}

                    {r.statut === 'en_attente' && !isAdmin && (
                      <p className="caption1 mt-2 text-secondary">
                        En attente de confirmation par l'administrateur...
                      </p>
                    )}
                  </div>

                  <span className={`caption2 px-3 py-1 rounded-full flex-shrink-0 ${STATUT_COLORS[r.statut]}`}>
                    {STATUT_LABELS[r.statut]}
                  </span>
                </div>

                {isAdmin && r.statut === 'planifiee' && (!r.decision || r.decision === 'en_attente') && (
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-line">
                    <span className="caption1 text-secondary w-full">Après la réunion, on passe au contrat ?</span>
                    <button
                      type="button"
                      className="button-main bg-primary"
                      onClick={() => handleDecision(r._id, 'accepte')}
                    >
                      ✅ Oui, vers le contrat
                    </button>
                    <button
                      type="button"
                      className="button-main -border"
                      onClick={() => handleDecision(r._id, 'refuse')}
                    >
                      ❌ Non
                    </button>
                  </div>
                )}

                {isAdmin && r.statut !== 'annulee' && (
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-line">
                    <button
                      type="button"
                      className="button-main -border"
                      onClick={() => handleOpenForm(r)}
                    >
                      {r.statut === 'planifiee' ? 'Modifier la date' : 'Planifier'}
                    </button>
                    <button
                      type="button"
                      className="button-main -border"
                      onClick={() => handleAnnuler(r._id)}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="text-red-600 caption1"
                      onClick={() => handleSupprimer(r._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}

                {isAdmin && openFormId === r._id && (
                  <div className="flex flex-wrap items-end gap-3 mt-4 pt-4 border-t border-line">
                    <div>
                      <label className="caption1 text-secondary block mb-1">Date</label>
                      <input
                        type="date"
                        className="h-11 px-3 border border-line rounded-lg"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="caption1 text-secondary block mb-1">Heure</label>
                      <input
                        type="time"
                        className="h-11 px-3 border border-line rounded-lg"
                        value={heureInput}
                        onChange={(e) => setHeureInput(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <label className="caption1 text-secondary block mb-1">Lien de la réunion (Google Meet, Zoom...)</label>
                      <input
                        type="text"
                        placeholder="https://meet.google.com/..."
                        className="w-full h-11 px-3 border border-line rounded-lg"
                        value={lienMeetInput}
                        onChange={(e) => setLienMeetInput(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="button-main bg-primary"
                      onClick={() => handlePlanifier(r._id)}
                    >
                      Confirmer
                    </button>
                    <button
                      type="button"
                      className="button-main -border"
                      onClick={() => setOpenFormId(null)}
                    >
                      Annuler
                    </button>
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}