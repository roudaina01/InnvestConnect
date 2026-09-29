import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import BLOG_POSTS from './Blogdata';
import './Acceuil.css';
import api from '../api'
const SECTEUR_LABELS = {
  "technologie": "Technologie",
  "construction et immobilier": "Construction et immobilier",
  "agriculture et agroalimentaire": "Agriculture et agroalimentaire",
  "commerce et e-commerce": "Commerce et e-commerce",
  "sante": "Santé",
  "education": "Éducation",
  "energie et environnement": "Énergie et environnement",
};

// Icône + teinte par secteur, repris tel quel de Liste_pro.jsx pour que les
// deux pages soient visuellement identiques.
const SECTEUR_VISUAL = {
  "technologie": { icon: "ph-desktop", bg: "#E4E9EE", fg: "#3B5773" },
  "construction et immobilier": { icon: "ph-buildings", bg: "#F1E7D6", fg: "#9C7A3C" },
  "agriculture et agroalimentaire": { icon: "ph-plant", bg: "#E7EEE8", fg: "#3F6C51" },
  "commerce et e-commerce": { icon: "ph-shopping-cart", bg: "#F1E7D6", fg: "#9C6B30" },
  "sante": { icon: "ph-heartbeat", bg: "#FBE4E4", fg: "#A6362A" },
  "education": { icon: "ph-graduation-cap", bg: "#E4E9EE", fg: "#3B5773" },
  "energie et environnement": { icon: "ph-lightning", bg: "#FFF3D6", fg: "#9C6B30" },
};

// Certains comptes (entrepreneur) stockent les secteurs avec underscore
// (ex: 'construction_immobilier') alors que le modèle Proj utilise
// le format avec espaces + "et" (ex: 'construction et immobilier').
// Cette table convertit vers le format utilisé par les projets.
const SECTEUR_UNDERSCORE_TO_PROJET = {
  'technologie': 'technologie',
  'construction_immobilier': 'construction et immobilier',
  'agriculture_agroalimentaire': 'agriculture et agroalimentaire',
  'commerce_ecommerce': 'commerce et e-commerce',
  'sante': 'sante',
  'education': 'education',
  'energie_environnement': 'energie et environnement',
};
// L'inverse: format spaced+et -> format underscore
const SECTEUR_PROJET_TO_UNDERSCORE = Object.fromEntries(
  Object.entries(SECTEUR_UNDERSCORE_TO_PROJET).map(([k, v]) => [v, k])
);

const ALL_SECTEURS = Object.keys(SECTEUR_LABELS);

