import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SECTEUR_LABELS = {
  "technologie": "Technologie",
  "construction et immobilier": "Construction et immobilier",
  "agriculture et agroalimentaire": "Agriculture et agroalimentaire",
  "commerce et e-commerce": "Commerce et e-commerce",
  "sante": "Santé",
  "education": "Éducation",
  "energie et environnement": "Énergie et environnement",
};

const SECTEUR_VISUAL = {
  "technologie": { icon: "ph-desktop", bg: "#E4E9EE", fg: "#3B5773" },
  "construction et immobilier": { icon: "ph-buildings", bg: "#F1E7D6", fg: "#9C7A3C" },
  "agriculture et agroalimentaire": { icon: "ph-plant", bg: "#E7EEE8", fg: "#3F6C51" },
  "commerce et e-commerce": { icon: "ph-shopping-cart", bg: "#F1E7D6", fg: "#9C6B30" },
  "sante": { icon: "ph-heartbeat", bg: "#FBE4E4", fg: "#A6362A" },
  "education": { icon: "ph-graduation-cap", bg: "#E4E9EE", fg: "#3B5773" },
  "energie et environnement": { icon: "ph-lightning", bg: "#FFF3D6", fg: "#9C6B30" },
};

const STATUT_LABELS = {
  en_attente: "En attente",
  valide: "Validé",
  refuse: "Refusé",
};

const STATUT_STYLE = {
  en_attente: { bg: "#FFF3D6", fg: "#9C6B30" },
  valide: { bg: "#E7EEE8", fg: "#3F6C51" },
  refuse: { bg: "#FBE4E4", fg: "#A6362A" },
};

