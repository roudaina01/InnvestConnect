import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Header() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileSub, setActiveMobileSub] = useState(null); // 'category' | 'invest' | 'entrep' | null
  const [desktopSubOpen, setDesktopSubOpen] = useState(null); // 'invest' | 'entrep' | null

  const location = useLocation();

  // changement des etats des que le changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMobileSub(null);
    setCategoryOpen(false);
    setUserMenuOpen(false);
    setDesktopSubOpen(null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAdmin = currentUser && currentUser.statut === 'admin';

  const AVATAR_COLORS = {
    investisseur: { bg: '#E4E9EE', fg: '#3B5773' },
    entrepreneur: { bg: '#E7EEE8', fg: '#3F6C51' },
    admin: { bg: '#F1E7D6', fg: '#9C7A3C' },
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getDisplayName = (u) => {
    if (!u) return '';
    if (u.statut === 'entrepreneur') return u.nom_prenom || u.email;
    if (u.statut === 'investisseur') return (u.prenom || u.nom) ? `${u.prenom || ''} ${u.nom || ''}`.trim() : u.email;
    if (u.statut === 'admin') return u.nom || u.email;
    return u.email;
  };

  const userDisplayName = getDisplayName(currentUser);
  const userAvatarColors = AVATAR_COLORS[currentUser && currentUser.statut] || AVATAR_COLORS.investisseur;

  const categories = [
    { id: '01', icon: 'ph-desktop', label: "secteur de la technologie" },
    { id: '02', icon: 'ph-megaphone-simple', label: "secteur construction et immobilier" },
    { id: '03', icon: 'ph-brackets-angle', label: "secteur agriculture et agroalimentaire" },
    { id: '04', icon: 'ph-pencil-simple-line', label: "secteur commerce et e-commerce" },
    { id: '05', icon: 'ph-video', label: "secteur de la santé" },
    { id: '06', icon: 'ph-music-notes', label: "secteur de l'education" },
    { id: '07', icon: 'ph-head-circuit', label: "secteur d'énergie et environnement" },
  ];

  return (
    <div>
      {/* Header
          FIX: header_inner ma-3adech "absolute top-0 left-0 right-0".
          Kbal, el <header> ma-3andouch height 7it el waled tou (header_inner) khrej
          mel flow (absolute) -> el header yenkamech l 0px -> el contenu ely jai
          ba3dou (el hero/section grise) yetla3 yetghatta taht el navbar.
          Toura header_inner yemchi fel flow el 3adi w el <header> yakhod
          automatiquement el height el s7i7 (h-16 / h-20), fa kol chay ye7ott
          ta7t b3adhou b7al ma yelzem. */}
      <header id="header" className="header relative">
        <div className="header_inner flex items-center justify-between z-[1] w-full sm:h-20 h-16 min-[1600px]:px-15 lg:px-9 px-4 border-b border-light bg-[#1D3E3E]">

          <div className="left flex items-center gap-15 h-full max-[1600px]:gap-6">
            <h1>
              <NavLink to="/">
                <img src="/assets/images/logo-white.png" alt="logo-white" className="logo-white md:h-[42px] h-8 w-auto" />
                <img src="/assets/images/logo.png" alt="logo" className="logo-black md:h-[42px] h-8 w-auto hidden" />
              </NavLink>
            </h1>

            <div className="category_block flex items-center relative h-full">
              <button
                className="category_btn max-2xl:hidden flex items-center gap-1 px-3 py-2 rounded-lg bg-light text-white duration-300"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                <span className="ph ph-stack text-2xl text-primary" />
                <span> tous les secteur d'activité</span>
              </button>

              {categoryOpen && (
                <div className="category_nav flex absolute top-full left-0 bg-white shadow-lg rounded-lg z-20">
                  <ul className="category_list flex-shrink-0 w-[300px] h-full py-5 border-r border-line" role="tablist">
                    {categories.map((cat) => (
                      <li className="category_item w-full" key={cat.id}>
                        <button
                          className="category_link tab_btn flex items-center gap-3 w-full px-7 py-4 duration-300"
                          id={`category_tab${cat.id}`}
                          role="tab"
                          aria-controls={`category_${cat.id}`}
                        >
                          <span className={`ph-fill ${cat.icon} text-2xl`} />
                          <strong className="category_name text-title">{cat.label}</strong>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="navigator h-full max-[1400px]:hidden">
            <ul className="list flex items-center gap-5 h-full">
              <li className="h-full relative">
                <NavLink to="/Liste_proj" className="flex items-center gap-1 h-full text-white duration-300">
                  <span className="text-title relative">liste des projets</span>
                </NavLink>
              </li>

              <li className="h-full relative">
                <button
                  type="button"
                  className="flex items-center gap-1 h-full text-white duration-300"
                  onClick={() => setDesktopSubOpen(desktopSubOpen === 'invest' ? null : 'invest')}
                >
                  <span className="text-title relative">espace investisseur</span>
                  <span className="ph-bold ph-caret-down" />
                </button>
                {desktopSubOpen === 'invest' && (
                  <div className="sub_menu absolute p-3 -left-10 w-max bg-white rounded-lg shadow-lg z-20">
                    <ul>
                      <li>
                        <NavLink to="/Liste_proj" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des projets
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Liste_des_inv" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des projet fondés
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Liste_des_reuinions" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des réuinion
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li className="h-full relative">
                <button
                  type="button"
                  className="flex items-center gap-1 h-full text-white duration-300"
                  onClick={() => setDesktopSubOpen(desktopSubOpen === 'entrep' ? null : 'entrep')}
                >
                  <span className="text-title relative">espace entrpreneur</span>
                  <span className="ph-bold ph-caret-down" />
                </button>
                {desktopSubOpen === 'entrep' && (
                  <div className="sub_menu absolute p-3 -left-10 w-max bg-white rounded-lg shadow-lg z-20">
                    <ul>
                      <li>
                        <NavLink to="/Poster" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          ajouter un projet
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Liste_des_entrep" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          suivie du projet
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/Liste_des_reuinions" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des réunins
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </div>

          <div className="list_action flex items-center gap-5">
            <div className="help_block max-sm:hidden">
              <a href="#!" className="block">
                <span className="ph ph-question text-white text-2xl block" />
              </a>
            </div>

            {!currentUser && (
              <NavLink to="/Register_inv" className="button-main bg-white text-black max-sm:hidden">
                Inscription
              </NavLink>
            )}

            {currentUser ? (
              <div className="user_block relative max-sm:hidden">
                <button
                  className="user_infor flex items-center gap-2 text-white"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div
                    className="user_avatar flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: userAvatarColors.bg }}
                  >
                    <strong style={{ color: userAvatarColors.fg, fontSize: '13px' }}>
                      {getInitials(userDisplayName)}
                    </strong>
                  </div>
                  <strong className="user_name text-title">{userDisplayName}</strong>
                  <span className="ph ph-caret-down" />
                </button>

                {userMenuOpen && (
                  <ul className="list_action_user absolute w-[240px] p-3 top-14 right-0 bg-white rounded-lg shadow-lg z-20">
                    <li className="action_item">
                      {isAdmin ? (
                        <NavLink to="/Dashboard_admin" className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background">
                          <span className="ph ph-squares-four text-2xl text-secondary" />
                          <strong className="text-title">Dashboard</strong>
                        </NavLink>
                      ) : (
                        <a href="#!" className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background">
                          <span className="ph ph-squares-four text-2xl text-secondary" />
                          <strong className="text-title">Dashboard</strong>
                        </a>
                      )}
                    </li>
                    <li className="action_item">
                      <NavLink to="/Liste_des_reuinions" className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background">
                        <span className="ph ph-calendar-check text-2xl text-secondary" />
                        <strong className="text-title">{isAdmin ? 'Gestion des réunions' : 'Mes réunions'}</strong>
                      </NavLink>
                    </li>
                    <li className="action_item">
                      <NavLink to="/Liste_des_contrats" className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background">
                        <span className="ph ph-file-text text-2xl text-secondary" />
                        <strong className="text-title">{isAdmin ? 'Gestion des contrats' : 'Mes contrats'}</strong>
                      </NavLink>
                    </li>
                    <li className="action_item">
                      <NavLink to="/GestProfil" className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background">
                        <span className="ph ph-user-circle text-2xl text-secondary" />
                        <strong className="text-title">mon Profile</strong>
                      </NavLink>
                    </li>
                    <li className="action_item">
                      <button
                        onClick={handleLogout}
                        className="link flex items-center gap-3 w-full py-3 px-6 rounded-lg duration-300 hover:bg-background"
                      >
                        <span className="ph ph-sign-out text-2xl text-secondary" />
                        <strong className="text-title">Deconnexion</strong>
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="flex items-center gap-2 text-white max-sm:hidden">
                <span className="ph ph-sign-in text-xl" />
                <strong className="text-title">Connexion</strong>
              </NavLink>
            )}

            <button
              className="humburger_btn min-[1400px]:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="ph-bold ph-list text-white text-2xl block" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`menu_mobile ${mobileMenuOpen ? 'active' : ''}`}
        style={mobileMenuOpen ? {
          display: 'block',
          visibility: 'visible',
          opacity: 1,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '300px',
          height: '100%',
          background: 'white',
          zIndex: 9999,
          overflowY: 'auto',
          transform: 'none',
          clipPath: 'none',
          filter: 'none',
          pointerEvents: 'auto'
        } : { display: 'none' }}
      >
        <button
          className="menu_mobile_close flex items-center justify-center absolute top-5 left-5 w-8 h-8 rounded-full bg-surface"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="ph-bold ph-x" />
        </button>

        <div className="heading flex items-center justify-center mt-5">
          <NavLink to="/" className="logo">
            <img src="/assets/images/logo.png" alt="logo" className="h-8" />
          </NavLink>
        </div>

        

        <div className="mt-4">
          <ul className="nav_mobile">

           
            {/* Liste des projets */}
            
              <NavLink to="/Poster" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          ajouter un projet
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
           

            {/* Espace investisseurs */}
            <li className="nav_item py-2">
              <a
                href="#!"
                className="text-xl font-semibold flex items-center justify-between"
                onClick={(e) => { e.preventDefault(); setActiveMobileSub(activeMobileSub === 'invest' ? null : 'invest'); }}
              >
                 <NavLink to="/Liste_des_reuinions" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des Reunions
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                
                  
                
              </a>
              {activeMobileSub === 'invest' && (
                <div className="sub_nav_mobile active">
                  <button className="back_btn flex items-center gap-3" onClick={() => setActiveMobileSub(null)}>
                    <i className="ph ph-caret-left text-xl" />
                    retour
                  </button>
                  <div className="list-nav-item w-full pt-2 pb-6">
                    <ul>
                      <li>
                        <NavLink to="/Poster" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          ajouter un projet
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                      <li>
                       
                      </li>
                      <li>
                        <NavLink to="/Liste_des_contrats" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des contrats
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>

            {/* Espace entrepreneurs */}
            <li className="nav_item py-2">
              <a
                href="#!"
                className="text-xl font-semibold flex items-center justify-between"
                onClick={(e) => { e.preventDefault(); setActiveMobileSub(activeMobileSub === 'entrep' ? null : 'entrep'); }}
              >
                <NavLink to="/Liste_des_contrats" className="link flex items-center justify-between gap-2 w-full text-button py-[11px] px-6 rounded duration-300">
                          liste des contrats
                          <span className="ph-bold ph-caret-right" />
                        </NavLink>
                <span className="text-right">
                  
                </span>
              </a>
              {activeMobileSub === 'entrep' && (
                <div className="sub_nav_mobile active">
                  <button className="back_btn flex items-center gap-3" onClick={() => setActiveMobileSub(null)}>
                    <i className="ph ph-caret-left text-xl" />
                    retour
                  </button>
                  <div className="list-nav-item w-full pt-2 pb-6">
                    <ul>
                      <li>
                        
                      </li>
                      
                     
                       <li>
                        
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </li>

          </ul>
        </div>
      </div>
    </div>
  );
}