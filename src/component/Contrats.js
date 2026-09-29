import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'
const STATUT_LABELS = {
  en_negociation: 'En négociation',
  signe: 'Signé',
  annule: 'Annulé',
};

const SECTEUR_LABELS = {
  "technologie": "Technologie",
  "construction et immobilier": "Construction et immobilier",
  "agriculture et agroalimentaire": "Agriculture et agroalimentaire",
  "commerce et e-commerce": "Commerce et e-commerce",
  "sante": "Santé",
  "education": "Éducation",
  "energie et environnement": "Énergie et environnement",
};

export default function ContratDocument() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [contrat, setContrat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    setUser(parsedUser);

    axios.get(`http://localhost:8000/Contrat/${id}`)
      .then((res) => {
        setContrat(res.data);
      })
      .catch((err) => {
        console.log(err);
        setErrorMsg('Impossible de charger ce contrat.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container pt-28 pb-20">
        <p className="body2 text-secondary text-center">Chargement...</p>
      </div>
    );
  }

  if (errorMsg || !contrat) {
    return (
      <div className="container pt-28 pb-20">
        <p className="body2 text-center text-red-600">{errorMsg || 'Contrat introuvable.'}</p>
      </div>
    );
  }

  // Vérification d'accès basique: admin voit tout, sinon il faut être une des parties
  if (user && user.statut !== 'admin') {
    const isInvestisseur = contrat.investisseur_id && contrat.investisseur_id._id === user.id;
    const isEntrepreneur = contrat.entrepreneur_id && contrat.entrepreneur_id._id === user.id;
    if (!isInvestisseur && !isEntrepreneur) {
      return (
        <div className="container pt-28 pb-20">
          <p className="body2 text-center text-red-600">Vous n'avez pas accès à ce contrat.</p>
        </div>
      );
    }
  }

  const investisseurNom = contrat.investisseur_id
    ? (contrat.investisseur_id.prenom || contrat.investisseur_id.nom
        ? `${contrat.investisseur_id.prenom || ''} ${contrat.investisseur_id.nom || ''}`.trim()
        : contrat.investisseur_id.email)
    : '—';

  const entrepreneurNom = contrat.entrepreneur_id ? contrat.entrepreneur_id.nom_prenom : '—';

  const dateDoc = contrat.DateCreation
    ? new Date(contrat.DateCreation).toLocaleDateString('fr-FR')
    : new Date().toLocaleDateString('fr-FR');

  return (
    <div className="contrat_page_wrapper">
      <style>{`
        @media print {
          header, footer, .menu_mobile, .no-print { display: none !important; }
          body { background: white !important; }
          .contrat_page_wrapper { padding: 0 !important; }
          .contrat_a4 { box-shadow: none !important; margin: 0 !important; }
        }
        @page {
          size: A4;
          margin: 15mm;
        }
        .contrat_page_wrapper {
          background: #e9e9e9;
          min-height: 100vh;
          padding: 120px 20px 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .contrat_a4 {
          background: white;
          width: 210mm;
          max-width: 100%;
          min-height: 297mm;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          padding: 20mm;
          font-family: Georgia, 'Times New Roman', serif;
          color: #1a1a1a;
          box-sizing: border-box;
        }
        .contrat_a4 h1 {
          font-size: 22px;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }
        .contrat_a4 .ref {
          text-align: center;
          font-size: 12px;
          color: #666;
          margin-bottom: 30px;
        }
        .contrat_a4 h2 {
          font-size: 15px;
          text-transform: uppercase;
          border-bottom: 1px solid #ccc;
          padding-bottom: 6px;
          margin-top: 28px;
          margin-bottom: 12px;
        }
        .contrat_a4 p {
          font-size: 13.5px;
          line-height: 1.7;
          margin: 6px 0;
        }
        .contrat_parties {
          display: flex;
          gap: 30px;
          margin-top: 10px;
        }
        .contrat_partie {
          flex: 1;
        }
        .contrat_partie strong {
          display: block;
          font-size: 13px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .contrat_signatures {
          display: flex;
          justify-content: space-between;
          margin-top: 70px;
          gap: 20px;
        }
        .contrat_signature_block {
          flex: 1;
          text-align: center;
        }
        .contrat_signature_line {
          border-top: 1px solid #333;
          margin-top: 50px;
          padding-top: 6px;
          font-size: 12px;
        }
        .contrat_statut_badge {
          display: inline-block;
          font-size: 11px;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          background: #eee;
          margin-top: 4px;
        }
      `}</style>

      <div className="no-print flex items-center gap-3 mb-5" style={{ width: '210mm', maxWidth: '100%' }}>
        <button className="button-main" onClick={handlePrint}>
          Télécharger en PDF
        </button>
        <button className="button-main -border" onClick={() => navigate(-1)}>
          Retour
        </button>
      </div>

      <div className="contrat_a4">
        <h1>Contrat d'investissement</h1>
        <p className="ref">Réf: {contrat._id} — Établi le {dateDoc}</p>

        <p>
          Le présent document formalise l'accord conclu entre les parties ci-dessous, dans le cadre de la mise en
          relation assurée par la plateforme INVEST CONNECT, à la suite d'une réunion organisée entre les deux parties.
        </p>

        <h2>Les parties</h2>
        <div className="contrat_parties">
          <div className="contrat_partie">
            <strong>L'investisseur</strong>
            <p>{investisseurNom}</p>
            <p>{contrat.investisseur_id ? contrat.investisseur_id.email : '—'}</p>
            {contrat.investisseur_id && contrat.investisseur_id.gouvernorat && (
              <p>{contrat.investisseur_id.gouvernorat}</p>
            )}
          </div>
          <div className="contrat_partie">
            <strong>L'entrepreneur</strong>
            <p>{entrepreneurNom}</p>
            <p>{contrat.entrepreneur_id ? contrat.entrepreneur_id.email : '—'}</p>
            {contrat.entrepreneur_id && (contrat.entrepreneur_id.ville_de_residence || contrat.entrepreneur_id.pays_de_residence) && (
              <p>
                {contrat.entrepreneur_id.ville_de_residence}
                {contrat.entrepreneur_id.ville_de_residence && contrat.entrepreneur_id.pays_de_residence ? ', ' : ''}
                {contrat.entrepreneur_id.pays_de_residence}
              </p>
            )}
          </div>
        </div>
        <p style={{ marginTop: '14px' }}>
          En présence de l'administration de la plateforme INVEST CONNECT, ayant coordonné la mise en relation et
          la planification de la réunion entre les parties.
        </p>

        <h2>Objet du contrat</h2>
        <p>
          Le présent accord porte sur le projet <strong>{contrat.projet_id ? contrat.projet_id.Titre_projet : '—'}</strong>,
          {contrat.projet_id && (
            <>
              {' '}relevant du secteur {SECTEUR_LABELS[contrat.projet_id.secteur] || contrat.projet_id.secteur},
              situé à {contrat.projet_id.Localisation_projet}.
            </>
          )}
        </p>

        <h2>Conditions financières</h2>
        <p>
          Montant de l'investissement:{' '}
          <strong>{contrat.montant !== undefined && contrat.montant !== null ? `${contrat.montant.toLocaleString('fr-FR')} DT` : 'à définir'}</strong>
        </p>
        <p>
          Participation de l'investisseur dans le projet:{' '}
          <strong>{contrat.pourcentage_participation !== undefined && contrat.pourcentage_participation !== null ? `${contrat.pourcentage_participation}%` : 'à définir'}</strong>
        </p>

        {contrat.details && (
          <>
            <h2>Détails complémentaires</h2>
            <p>{contrat.details}</p>
          </>
        )}

        <h2>Statut</h2>
        <span className="contrat_statut_badge">{STATUT_LABELS[contrat.statut] || contrat.statut}</span>

        <div className="contrat_signatures">
          <div className="contrat_signature_block">
            <div className="contrat_signature_line">Signature de l'investisseur</div>
          </div>
          <div className="contrat_signature_block">
            <div className="contrat_signature_line">Signature de l'entrepreneur</div>
          </div>
          <div className="contrat_signature_block">
            <div className="contrat_signature_line">Pour la plateforme INVEST CONNECT</div>
          </div>
        </div>
      </div>
    </div>
  );
}