export default function Liste_pro() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  const secteurFiltre = searchParams.get('secteur') || '';
  const searchQuery = searchParams.get('q') || '';
  const isAdmin = user && user.statut === 'admin';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(currentUser);

    setLoading(true);
    const params = new URLSearchParams();
    if (secteurFiltre) params.set('secteurs', secteurFiltre);
    if (currentUser && currentUser.statut === 'admin') params.set('vue', 'admin');

    const url = `http://localhost:8000/Projets${params.toString() ? `?${params.toString()}` : ''}`;

    axios.get(url)
      .then((res) => setProjets(res.data))
      .catch((err) => {
        console.log(err);
        setErrorMsg('Impossible de charger les projets pour le moment.');
      })
      .finally(() => setLoading(false));
  }, [secteurFiltre]);

  const projetsAffiches = searchQuery
    ? projets.filter((p) =>
        (p.Titre_projet || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.Localisation_projet || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : projets;

  const handleResetFilters = () => setSearchParams({});

  const handlePlanifierReunion = (projetId) => {
    if (!user) {
      alert('Connectez-vous avec un compte investisseur pour planifier une réunion.');
      return;
    }
    if (user.statut !== 'investisseur') {
      alert('Seuls les investisseurs peuvent planifier une réunion.');
      return;
    }

    axios.post('http://localhost:8000/Reunion', {
      projet_id: projetId,
      investisseur_id: user.id,
    })
      .then((res) => {
        alert(res.data.message);
        setSentRequests((prev) => [...prev, projetId]);
        navigate('/Liste_des_reuinions');
      })
      .catch((err) => {
        console.log(err);
        alert("Erreur lors de l'envoi de la demande de réunion.");
      });
  };

  const handleValider = (projetId) => {
    axios.patch(`http://localhost:8000/Projet/${projetId}/valider`)
      .then((res) => {
        alert(res.data.message);
        setProjets((prev) => prev.map((p) => (p._id === projetId ? { ...p, statut: 'valide' } : p)));
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la validation du projet.');
      });
  };

  const handleRefuser = (projetId) => {
    axios.patch(`http://localhost:8000/Projet/${projetId}/refuser`)
      .then((res) => {
        alert(res.data.message);
        setProjets((prev) => prev.map((p) => (p._id === projetId ? { ...p, statut: 'refuse' } : p)));
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors du refus du projet.');
      });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="breadcrumb_inner relative h-[330px] flex items-center pt-16 sm:pt-20">
          <div className="breadcrumb_bg absolute top-0 left-0 w-full h-full">
            <img src="/assets/images/logo.png" alt="breadcrumb" className="w-full h-full object-cover" />
          </div>
          <div className="container relative h-full">
            <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">
              <h3 className="heading3 text-white mt-2 animate animate_top" style={{ "--i": 2 }}>
                {isAdmin ? "Gestion des projets" : "Liste des projets"}
              </h3>
              <p className="body2 text-white mt-2 animate animate_top" style={{ "--i": 3 }}>
                {isAdmin
                  ? "Validez ou refusez les projets soumis par les entrepreneurs"
                  : "Découvrez tous les projets proposés par nos entrepreneurs"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des projets */}
      <section className="feature_services lg:py-20 sm:py-14 py-10">
        <div className="container">

          {(secteurFiltre || searchQuery) && (
            <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-line">
              <span className="caption1 text-secondary">Filtres actifs:</span>
              {secteurFiltre && <span className="tag caption2 bg-surface">{SECTEUR_LABELS[secteurFiltre] || secteurFiltre}</span>}
              {searchQuery && <span className="tag caption2 bg-surface">"{searchQuery}"</span>}
              <button type="button" onClick={handleResetFilters} className="text-primary caption1 hover:underline">Réinitialiser</button>
            </div>
          )}

          {loading && <p className="body2 text-secondary text-center py-10">Chargement des projets...</p>}
          {!loading && errorMsg && <p className="body2 text-center py-10 text-red-600">{errorMsg}</p>}
          {!loading && !errorMsg && projetsAffiches.length === 0 && (
            <p className="body2 text-secondary text-center py-10">Aucun projet ne correspond à votre recherche.</p>
          )}

          {!loading && !errorMsg && projetsAffiches.length > 0 && (
            <div className="list grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-7.5 gap-6">
              {projetsAffiches.map((projet) => (
                <div key={projet._id} className="service_item overflow-hidden relative rounded-lg bg-white shadow-md duration-300 hover:shadow-xl">
                  <div
                    className="service_thumb flex items-center justify-center"
                    style={{ height: '160px', background: (SECTEUR_VISUAL[projet.secteur] || {}).bg || '#EEEBE2' }}
                  >
                    <span
                      className={`ph-fill ${(SECTEUR_VISUAL[projet.secteur] || {}).icon || 'ph-briefcase'}`}
                      style={{ fontSize: '56px', color: (SECTEUR_VISUAL[projet.secteur] || {}).fg || '#4A5266' }}
                    />
                  </div>

                  <div className="service_info py-5 px-4">
                    <div className="flex items-center justify-between">
                      <span className="tag caption2 bg-surface">{SECTEUR_LABELS[projet.secteur] || projet.secteur}</span>
                      <span className="caption1 text-secondary capitalize">{projet.type_projet}</span>
                    </div>

                    {isAdmin && (
                      <div className="mt-2">
                        <span
                          className="tag caption2"
                          style={{
                            background: (STATUT_STYLE[projet.statut] || {}).bg || '#EEEBE2',
                            color: (STATUT_STYLE[projet.statut] || {}).fg || '#4A5266',
                          }}
                        >
                          {STATUT_LABELS[projet.statut] || projet.statut}
                        </span>
                      </div>
                    )}

                    <div className="service_title text-title pt-2">{projet.Titre_projet}</div>

                    <div className="flex items-center gap-1 mt-2 text-secondary">
                      <span className="ph ph-map-pin" />
                      <span className="caption1">{projet.Localisation_projet}</span>
                    </div>

                    <div className="service_more_info flex items-center justify-between mt-4 pt-4 border-t border-line">
                      <div className="service_price">
                        <span className="text-secondary">budget: </span>
                        <span className="text-title">{projet.bud_min_projet} - {projet.bud_max_projet} DT</span>
                      </div>
                    </div>

                    {/* Admin: valider / refuser, seulement si en_attente */}
                    {isAdmin && projet.statut === 'en_attente' && (
                      <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => handleValider(projet._id)} className="button-main w-full text-center bg-primary">
                          Valider le projet
                        </button>
                        <button type="button" onClick={() => handleRefuser(projet._id)} className="button-main w-full text-center bg-red-600">
                          Refuser
                        </button>
                      </div>
                    )}

                    {/* Investisseur / visiteur: planifier réunion */}
                    {!isAdmin && (!user || user.statut === 'investisseur') && (
                      <button
                        type="button"
                        onClick={() => handlePlanifierReunion(projet._id)}
                        disabled={sentRequests.includes(projet._id)}
                        className="button-main w-full text-center mt-4 disabled:opacity-50"
                      >
                        {sentRequests.includes(projet._id) ? 'Demande envoyée' : 'Planifier une réunion'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <button className="scroll-to-top-btn">
        <span className="ph-bold ph-caret-up"></span>
      </button>
    </div>
  );
}