import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Mêmes secteurs que le reste du site (voir SECTEUR_LABELS côté admin) —
// gardés cohérents avec les enums utilisés dans les modèles Proj/inv/enp.
const SECTEURS = [
  { value: 'technologie', label: 'Technologie' },
  { value: 'construction et immobilier', label: 'Construction & immobilier' },
  { value: 'agriculture et agroalimentaire', label: 'Agriculture & agroalimentaire' },
  { value: 'commerce et e-commerce', label: 'Commerce & e-commerce' },
  { value: 'sante', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'energie et environnement', label: "Énergie & environnement" },
];

export default function GestProfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : null;
    setUser(parsed);

    if (!parsed) {
      setLoading(false);
      return;
    }

    if (parsed.statut === 'investisseur') {
      axios.get(`http://localhost:8000/Investisseur/${parsed.id}`)
        .then((res) => {
          setForm({
            nom: res.data.nom || '',
            prenom: res.data.prenom || '',
            email: res.data.email || '',
            gouvernorat: res.data.gouvernorat || '',
            secteurs: Array.isArray(res.data.secteurs) ? res.data.secteurs : [],
            mot_de_passe: '',
          });
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg('Impossible de charger votre profil.');
        })
        .finally(() => setLoading(false));
    } else if (parsed.statut === 'entrepreneur') {
      axios.get(`http://localhost:8000/Entrepreneur/${parsed.id}`)
        .then((res) => {
          setForm({
            nom_prenom: res.data.nom_prenom || '',
            email: res.data.email || '',
            pays_de_residence: res.data.pays_de_residence || '',
            ville_de_residence: res.data.ville_de_residence || '',
            secteurs: Array.isArray(res.data.secteurs) ? res.data.secteurs : [],
            mot_de_passe: '',
          });
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg('Impossible de charger votre profil.');
        })
        .finally(() => setLoading(false));
    } else {
      // Admin : lecture seule pour l'instant, voir note en bas de page.
      setForm({ nom: parsed.nom || '', email: parsed.email || '' });
      setLoading(false);
    }
  }, []);

  const toggleSecteur = (value) => {
    setForm((f) => {
      const current = f.secteurs || [];
      return current.includes(value)
        ? { ...f, secteurs: current.filter((s) => s !== value) }
        : { ...f, secteurs: [...current, value] };
    });
  };

  const handleSave = () => {
    if (!user) return;
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    const endpoint = user.statut === 'investisseur' ? 'Investisseur' : 'Entrepreneur';
    const payload = { ...form };
    if (!payload.mot_de_passe) delete payload.mot_de_passe; // ne pas écraser si laissé vide

    axios.put(`http://localhost:8000/${endpoint}/${user.id}`, payload)
      .then(() => {
        setSuccessMsg('Profil mis à jour avec succès.');
        // On garde le localStorage à jour pour que le header (nom affiché
        // en haut à droite) reflète tout de suite le changement.
        const updatedUser = { ...user, ...payload };
        delete updatedUser.mot_de_passe;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setForm((f) => ({ ...f, mot_de_passe: '' }));
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg("Erreur lors de la mise à jour du profil.");
      })
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!user) return;
    if (!window.confirm('Supprimer définitivement votre compte ? Cette action est irréversible.')) return;

    const endpoint = user.statut === 'investisseur' ? 'Investisseur' : 'Entrepreneur';
    axios.delete(`http://localhost:8000/${endpoint}/${user.id}`)
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      })
      .catch((err) => {
        console.log(err);
        alert('Erreur lors de la suppression du compte.');
      });
  };

  if (!user) {
    return (
      <div className="container sm:pt-28 pt-24 pb-20 flex flex-col items-center gap-4">
        <p className="body2 text-secondary text-center">
          Connectez-vous pour accéder à votre profil.
        </p>
        <button className="button-main" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </div>
    );
  }

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
            <h3 className="heading3 text-white mt-2">Mon profil</h3>
            <p className="body2 text-white mt-2">Gérez vos coordonnées et votre compte</p>
          </div>
        </div>
      </section>

      <div className="container pt-10 pb-20">
        {loading ? (
          <p className="body2 text-secondary text-center py-10">Chargement...</p>
        ) : (
          <div className="max-w-[640px] mx-auto flex flex-col gap-6">

            {errorMsg && <p className="body2 text-red-600 text-center">{errorMsg}</p>}
            {successMsg && <p className="body2 text-green-700 text-center">{successMsg}</p>}

            <div className="p-6 rounded-lg bg-white shadow-md border border-line flex flex-col gap-4">
              <strong className="heading6">Informations</strong>

              {user.statut === 'admin' ? (
                <>
                  <p className="caption1 text-secondary">
                    Nom : <span className="text-black">{form.nom || '—'}</span>
                  </p>
                  <p className="caption1 text-secondary">
                    Email : <span className="text-black">{form.email || '—'}</span>
                  </p>
                  <p className="caption1 text-secondary mt-2">
                    La modification et la suppression du compte administrateur ne sont pas encore prises en charge ici.
                  </p>
                </>
              ) : (
                <>
                  {user.statut === 'entrepreneur' ? (
                    <div>
                      <label className="caption1 text-secondary block mb-1">Nom et prénom</label>
                      <input
                        type="text"
                        className="w-full h-11 px-3 border border-line rounded-lg"
                        value={form.nom_prenom || ''}
                        onChange={(e) => setForm({ ...form, nom_prenom: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[180px]">
                        <label className="caption1 text-secondary block mb-1">Nom</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 border border-line rounded-lg"
                          value={form.nom || ''}
                          onChange={(e) => setForm({ ...form, nom: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="caption1 text-secondary block mb-1">Prénom</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 border border-line rounded-lg"
                          value={form.prenom || ''}
                          onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="caption1 text-secondary block mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full h-11 px-3 border border-line rounded-lg"
                      value={form.email || ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  {user.statut === 'investisseur' ? (
                    <div>
                      <label className="caption1 text-secondary block mb-1">Gouvernorat</label>
                      <input
                        type="text"
                        className="w-full h-11 px-3 border border-line rounded-lg"
                        value={form.gouvernorat || ''}
                        onChange={(e) => setForm({ ...form, gouvernorat: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-4 flex-wrap">
                      <div className="flex-1 min-w-[180px]">
                        <label className="caption1 text-secondary block mb-1">Pays de résidence</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 border border-line rounded-lg"
                          value={form.pays_de_residence || ''}
                          onChange={(e) => setForm({ ...form, pays_de_residence: e.target.value })}
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="caption1 text-secondary block mb-1">Ville de résidence</label>
                        <input
                          type="text"
                          className="w-full h-11 px-3 border border-line rounded-lg"
                          value={form.ville_de_residence || ''}
                          onChange={(e) => setForm({ ...form, ville_de_residence: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="caption1 text-secondary block mb-2">Secteurs d'intérêt</label>
                    <div className="flex flex-wrap gap-2">
                      {SECTEURS.map((s) => {
                        const active = (form.secteurs || []).includes(s.value);
                        return (
                          <button
                            type="button"
                            key={s.value}
                            onClick={() => toggleSecteur(s.value)}
                            className={`caption2 px-3 py-1 rounded-full border ${active ? 'bg-primary text-white border-primary' : 'border-line text-secondary'}`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="caption1 text-secondary block mb-1">
                      Nouveau mot de passe (laisser vide pour ne pas changer)
                    </label>
                    <input
                      type="password"
                      className="w-full h-11 px-3 border border-line rounded-lg"
                      value={form.mot_de_passe || ''}
                      onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                    />
                  </div>

                  <button
                    type="button"
                    className="button-main bg-primary self-start"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </button>
                </>
              )}
            </div>

            {user.statut !== 'admin' && (
              <div className="p-6 rounded-lg bg-white shadow-md border border-red-200 flex flex-col gap-3">
                <strong className="heading6 text-red-600">Zone dangereuse</strong>
                <p className="caption1 text-secondary">
                  Supprimer votre compte est définitif et ne peut pas être annulé.
                </p>
                <button
                  type="button"
                  className="text-red-600 caption1 self-start"
                  onClick={handleDelete}
                >
                  Supprimer mon compte
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}