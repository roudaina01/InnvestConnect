import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const STATUT_LABELS = {
  en_negociation: 'En négociation',
  signe: 'Signé',
  annule: 'Annulé',
};

const STATUT_COLORS = {
  en_negociation: 'bg-yellow text-white',
  signe: 'bg-green text-white',
  annule: 'bg-red text-white',
};

export default function Liste_des_contrats() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contrats, setContrats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [openFormId, setOpenFormId] = useState(null);
  const [montantInput, setMontantInput] = useState('');
  const [pourcentageInput, setPourcentageInput] = useState('');
  const [detailsInput, setDetailsInput] = useState('');
  const [statutInput, setStatutInput] = useState('en_negociation');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    // RequireAuth garantit déjà qu'un utilisateur est connecté à ce stade
    setUser(parsedUser);
    fetchContrats(parsedUser);
  }, []);

  const fetchContrats = (currentUser) => {
    setLoading(true);

    let url = 'http://localhost:8000/Contrats';
    if (currentUser.statut === 'investisseur') {
      url = `http://localhost:8000/Contrats/investisseur/${currentUser.id}`;
    } else if (currentUser.statut === 'entrepreneur') {
      url = `http://localhost:8000/Contrats/entrepreneur/${currentUser.id}`;
    }

    axios.get(url)
      .then((res) => {
        setContrats(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg('Impossible de charger les contrats.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenForm = (c) => {
    setOpenFormId(c._id);
    setMontantInput(c.montant || '');
    setPourcentageInput(c.pourcentage_participation || '');
    setDetailsInput(c.details || '');
    setStatutInput(c.statut || 'en_negociation');
  };

  const handleSave = (id) => {
    axios.put(`http://localhost:8000/Contrat/${id}`, {
      montant: montantInput === '' ? undefined : Number(montantInput),
      pourcentage_participation: pourcentageInput === '' ? undefined : Number(pourcentageInput),
      details: detailsInput,
      statut: statutInput,
    })
      .then(() => {
        setOpenFormId(null);
        fetchContrats(user);
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la mise à jour du contrat.');
      });
  };

  if (!user) {
    return (
      <div className="container sm:pt-28 pt-24 pb-20 flex flex-col items-center gap-4">
        <p className="body2 text-secondary text-center">
          Connectez-vous pour voir vos contrats.
        </p>
        <button className="button-main" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </div>
    );
  }

  const isAdmin = user.statut === 'admin';

  const pageTitle = isAdmin ? 'Gestion des contrats' : 'Mes contrats';
  const pageSubtitle = isAdmin
    ? 'Contrats en cours entre investisseurs et entrepreneurs'
    : 'Suivez ici vos contrats en cours';

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

        {!loading && !errorMsg && contrats.length === 0 && (
          <p className="body2 text-secondary text-center py-10">
            {isAdmin ? 'Aucun contrat pour le moment.' : "Vous n'avez aucun contrat pour le moment."}
          </p>
        )}

        {!loading && !errorMsg && contrats.length > 0 && (
          <div className="flex flex-col gap-4">
            {contrats.map((c) => (
              <div key={c._id} className="p-5 rounded-lg bg-white shadow-md border border-line">

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <strong className="heading6">
                      {c.projet_id ? c.projet_id.Titre_projet : 'Projet supprimé'}
                    </strong>

                    {isAdmin && (
                      <>
                        <p className="caption1 text-secondary mt-1">
                          Investisseur: <span className="text-black">{c.investisseur_id ? c.investisseur_id.email : '—'}</span>
                        </p>
                        <p className="caption1 text-secondary">
                          Entrepreneur: <span className="text-black">{c.entrepreneur_id ? c.entrepreneur_id.nom_prenom : '—'}</span>
                        </p>
                      </>
                    )}

                    {user.statut === 'investisseur' && (
                      <p className="caption1 text-secondary mt-1">
                        Entrepreneur: <span className="text-black">{c.entrepreneur_id ? c.entrepreneur_id.nom_prenom : '—'}</span>
                      </p>
                    )}

                    {user.statut === 'entrepreneur' && (
                      <p className="caption1 text-secondary mt-1">
                        Investisseur: <span className="text-black">{c.investisseur_id ? c.investisseur_id.email : '—'}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      {c.montant !== undefined && c.montant !== null && (
                        <span className="caption1 text-title">
                          💰 {c.montant.toLocaleString('fr-FR')} DT
                        </span>
                      )}
                      {c.pourcentage_participation !== undefined && c.pourcentage_participation !== null && (
                        <span className="caption1 text-title">
                          📊 {c.pourcentage_participation}% participation
                        </span>
                      )}
                    </div>

                    {c.details && (
                      <p className="caption1 text-secondary mt-2">{c.details}</p>
                    )}
                  </div>

                  <span className={`caption2 px-3 py-1 rounded-full flex-shrink-0 ${STATUT_COLORS[c.statut]}`}>
                    {STATUT_LABELS[c.statut]}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-line">
                  <button
                    type="button"
                    className="button-main"
                    onClick={() => navigate(`/Contrat/${c._id}`)}
                  >
                    Voir le document (PDF)
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      className="button-main -border"
                      onClick={() => handleOpenForm(c)}
                    >
                      Modifier
                    </button>
                  )}
                </div>

                {isAdmin && openFormId === c._id && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-line">
                    <div>
                      <label className="caption1 text-secondary block mb-1">Montant (DT)</label>
                      <input
                        type="number"
                        className="w-full h-11 px-3 border border-line rounded-lg"
                        value={montantInput}
                        onChange={(e) => setMontantInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="caption1 text-secondary block mb-1">Participation (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className="w-full h-11 px-3 border border-line rounded-lg"
                        value={pourcentageInput}
                        onChange={(e) => setPourcentageInput(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="caption1 text-secondary block mb-1">Statut</label>
                      <select
                        className="w-full h-11 px-3 border border-line rounded-lg bg-white"
                        value={statutInput}
                        onChange={(e) => setStatutInput(e.target.value)}
                      >
                        <option value="en_negociation">En négociation</option>
                        <option value="signe">Signé</option>
                        <option value="annule">Annulé</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="caption1 text-secondary block mb-1">Détails</label>
                      <textarea
                        className="w-full px-3 py-2 border border-line rounded-lg"
                        rows={3}
                        value={detailsInput}
                        onChange={(e) => setDetailsInput(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-3">
                      <button
                        type="button"
                        className="button-main bg-primary"
                        onClick={() => handleSave(c._id)}
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        className="button-main -border"
                        onClick={() => setOpenFormId(null)}
                      >
                        Annuler
                      </button>
                    </div>
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