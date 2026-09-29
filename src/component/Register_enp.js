import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
export default function Register_enp() {
  const [statut, setStatut] = useState('entrepreneur');
  const navigate = useNavigate();
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pays, setPays] = useState('');
  const [ville, setVille] = useState('');
  const [secteurs, setSecteurs] = useState([]);

  const handleCheckbox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSecteurs([...secteurs, value]);
    } else {
      setSecteurs(secteurs.filter(s => s !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }

    console.log('secteurs sélectionnés:', secteurs);

    const data = {
      statut,
      nom_prenom: nom,
      email,
      mot_de_passe: password,
      pays_de_residence: pays,
      ville_de_residence: ville,
      secteurs,
    };

    console.log('données envoyées', data);

api.post('/Register_enp', data).then((res) => {
        console.log(res.data.message);
        alert('Compte créé avec succès !');
      })
      .catch(err => {
        console.log(err.message);
        alert('Erreur lors de la création du compte.');
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
              alt="breadcrumb_candidate"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container relative h-full">
            <div className="breadcrumb_content flex flex-col items-start justify-center xl:w-[1000px] lg:w-[848px] md:w-5/6 w-full h-full">
              <h3 className="heading3 text-white mt-2 animate animate_top" style={{ "--i": 2 }}>
                Inscription
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* Form Register */}
      <section className="form_register lg:py-20 sm:py-14 py-10">
        <div className="container flex items-center justify-center">
          <div className="content sm:w-[448px] w-full">
            <h3 className="heading3 text-center">
              Créer votre compte gratuitement
            </h3>

            {/* Tabs statut */}
            <div className="menu_tab w-full mt-8">
              <ul className="list grid grid-cols-2 gap-5 w-full" role="tablist">
                <li role="presentation">
                  <button
                    type="button"
                    className={`tab_btn -fill -fill-primary w-full py-3 text-button text-center rounded bg-surface duration-300 hover:text-primary ${statut === 'entrepreneur' ? 'active' : ''}`}
                    onClick={() => setStatut('entrepreneur')}
                  >
                    Entrepreneur
                  </button>
                </li>
                <li role="presentation">
                  <button
                    type="button"
                    className={`tab_btn -fill -fill-primary w-full py-3 text-button text-center rounded bg-surface duration-300 hover:text-primary ${statut === 'entrepreneur' ? 'active' : ''}`}
                    onClick={() => navigate('/Register_inv')}
                  >
                    Investisseur
                  </button>
                </li>
              </ul>
            </div>

            <div id="candidate" className="tab_list active">
              <form className="form mt-6" onSubmit={handleSubmit}>

                {/* Nom */}
                <div className="form-group">
                  <label>Votre nom et prénom*</label>
                  <input
                    type="text"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Votre nom et prénom*"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                  />
                </div>

                {/* Pays */}
                <div className="form-group mt-6">
                  <label>Votre pays de résidence*</label>
                  <input
                    type="text"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Votre pays de résidence*"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                    required
                  />
                </div>

                {/* Ville */}
                <div className="form-group mt-6">
                  <label>Votre ville de résidence*</label>
                  <input
                    type="text"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Votre ville de résidence*"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    required
                  />
                </div>

                {/* Email */}
                <div className="form-group mt-6">
                  <label>Votre adresse mail*</label>
                  <input
                    type="email"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Votre adresse mail*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Mot de passe */}
                <div className="form-group mt-6">
                  <label>Votre mot de passe*</label>
                  <input
                    type="password"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Votre mot de passe*"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Confirmer mot de passe */}
                <div className="form-group mt-6">
                  <label>Confirmez votre mot de passe*</label>
                  <input
                    type="password"
                    className="form-control w-full mt-3 border border-line px-4 h-[50px] rounded-lg"
                    placeholder="Confirmez votre mot de passe*"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {/* Secteurs */}
                <div className="form-group mt-6">
                  <label>Choisissez les secteurs préférés</label>
                  <div className="mt-3 flex flex-col gap-2">
                    {[
                      { value: 'technologie', label: 'Secteur de la technologie' },
                      { value: 'construction_immobilier', label: 'Secteur construction et immobilier' },
                      { value: 'agriculture_agroalimentaire', label: 'Secteur agriculture et agroalimentaire' },
                      { value: 'commerce_ecommerce', label: 'Secteur commerce et e-commerce' },
                      { value: 'sante', label: 'Secteur de la santé' },
                      { value: 'education', label: "Secteur de l'éducation" },
                      { value: 'energie_environnement', label: 'Secteur énergie et environnement' },
                    ].map((secteur) => (
                      <div key={secteur.value} className="sub-input-checkbox flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={secteur.value}
                          value={secteur.value}
                          checked={secteurs.includes(secteur.value)}
                          onChange={handleCheckbox}
                        />
                        <label htmlFor={secteur.value} className="text-surface1">
                          {secteur.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <hr className="mt-6" />

                {/* Conditions */}
                <div className="flex items-center mt-6">
                  <div className="sub-input-checkbox flex items-center gap-2">
                    <input id="terms" type="checkbox" required />
                    <label htmlFor="terms" className="text-surface1">
                      J'accepte{" "}
                      <a href="term-of-use.html" className="text-button hover:underline">
                        les conditions d'utilisations
                      </a>
                    </label>
                  </div>
                </div>

                {/* Bouton */}
                <div className="block-button mt-6">
                  <button type="submit" className="button-main bg-primary w-full text-center">
                    Créer un nouveau compte
                  </button>
                </div>

                <div className="navigate flex items-center justify-center gap-2 mt-6">
                  <span className="text-surface1">Avez-vous déjà un compte ?</span>
                  <a className="text-button hover:underline" href="login.html">
                    Se connecter
                  </a>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>

      <button className="scroll-to-top-btn">
        <span className="ph-bold ph-caret-up"></span>
      </button>
    </div>
  );
}