// Même logique d'avatar par initiales que dans Header.jsx, réutilisée ici
// au lieu d'afficher la même photo générique (IMG-8.webp) pour tout le
// monde. Pas de champ photo dans les modèles inv/enp de toute façon.
const AVATAR_COLORS = {
  investisseur: { bg: '#E4E9EE', fg: '#3B5773' },
  entrepreneur: { bg: '#E7EEE8', fg: '#3F6C51' },
};

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function Acceuil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSecteur, setSelectedSecteur] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedSecteur) params.set('secteur', selectedSecteur);
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    navigate(`/Liste_proj?${params.toString()}`);
  };
  const [projets, setProjets] = useState([]);
  const [loadingProjets, setLoadingProjets] = useState(false);
  const [secteurCounts, setSecteurCounts] = useState([]);
  const [matchedProfiles, setMatchedProfiles] = useState([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [stats, setStats] = useState({ totalProjets: 0, totalInvestisseurs: 0, totalEntrepreneurs: 0, secteursActifs: 0 });
  const categoriesScrollRef = React.useRef(null);

  const scrollCategories = (direction) => {
    if (categoriesScrollRef.current) {
      categoriesScrollRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    axios.get('http://localhost:8000/Projets/secteurs-count')
      .then((res) => {
        setSecteurCounts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios.get('http://localhost:8000/Stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.secteurs && parsedUser.secteurs.length > 0) {
        setLoadingProjets(true);
        const secteursForQuery = parsedUser.secteurs.map(
          (s) => SECTEUR_UNDERSCORE_TO_PROJET[s] || s
        );
        axios.get(`http://localhost:8000/Projets?secteurs=${secteursForQuery.join(',')}`)
          .then((res) => {
            setProjets(res.data);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoadingProjets(false);
          });

        // Profils correspondants: un entrepreneur voit des investisseurs, un investisseur voit des entrepreneurs
        setLoadingProfiles(true);
        if (parsedUser.statut === 'entrepreneur') {
          const secteursForInv = parsedUser.secteurs.map(
            (s) => SECTEUR_UNDERSCORE_TO_PROJET[s] || s
          );
          axios.get(`http://localhost:8000/Investisseurs?secteurs=${secteursForInv.join(',')}`)
            .then((res) => setMatchedProfiles(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoadingProfiles(false));
        } else if (parsedUser.statut === 'investisseur') {
          const secteursForEnp = parsedUser.secteurs.map(
            (s) => SECTEUR_PROJET_TO_UNDERSCORE[s] || s
          );
          axios.get(`http://localhost:8000/Entrepreneurs?secteurs=${secteursForEnp.join(',')}`)
            .then((res) => setMatchedProfiles(res.data))
            .catch((err) => console.log(err))
            .finally(() => setLoadingProfiles(false));
        } else {
          setLoadingProfiles(false);
        }
      }
    }
  }, []);

  return (
    <div className="acceuil-page">
       
  {/* Slider */}
  <section className="slider">
    <div className="slider_inner relative lg:h-[860px] md:h-[700px] sm:h-[500px] h-[600px] bg-[#1D3E3E]">
      <div className="container relative h-full">
        
        <div
          className="slider_bg absolute bottom-0 2xl:-right-48 xl:-right-24 -right-20 lg:h-full sm:h-[90%] h-[80%] animate animate_left"
          style={{ "--i": 3 }}
        >
          <img
            src="/assets/images/slider/slider3_user.png"
            alt="slider3_user"
            className="w-full h-full object-cover"
          />

          <img
            src="/assets/images/slider/link.png"
            alt="link"
            className="icon_link absolute md:top-[28%] sm:top-[10%] -top-6 lg:left-[10%] left-[5%]"
          />

          <div className="flag_top flex items-center gap-3 absolute md:top-[36%] top-[16%] min-[1740px]:right-0 lg:right-24 -right-8 p-3 bg-white rounded-xl shadow-xl max-lg:hidden">
            
            <div
              className="avatar relative w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center"
              style={{ background: '#E7EEE8' }}
            >
              <span className="ph-fill ph-briefcase text-2xl" style={{ color: '#3F6C51' }}></span>

              <span className="dot absolute right-0 bottom-0 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
            </div>

            <div className="flag_info">
              <h6 className="heading6">+{stats.totalProjets}</h6>
              <span className="caption1">projets déposés</span>
            </div>
          </div>

          <div className="flag_bottom flex items-center gap-3 absolute sm:bottom-12 bottom-16 lg:left-0 -left-8 p-3 bg-white rounded-xl shadow-xl max-lg:hidden">
            
            <span className="ph ph-lightning sm:text-4xl text-3xl text-primary flex-shrink-0"></span>

            <div className="flag_info">
              <h6 className="heading6">+{stats.totalInvestisseurs}</h6>
              <span className="caption1">investisseurs qualifiés</span>
            </div>
          </div>

          <img
            src="/assets/images/slider/heart.png"
            alt="heart"
            className="icon_heart absolute md:bottom-[24%] bottom-[4%] min-[1740px]:right-0 lg:right-28 right-20"
          />
        </div>

        <div className="slider_content flex flex-col items-start justify-center sm:pt-20 pt-16 lg:w-[848px] md:w-5/6 w-full h-full">
          
          <h2
            className="heading1 text-white animate animate_top"
            style={{ "--i": 1 }}
          >
            Réunir les reveurs et les batisseurs
          </h2>

          <p
            className="body2 text-white mt-5 animate animate_top"
            style={{ "--i": 2 }}
          >
            chassez votre opportuinité pour des nouvelles experiences
            professionelle
          </p>

          <div
            className="form_search w-full md:mt-10 mt-7 animate animate_top"
            style={{ "--i": 3 }}
          >
            <form className="form_inner flex items-center justify-between max-sm:flex-wrap gap-6 gap-y-4 relative w-full p-3 rounded-lg bg-white" onSubmit={handleSearch}>
              
              <div className="form_input relative w-full">
                <span className="icon_search ph-bold ph-magnifying-glass absolute top-1/2 -translate-y-1/2 left-2 text-xl"></span>

                <input
                  type="text"
                  className="input_search w-full h-full pl-10"
                  placeholder="cherchez un projet içi"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="select_block flex-shrink-0 sm:pr-16 pr-7 sm:pl-6 pl-3 sm:border-l border-line">
                
                <select
                  className="w-full bg-transparent outline-none"
                  value={selectedSecteur}
                  onChange={(e) => setSelectedSecteur(e.target.value)}
                >
                  <option value="">tous les secteurs</option>
                  <option value="technologie">secteur de la technologie</option>
                  <option value="construction et immobilier">secteur construction et immobilier</option>
                  <option value="agriculture et agroalimentaire">secteur agriculture et agroalimentaire</option>
                  <option value="commerce et e-commerce">secteur commerce et e-commerce</option>
                  <option value="sante">secteur de la santé</option>
                  <option value="education">secteur de l'education</option>
                  <option value="energie et environnement">secteur d'énergie et environnement</option>
                </select>
              </div>

              <button
                type="submit"
                className="button-main max-sm:w-1/3 text-center flex-shrink-0"
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* Popular Categories */}
  <section className="popular_categories lg:pt-20 sm:pt-14 pt-10">
    
    <div className="container">
      
      <div className="heading flex items-center justify-between flex-wrap gap-4">
        
        <div
          className="left animate animate_top"
          style={{ "--i": 1 }}
        >
          <h3 className="heading3">
            Les secteurs populaires
          </h3>

          <p className="body2 text-secondary mt-3">
            decouvrez nos sectures les plus demandés
          </p>
        </div>

        <div className="section-swiper-navigation right flex items-center gap-4">
          
          <button
            type="button"
            className="custom-button-prev -border -relative"
            onClick={() => scrollCategories(-1)}
          >
            <span className="ph-bold ph-arrow-left text-xl"></span>
          </button>

          <button
            type="button"
            className="custom-button-next -border -relative"
            onClick={() => scrollCategories(1)}
          >
            <span className="ph-bold ph-arrow-right text-xl"></span>
          </button>
        </div>
      </div>

      <div
        ref={categoriesScrollRef}
        className="list flex gap-5 overflow-x-auto md:pt-10 pt-7 lg:pb-20 sm:pb-14 pb-10"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      >
        {(() => {
          // Trie les secteurs: ceux avec le plus de projets en premier,
          // puis complète avec les secteurs restants (0 projet) pour toujours afficher les 7.
          const countMap = {};
          secteurCounts.forEach((item) => {
            if (item._id) countMap[item._id] = item.count;
          });
          const sorted = [...ALL_SECTEURS].sort(
            (a, b) => (countMap[b] || 0) - (countMap[a] || 0)
          );

          return sorted.map((secteurValue, index) => (
            <a
              key={secteurValue}
              href="#!"
              className="category_item flex-shrink-0 w-[220px] flex flex-col items-start h-full sm:px-7.5 px-6 sm:py-6 py-5 rounded-lg bg-white shadow-md duration-300 hover:shadow-xl animate animate_top"
              style={{ "--i": index + 1 }}
            >
              <div className="icon">
                <span className={`ph-fill ${(SECTEUR_VISUAL[secteurValue] || {}).icon || 'ph-briefcase'} text-4xl`}></span>
              </div>

              <strong className="heading6 mt-3">
                {SECTEUR_LABELS[secteurValue]}
              </strong>

              <span className="caption1 text-secondary mt-1">
                {countMap[secteurValue] || 0} projet{(countMap[secteurValue] || 0) !== 1 ? 's' : ''}
              </span>
            </a>
          ));
        })()}
      </div>
    </div>
  </section>
<section className="benefit lg:pb-20 sm:pb-14 pb-10">
  <div className="container">
    <div className="benefit_inner flex max-lg:flex-col-reverse items-center justify-between gap-y-8">
 
      {/* Content */}
      <div className="benefit_content xl:w-[589px] lg:w-5/12 w-full">
        <h3 className="heading3 animate animate_top" style={{ "--i": 1 }}>
          Pourqois nous somme les meilleures
        </h3>

        <p className="body2 text-secondary mt-2 animate animate_top" style={{ "--i": 2 }}>
          Découvrez des projets à fort potentiel, Prêt à être financés
        </p>

        <ul className="list_benefit flex flex-col gap-4 mt-8">

          <li className="benefit_item flex items-center gap-3 animate animate_top" style={{ "--i": 3 }}>
            <span className="ph-fill ph-check-circle flex-shrink-0 text-xl text-primary"></span>
            <p className="body2 desc">
              Accès illimité pour tous les projet sur la platforme
            </p>
          </li>

          <li className="benefit_item flex items-center gap-3 animate animate_top" style={{ "--i": 4 }}>
            <span className="ph-fill ph-check-circle flex-shrink-0 text-xl text-primary"></span>
            <p className="body2 desc">
              Mise en contact rapide et confidentiele
            </p>
          </li>

          <li className="benefit_item flex items-center gap-3 animate animate_top" style={{ "--i": 5 }}>
            <span className="ph-fill ph-check-circle flex-shrink-0 text-xl text-primary"></span>
            <p className="body2 desc">
              Un process simple et efficase
            </p>
          </li>

        </ul>

        <div className="lg:mt-8 mt-5 animate animate_top" style={{ "--i": 7 }}>
          <Link to="/Liste_proj" className="button-main">
            decouvrez tous les projets
          </Link>
        </div>
      </div>

      {/* Image / Video */}
      <div className="benefit_bg relative lg:w-1/2 sm:w-[70%] w-full">
        <img
          src="/assets/images/logo.png"
          alt="benefit"
          className="w-full rounded-xl"
        />

       
      </div>

    </div>
  </div>
 </section>

 {/* Projets selon le profil (après connexion) */}
 <section className="feature_services lg:pt-20 sm:pt-14 pt-10 md:pb-6 bg-surface">
  <div className="container">

    {/* Heading */}
    <div className="heading flex items-center justify-between flex-wrap gap-4">
      <div className="left animate animate_top" style={{ "--i": 1 }}>
        <h3 className="heading3">
          {user ? "Projets qui correspondent à votre profil" : "Les projets récents"}
        </h3>
        <p className="body2 text-secondary mt-3">
          {user
            ? "Selectionnés selon vos secteurs d'activité préférés"
            : "Connectez-vous pour voir les projets adaptés à votre profil"}
        </p>
      </div>

      <Link
        to="/Liste_proj"
        className="text-button pb-0.5 border-b-2 border-primary duration-300 hover:text-primary animate animate_top"
        style={{ "--i": 2 }}
      >
        Afficher tous les projets
      </Link>
    </div>

    {/* Contenu */}
    <div className="md:mt-10 mt-7">

      {!user && (
        <p className="body2 text-secondary text-center py-10">
          Connectez-vous à votre compte pour découvrir les projets qui correspondent à vos secteurs d'activité.
        </p>
      )}

      {user && loadingProjets && (
        <p className="body2 text-secondary text-center py-10">Chargement des projets...</p>
      )}

      {user && !loadingProjets && projets.length === 0 && (
        <p className="body2 text-secondary text-center py-10">
          Aucun projet ne correspond encore à vos secteurs. Consultez la liste complète des projets.
        </p>
      )}

      {user && !loadingProjets && projets.length > 0 && (
        <div className="list grid lg:grid-cols-3 sm:grid-cols-2 gap-6">
          {projets.slice(0, 6).map((projet) => (
            <div
              key={projet._id}
              className="service_item overflow-hidden relative rounded-lg bg-white shadow-md duration-300 hover:shadow-xl"
            >
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
                  <span className="tag caption2 bg-surface">
                    {SECTEUR_LABELS[projet.secteur] || projet.secteur}
                  </span>
                  <span className="caption1 text-secondary capitalize">
                    {projet.type_projet}
                  </span>
                </div>

                <div className="service_title text-title pt-2">
                  {projet.Titre_projet}
                </div>

                <div className="flex items-center gap-1 mt-2 text-secondary">
                  <span className="ph ph-map-pin" />
                  <span className="caption1">{projet.Localisation_projet}</span>
                </div>

                <div className="service_more_info flex items-center justify-between mt-4 pt-4 border-t border-line">
                  <div className="service_price">
                    <span className="text-secondary">budget: </span>
                    <span className="text-title">
                      {projet.bud_min_projet} - {projet.bud_max_projet} DT
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
</section>
<section className="freelancers lg:py-20 sm:py-14 py-10">
  <div className="container">

    {/* Heading */}
    <div className="heading flex items-center justify-between flex-wrap gap-4">
      <div className="left animate animate_top" style={{ "--i": 1 }}>
        <h3 className="heading3">
          {!user
            ? "Les investisseurs les plus actifs"
            : user.statut === 'entrepreneur'
              ? "Les investisseurs selon votre profil"
              : "Les entrepreneurs selon votre profil"}
        </h3>
        <p className="body2 text-secondary mt-3">
          {!user
            ? "Connectez-vous pour voir les profils qui correspondent à vos secteurs"
            : user.statut === 'entrepreneur'
              ? "Investisseurs actifs dans vos secteurs d'activité"
              : "Entrepreneurs qui cherchent un financement dans vos secteurs"}
        </p>
      </div>
    </div>

    {/* List */}
    {!user && (
      <p className="body2 text-secondary text-center py-10">
        Connectez-vous à votre compte pour découvrir les profils qui correspondent à vos secteurs d'activité.
      </p>
    )}

    {user && loadingProfiles && (
      <p className="body2 text-secondary text-center py-10">Chargement des profils...</p>
    )}

    {user && !loadingProfiles && matchedProfiles.length === 0 && (
      <p className="body2 text-secondary text-center py-10">
        Aucun {user.statut === 'entrepreneur' ? 'investisseur' : 'entrepreneur'} ne correspond encore à vos secteurs.
      </p>
    )}

    {user && !loadingProfiles && matchedProfiles.length > 0 && (
      <ul className="list grid md:grid-cols-2 gap-7.5 md:mt-10 mt-7">
        {matchedProfiles.slice(0, 4).map((profile) => {
          const displayName = profile.nom_prenom || profile.email;
          const displayLocation = profile.ville_de_residence
            ? `${profile.ville_de_residence}${profile.pays_de_residence ? ', ' + profile.pays_de_residence : ''}`
            : (profile.gouvernorat || '');
          // Le profil affiché est du rôle opposé à l'utilisateur connecté
          // (un entrepreneur voit des investisseurs, et inversement).
          const profileRole = user.statut === 'entrepreneur' ? 'investisseur' : 'entrepreneur';
          const avatarColors = AVATAR_COLORS[profileRole];

          return (
            <li
              key={profile._id}
              className="candidates_item px-6 py-5 rounded-lg bg-white shadow-md duration-300 hover:shadow-xl"
            >
              {/* Info */}
              <div className="candidates_info flex gap-4 w-full pb-4 border-b border-line">
                <div
                  className="candidates_avatar overflow-hidden flex-shrink-0 w-15 h-15 rounded-full flex items-center justify-center"
                  style={{ background: avatarColors.bg }}
                >
                  <strong style={{ color: avatarColors.fg, fontSize: '15px' }}>
                    {getInitials(displayName)}
                  </strong>
                </div>

                <div className="candidates_content w-full">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="candidates_detail flex flex-col gap-0.5">
                      <strong className="candidates_name text-title -style-1">
                        {displayName}
                      </strong>

                      {displayLocation && (
                        <span className="flex items-center text-secondary">
                          <span className="ph ph-map-pin text-lg"></span>
                          <span className="candidates_address -style-1 caption1 pl-1">
                            {displayLocation}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between w-full gap-3 mt-2">
                    <a
                      href={`mailto:${profile.email}`}
                      className="button-main -border"
                    >
                      Contacter
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom info */}
              <div className="candidates_more_info flex flex-wrap items-center gap-2.5 pt-4">
                {(profile.secteurs || []).map((s) => (
                  <span key={s} className="candidates_tag tag bg-surface" >
                    {SECTEUR_LABELS[SECTEUR_UNDERSCORE_TO_PROJET[s] || s] || s}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    )}

  </div>
</section>
 {/* Banner */}
<section className="banner">
  <div className="container">

    <div
      className="banner_inner relative sm:px-16 px-8 py-16 overflow-hidden rounded-xl animate animateZoomOutUp"
      style={{ "--i": 5 }}
    >

      <div className="banner_bg absolute top-0 left-0 w-full h-full z-[-1]">
        <img
          src="/assets/images/logo.png"
          alt="banner1"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="banner_content">

        <h4
          className="heading4 text-white animate animate_top"
          style={{ "--i": 1 }}
        >
          Rejoignez une nouvelle génération d’investisseurs <br className="max-sm:hidden" />
          Oû l'investissement devient simple
        </h4>

        <div className="md:mt-7 mt-5 animate animate_top" style={{ "--i": 3 }}>
          <Link to="/Register_inv" className="button-main bg-white">
            devenez un investisseur
          </Link>
        </div>

      </div>

    </div>

  </div>
</section>
{/* Counter */}
<section className="counter lg:py-20 sm:py-14 py-10">
  <div className="container flex max-lg:flex-wrap items-center justify-between max-lg:gap-y-8">
    
    <div className="item max-lg:flex max-lg:flex-col max-lg:w-1/2 animate animate_top" style={{ "--i": 1 }}>
      <h2 className="heading2 pb-1 text-center">{stats.totalProjets}</h2>
      <span className="body1 text-center">Projets disponibles</span>
    </div>

    <div className="line flex-shrink-0 w-px h-20 bg-line max-lg:hidden"></div>

    <div className="item max-lg:flex max-lg:flex-col max-lg:w-1/2 animate animate_top" style={{ "--i": 2 }}>
      <h2 className="heading2 pb-1 text-center">{stats.secteursActifs}/7</h2>
      <span className="body1 text-center">Secteurs actifs</span>
    </div>

    <div className="line flex-shrink-0 w-px h-20 bg-line max-lg:hidden"></div>

    <div className="item max-lg:flex max-lg:flex-col max-lg:w-1/2 animate animate_top" style={{ "--i": 3 }}>
      <h2 className="heading2 pb-1 text-center">{stats.totalEntrepreneurs}</h2>
      <span className="body1 text-center">Entrepreneurs inscrits</span>
    </div>

    <div className="line flex-shrink-0 w-px h-20 bg-line max-lg:hidden"></div>

    <div className="item max-lg:flex max-lg:flex-col max-lg:w-1/2 animate animate_top" style={{ "--i": 4 }}>
      <h2 className="heading2 pb-1 text-center">{stats.totalInvestisseurs}</h2>
      <span className="body1 text-center">Investisseurs inscrits</span>
    </div>

  </div>
</section>

{/* Blog */}
<section className="blog lg:py-20 sm:py-14 py-10">
  <div className="container">

    <h3 className="heading3 text-center animate animate_top" style={{ "--i": 1 }}>
      Des conseils pour réuissir dans votre projet
    </h3>

    <p className="body2 text-secondary text-center mt-3 animate animate_top" style={{ "--i": 2 }}>
      Ressources pour entrepreneurs et investisseurs
    </p>

    <div className="list_blog grid lg:grid-cols-3 sm:grid-cols-2 lg:gap-7.5 gap-6 md:mt-10 mt-7">

      {BLOG_POSTS.map((post, index) => (
        <div
          key={post.id}
          className={`blog_item animate animate_top ${index === 2 ? 'max-lg:hidden' : ''}`}
          style={{ "--i": index + 1 }}
        >
          

          <div className="blog_info flex items-center gap-2 mt-5">
            <span className="caption1">
              {post.tag}
            </span>
          </div>

          <Link to={`/blog/${post.slug}`} className="heading5 blog_title mt-3 hover:underline">
            {post.title}
          </Link>

          <p className="blog_desc mt-2 text-secondary">
            {post.desc}
          </p>
        </div>
      ))}

    </div>

  </div>
</section>
{/* Scroll to top */}
<button className="scroll-to-top-btn"><span className="ph-bold ph-caret-up" /></button>


    </div>
  )
}