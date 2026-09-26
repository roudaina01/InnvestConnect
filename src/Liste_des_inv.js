import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SECTEUR_LABELS = {
  "technologie": "Technologie",
  "construction et immobilier": "Construction et immobilier",
  "agriculture et agroalimentaire": "Agriculture et agroalimentaire",
  "commerce et e-commerce": "Commerce et e-commerce",
  "sante": "Santé",
  "education": "Éducation",
  "energie et environnement": "Énergie et environnement",
};

const AVATAR_COUNT = 8;
const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function Liste_des_inv() {
  const [investisseurs, setInvestisseurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchInvestisseurs();
  }, []);

  const fetchInvestisseurs = () => {
    axios.get('http://localhost:8000/Investisseurs')
      .then((res) => {
        setInvestisseurs(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg('Impossible de charger les investisseurs pour le moment.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Supprimer définitivement ce compte investisseur ?')) return;
    axios.delete(`http://localhost:8000/Investisseur/${id}`)
      .then(() => {
        setInvestisseurs((prev) => prev.filter((i) => i._id !== id));
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la suppression.');
      });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <section className="breadcrumb">
        <div className="breadcrumb_inner relative h-[330px] flex items-center pt-16 sm:pt-20">
          <div className="breadcrumb_bg absolute top-0 left-0 w-full h-full">
            <img
              src="/assets/images/components/breadcrumb_employer.webp"
              alt="breadcrumb"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative h-full">
            <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">
              <h3 className="heading3 text-white mt-2 animate animate_top" style={{ "--i": 2 }}>
                Liste des investisseurs
              </h3>
              <p className="body2 text-white mt-2 animate animate_top" style={{ "--i": 3 }}>
                Découvrez les investisseurs actifs sur la plateforme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des investisseurs */}
      <section className="lg:py-20 sm:py-14 py-10">
        <div className="container">

          {loading && (
            <p className="body2 text-secondary text-center py-10">Chargement...</p>
          )}

          {!loading && errorMsg && (
            <p className="body2 text-center py-10 text-red-600">{errorMsg}</p>
          )}

          {!loading && !errorMsg && investisseurs.length === 0 && (
            <p className="body2 text-secondary text-center py-10">Aucun investisseur inscrit pour le moment.</p>
          )}

          {!loading && !errorMsg && investisseurs.length > 0 && (
            <ul className="list grid md:grid-cols-2 gap-7.5">
              {investisseurs.map((inv) => (
                <li
                  key={inv._id}
                  className="candidates_item px-6 py-5 rounded-lg bg-white shadow-md duration-300 hover:shadow-xl"
                >
                  <div className="candidates_info flex gap-4 w-full pb-4 border-b border-line">
                    <div
                      className="overflow-hidden flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center"
                      style={{ background: '#E4E9EE' }}
                    >
                      <strong style={{ color: '#3B5773', fontSize: '18px' }}>
                        {getInitials(inv.prenom || inv.nom ? `${inv.prenom || ''} ${inv.nom || ''}`.trim() : inv.email)}
                      </strong>
                    </div>

                    <div className="candidates_content w-full">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <div className="candidates_detail flex flex-col gap-0.5">
                          <strong className="candidates_name text-title -style-1">
                            {inv.prenom || inv.nom ? `${inv.prenom || ''} ${inv.nom || ''}`.trim() : inv.email}
                          </strong>
                          {(inv.prenom || inv.nom) && (
                            <span className="caption1 text-secondary">{inv.email}</span>
                          )}
                          {inv.gouvernorat && (
                            <span className="flex items-center text-secondary">
                              <span className="ph ph-map-pin text-lg" />
                              <span className="candidates_address -style-1 caption1 pl-1">
                                {inv.gouvernorat}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between w-full gap-3 mt-2">
                        <a href={`mailto:${inv.email}`} className="button-main -border">
                          Contacter
                        </a>
                        {user && user.statut === 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDelete(inv._id)}
                            className="text-red-600 caption1 hover:underline"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="candidates_more_info flex flex-wrap items-center gap-2.5 pt-4">
                    {(inv.secteurs || []).map((s) => (
                      <span key={s} className="candidates_tag tag bg-surface">
                        {SECTEUR_LABELS[s] || s}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      </section>

      <button className="scroll-to-top-btn"><span className="ph-bold ph-caret-up" /></button>
    </div>
  );
}