import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SECTEURS = [
  { value: "technologie", label: "Secteur de la technologie" },
  { value: "construction et immobilier", label: "Secteur construction et immobilier" },
  { value: "agriculture et agroalimentaire", label: "Secteur agriculture et agroalimentaire" },
  { value: "commerce et e-commerce", label: "Secteur commerce et e-commerce" },
  { value: "sante", label: "Secteur de la santé" },
  { value: "education", label: "Secteur de l'éducation" },
  { value: "energie et environnement", label: "Secteur énergie et environnement" },
];

export default function Poster_pr() {
  const navigate = useNavigate();

  const [titre, setTitre] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [budMin, setBudMin] = useState('');
  const [budMax, setBudMax] = useState('');
  const [secteur, setSecteur] = useState('');
  const [typeProjet, setTypeProjet] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isEntrepreneur, setIsEntrepreneur] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    if (!currentUser || currentUser.statut !== 'entrepreneur') {
      setIsEntrepreneur(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(budMin) > Number(budMax)) {
      setErrorMsg('Le budget minimum ne peut pas être supérieur au budget maximum.');
      return;
    }

    const storedUser = localStorage.getItem('user');
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    const data = {
      Titre_projet: titre,
      Localisation_projet: localisation,
      bud_min_projet: Number(budMin),
      bud_max_projet: Number(budMax),
      secteur,
      type_projet: typeProjet,
      entrepreneur_id: currentUser ? currentUser.id : undefined,
    };

    setLoading(true);

    axios.post('http://localhost:8000/Projet', data)
      .then((res) => {
        console.log(res.data.message);
        alert('Projet ajouté avec succès !');
        navigate('/Liste_proj');
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Erreur lors de l'ajout du projet. Réessayez.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
          <div className="container relative h-full">
            <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">
              <h3 className="heading3 text-white mt-2 animate animate_top" style={{ "--i": 2 }}>
                Ajouter un projet
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Form Poster projet */}
      <section className="form_register lg:py-20 sm:py-14 py-10">
        <div className="container flex items-center justify-center">
          <div className="content sm:w-[520px] w-full">
            <h3 className="heading3 text-center">
              Publiez votre projet
            </h3>
            <p className="body2 text-secondary text-center mt-2">
              Remplissez les informations ci-dessous pour proposer votre projet aux investisseurs
            </p>

            {!isEntrepreneur && (
              <p className="mt-4 text-center text-sm text-red-600">
                Connectez-vous avec un compte entrepreneur pour publier un projet.
              </p>
            )}

            <form className="form mt-6" onSubmit={handleSubmit}>

              {/* Titre */}
              <div className="form-group">
                <label>Titre du projet*</label>
                <input
                  type="text"
                  className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                  placeholder="Ex: Application mobile de livraison"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  required
                />
              </div>

              {/* Localisation */}
              <div className="form-group mt-6">
                <label>Localisation du projet*</label>
                <input
                  type="text"
                  className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                  placeholder="Ex: Tunis, Tunisie"
                  value={localisation}
                  onChange={(e) => setLocalisation(e.target.value)}
                  required
                />
              </div>

              {/* Budget */}
              <div className="flex gap-4 mt-6">
                <div className="form-group w-full">
                  <label>Budget minimum (DT)*</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="5000"
                    value={budMin}
                    onChange={(e) => setBudMin(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group w-full">
                  <label>Budget maximum (DT)*</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="20000"
                    value={budMax}
                    onChange={(e) => setBudMax(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Secteur */}
              <div className="form-group mt-6">
                <label>Secteur d'activité*</label>
                <select
                  className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg bg-white"
                  value={secteur}
                  onChange={(e) => setSecteur(e.target.value)}
                  required
                >
                  <option value="" disabled>Choisissez un secteur</option>
                  {SECTEURS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Type projet */}
              <div className="form-group mt-6">
                <label>Type de projet*</label>
                <select
                  className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg bg-white"
                  value={typeProjet}
                  onChange={(e) => setTypeProjet(e.target.value)}
                  required
                >
                  <option value="" disabled>Choisissez un type</option>
                  <option value="en ligne">En ligne</option>
                  <option value="physique">Physique</option>
                </select>
              </div>

              {errorMsg && (
                <p className="mt-4 text-red-600 text-sm">{errorMsg}</p>
              )}

              {/* Bouton */}
              <div className="block-button mt-6">
                <button type="submit" className="button-main bg-primary w-full text-center" disabled={loading}>
                  {loading ? 'Publication en cours...' : 'Publier le projet'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      <button className="scroll-to-top-btn">
        <span className="ph-bold ph-caret-up"></span>
      </button>
    </div>
  );
}