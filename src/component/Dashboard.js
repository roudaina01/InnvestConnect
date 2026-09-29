import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from '../api'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  UserCheck,
  Layers,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Pencil,
  Check,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Design tokens
// ---------------------------------------------------------------------------
const C = {
  ink: "#1B2333",
  inkSoft: "#4A5266",
  paperDeep: "#EAE4D6",
  paper: "#FCFBF6",
  paperLine: "#E2DCC9",
  graphite: "#20242C",
  graphiteLine: "#333947",
  slate: "#9AA1B0",
  slateLight: "#C7CCD6",
  seal: "#A6362A",
  sealBg: "#F3E3E0",
  gold: "#9C7A3C",
  goldBg: "#F1E7D6",
  green: "#3F6C51",
  greenBg: "#E7EEE8",
  amber: "#9C6B30",
  amberBg: "#F1E7D6",
  blue: "#3B5773",
  blueBg: "#E4E9EE",
};
const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

const SECTEUR_LABELS = {
  technologie: "Technologie",
  "construction et immobilier": "Construction & immobilier",
  "agriculture et agroalimentaire": "Agriculture & agroalim.",
  "commerce et e-commerce": "Commerce & e-commerce",
  sante: "Santé",
  education: "Éducation",
  "energie et environnement": "Énergie & environnement",
};

const REUNION_STYLE = {
  en_attente: { label: "En attente", color: C.amber, icon: Clock3 },
  planifiee: { label: "Planifiée", color: C.green, icon: CheckCircle2 },
  annulee: { label: "Annulée", color: C.seal, icon: ShieldCheck },
};

const TYPE_STYLE = {
  "en ligne": { fg: C.blue, bg: C.blueBg },
  physique: { fg: C.gold, bg: C.goldBg },
};

// Le champ "decision" (accepte/refuse) est distinct du "statut" de la
// réunion (en_attente/planifiee/annulee) : c'est la réponse de
// l'investisseur au projet, telle qu'observée dans les données.
const DECISION_STYLE = {
  accepte: { label: "Acceptée", color: C.green },
  refuse: { label: "Refusée", color: C.seal },
};

// Champs qu'on ne veut jamais afficher/éditer automatiquement (générés par
// Mongo/Mongoose, sensibles, ou trop volumineux pour une cellule de tableau)
const HIDDEN_FIELDS = new Set([
  "_id",
  "__v",
  "password",
  "mot_de_passe",
  "createdAt",
  "updatedAt",
]);

// Config par entité : endpoint = nom de la route API (http://localhost:8000/{endpoint})
// columns = null -> les colonnes sont déduites automatiquement des champs reçus.
const ENTITY_CONFIG = {
  Projets: { label: "Projets", singular: "un projet" },
  Investisseurs: { label: "Investisseurs", singular: "un investisseur" },
  Entrepreneurs: { label: "Entrepreneurs", singular: "un entrepreneur" },
  Reunions: { label: "Réunions", singular: "une réunion" },
};

function formatBudget(n) {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("fr-FR") + " DT";
}
function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR");
}
function humanizeKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function TypePill({ type }) {
  const s = TYPE_STYLE[type] || { fg: C.inkSoft, bg: "#EEEBE2" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontFamily: SANS,
        fontSize: 11.5,
        fontWeight: 600,
        color: s.fg,
        background: s.bg,
        padding: "3px 9px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      {type || "—"}
    </span>
  );
}

function StatutBadge({ statut }) {
  const s = REUNION_STYLE[statut];
  if (!s) return <span>{statut || "—"}</span>;
  const Icon = s.icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: SANS,
        fontSize: 11.5,
        fontWeight: 600,
        color: s.color,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={13} strokeWidth={2.2} />
      {s.label}
    </span>
  );
}

function DecisionBadge({ decision }) {
  const s = DECISION_STYLE[decision];
  if (!s) return <span style={{ color: C.slate }}>—</span>;
  return (
    <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: s.color, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

function KpiCard({ icon: Icon, label, value, detail, fg, bg }) {
  return (
    <div
      style={{
        background: C.paper,
        border: `1px solid ${C.paperLine}`,
        borderRadius: 16,
        padding: "20px 22px",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: C.ink }}>
        {value}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 600, color: C.inkSoft, marginTop: 2 }}>
        {label}
      </div>
      {detail && (
        <div style={{ fontFamily: SANS, fontSize: 11, color: C.slate, marginTop: 6 }}>
          {detail}
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children, style }) {
  return (
    <div
      style={{
        background: C.paper,
        border: `1px solid ${C.paperLine}`,
        borderRadius: 16,
        padding: "20px 22px 10px",
        ...style,
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 6 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 14px",
        borderRadius: 8,
        marginBottom: 2,
        borderLeft: active ? `3px solid ${C.seal}` : "3px solid transparent",
        background: active ? "#2A303B" : "transparent",
        color: active ? "#F4F2EC" : C.slateLight,
        fontFamily: SANS,
        fontSize: 13,
        fontWeight: active ? 600 : 500,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Icon size={15} strokeWidth={2.2} />
      {label}
    </div>
  );
}

function ActionButton({ icon: Icon, label, fg, bg, onClick }) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        border: "none",
        background: bg,
        color: fg,
        cursor: "pointer",
      }}
    >
      <Icon size={14} strokeWidth={2.2} />
    </button>
  );
}

const tooltipStyle = {
  fontFamily: SANS,
  fontSize: 12,
  background: C.ink,
  border: "none",
  borderRadius: 8,
  color: "#F6F2E8",
  padding: "8px 10px",
};

// ---------------------------------------------------------------------------
// Rendu générique d'une valeur de cellule (déduit le bon format à partir du
// nom du champ). Les colonnes "connues" (Projets) passent par leurs propres
// colonnes explicites plus bas, donc ceci sert surtout pour Investisseurs /
// Entrepreneurs / Réunions dont le schéma exact n'est pas figé ici.
// ---------------------------------------------------------------------------
function renderCellValue(key, value) {
  if (value === null || value === undefined || value === "") return "—";
  if (key === "statut") return <StatutBadge statut={value} />;
  if (key === "type_projet") return <TypePill type={value} />;
  if (key === "secteur") return SECTEUR_LABELS[value] || value;
  if (/bud|budget|montant|prix/i.test(key) && typeof value === "number") {
    return formatBudget(value);
  }
  if (/date/i.test(key) && typeof value === "string") return formatDateShort(value);
  if (typeof value === "object") {
    return value.nom_prenom || value.Titre_projet || value.nom || value.email || "—";
  }
  return String(value);
}

// Limité à 6 colonnes : un document avec beaucoup de champs (Réunions,
// Investisseurs...) déborderait sinon horizontalement et cacherait la
// colonne Actions. Si un champ important manque, préférez lui définir des
// colonnes explicites (voir buildProjetsColumns / buildReunionsColumns).
function autoColumns(items) {
  if (!items || items.length === 0) return [];
  const keys = Object.keys(items[0]).filter((k) => !HIDDEN_FIELDS.has(k));
  return keys.slice(0, 6).map((k) => ({ key: k, label: humanizeKey(k) }));
}

// ---------------------------------------------------------------------------
// Vue "liste" générique utilisée pour Projets / Investisseurs / Entrepreneurs
// / Réunions. S'affiche à la place du tableau de bord, dans le même
// composant (pas de navigation vers une autre page).
// ---------------------------------------------------------------------------
function EntityListView({ title, items, columns, emptyLabel, onModifier, onAccepter, onSupprimer, renderActions }) {
  const cols = columns && columns.length ? columns : autoColumns(items);
  const gridCols = `repeat(${Math.max(cols.length, 1)}, minmax(130px, 1fr)) 130px`;

  return (
    <div
      style={{
        background: C.paper,
        border: `1px solid ${C.paperLine}`,
        borderRadius: 16,
        padding: "20px 22px",
      }}
    >
      <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
        {title}
      </div>

      {items.length === 0 ? (
        <div style={{ color: C.slate, fontSize: 12.5, padding: "20px 4px" }}>
          {emptyLabel || "Aucune donnée pour le moment."}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: gridCols,
                fontFamily: SANS,
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: C.slate,
                padding: "0 4px 8px",
                borderBottom: `1px solid ${C.paperLine}`,
              }}
            >
              {cols.map((c) => (
                <span key={c.key}>{c.label}</span>
              ))}
              <span
                style={{
                  position: "sticky",
                  right: 0,
                  background: C.paper,
                  paddingLeft: 12,
                  boxShadow: "-8px 0 8px -8px rgba(27,35,51,0.15)",
                }}
              >
                Actions
              </span>
            </div>

            {items.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: gridCols,
                  alignItems: "center",
                  padding: "12px 4px",
                  borderBottom: `1px solid ${C.paperLine}`,
                  fontSize: 12.5,
                  color: C.ink,
                }}
              >
                {cols.map((c) => {
                  const content = c.render ? c.render(item[c.key], item) : renderCellValue(c.key, item[c.key]);
                  return (
                    <span
                      key={c.key}
                      title={typeof content === "string" ? content : undefined}
                      style={{
                        color: C.inkSoft,
                        paddingRight: 8,
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {content}
                    </span>
                  );
                })}
                <span
                  style={{
                    display: "flex",
                    gap: 6,
                    position: "sticky",
                    right: 0,
                    background: C.paper,
                    paddingLeft: 12,
                    boxShadow: "-8px 0 8px -8px rgba(27,35,51,0.15)",
                  }}
                >
                  {renderActions ? (
                    renderActions(item)
                  ) : (
                    <>
                      <ActionButton icon={Pencil} label="Modifier" fg={C.blue} bg={C.blueBg} onClick={() => onModifier(item)} />
                      {onAccepter && (
                        <ActionButton icon={Check} label="Accepter" fg={C.green} bg={C.greenBg} onClick={() => onAccepter(item)} />
                      )}
                      <ActionButton icon={Trash2} label="Supprimer" fg={C.seal} bg={C.sealBg} onClick={() => onSupprimer(item)} />
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modale d'édition générique : champs déduits des colonnes connues, ou de
// l'objet lui-même si le schéma n'est pas figé. Les champs objet imbriqués
// (ex: entrepreneur_id) sont ignorés ici (lecture seule côté API).
// ---------------------------------------------------------------------------
function EditModal({ item, columns, onClose, onSave }) {
  const editableCols = (columns && columns.length ? columns : autoColumns([item])).filter(
    (c) => typeof item[c.key] !== "object"
  );
  const [form, setForm] = useState(() => {
    const initial = {};
    editableCols.forEach((c) => {
      initial[c.key] = item[c.key] ?? "";
    });
    return initial;
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(27,35,51,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.paper,
          borderRadius: 16,
          padding: 24,
          width: 420,
          maxWidth: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <div style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 16 }}>
          Modifier
        </div>

        {editableCols.map((c) => (
          <div key={c.key} style={{ marginBottom: 12 }}>
            <label
              style={{
                fontFamily: SANS,
                fontSize: 11.5,
                fontWeight: 600,
                color: C.inkSoft,
                display: "block",
                marginBottom: 4,
              }}
            >
              {c.label}
            </label>
            <input
              value={form[c.key]}
              onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: `1px solid ${C.paperLine}`,
                fontFamily: SANS,
                fontSize: 13,
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${C.paperLine}`,
              background: "transparent",
              color: C.inkSoft,
              cursor: "pointer",
              fontFamily: SANS,
              fontSize: 13,
            }}
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onSave(form)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: C.ink,
              color: "#F4F2EC",
              cursor: "pointer",
              fontFamily: SANS,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// Bouton lien générique (ex: "Gérer" pour renvoyer vers Liste_des_reuinions,
// "Voir plus" pour renvoyer vers Liste_des_entrep) : au lieu de dupliquer un
// mécanisme qui existe déjà sur une page dédiée, on y renvoie directement.
function LinkButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "6px 12px",
        borderRadius: 8,
        border: "none",
        background: C.blueBg,
        color: C.blue,
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
      <ArrowRight size={13} strokeWidth={2.4} />
    </button>
  );
}


// Colonnes explicites pour Projets (schéma connu) — réutilisées à la fois
// dans "Derniers projets ajoutés" et dans la vue liste complète.
function buildProjetsColumns() {
  return [
    { key: "Titre_projet", label: "Projet" },
    { key: "secteur", label: "Secteur", render: (v) => SECTEUR_LABELS[v] || v },
    {
      key: "entrepreneur_id",
      label: "Entrepreneur",
      render: (v) => (v && v.nom_prenom ? v.nom_prenom : "—"),
    },
    { key: "bud_max_projet", label: "Budget max", render: (v) => formatBudget(v) },
    { key: "type_projet", label: "Type", render: (v) => <TypePill type={v} /> },
    // Ajoutée pour que "Accepter" (PATCH /Projet/:id/valider) ait un effet
    // visible dans le tableau : en_attente -> valide.
    { key: "statut", label: "Statut", render: (v) => <ProjetStatutBadge statut={v} /> },
  ];
}

// Colonnes explicites pour Réunions, alignées sur le schéma réel vu dans
// server.js (PUT /Reunion/:id accepte date_reunion / heure_reunion / statut /
// decision / lien_meet). projet_id / investisseur_id peuvent arriver soit
// peuplés par .populate() (objet), soit en simple id (string), soit absents.
function buildReunionsColumns() {
  return [
    {
      key: "projet_id",
      label: "Projet",
      render: (v) => {
        if (!v) return "—";
        if (typeof v === "object") return v.Titre_projet || "—";
        // projet_id existe mais l'API n'a renvoyé aucun projet correspondant :
        // référence cassée (projet supprimé, ou donnée de test invalide) —
        // à vérifier directement dans la collection Reunions en base.
        return "⚠ Projet introuvable";
      },
    },
    {
      key: "investisseur_id",
      label: "Investisseur",
      render: (v) => {
        if (!v) return "Non assigné";
        if (typeof v === "object") {
          // le modèle investisseur a des champs nom / prenom séparés (voir POST /Register)
          const full = `${v.prenom || ""} ${v.nom || ""}`.trim();
          return full || v.email || "—";
        }
        return "⚠ Investisseur introuvable";
      },
    },
    { key: "statut", label: "Statut", render: (v) => <StatutBadge statut={v} /> },
    { key: "decision", label: "Décision", render: (v) => <DecisionBadge decision={v} /> },
    { key: "date_reunion", label: "Date réunion", render: (v) => formatDateShort(v) },
    { key: "heure_reunion", label: "Heure", render: (v) => v || "—" },
  ];
}

// Colonnes explicites pour Entrepreneurs. "secteurs" est un tableau
// (mongoose.Schema.Types.Mixed) qui ne s'affiche pas bien dans une cellule
// de tableau — on met un lien "Voir plus" à la place, qui renvoie vers la
// fiche complète sur Liste_des_entrep.
function buildEntrepreneursColumns(navigate) {
  return [
    { key: "statut", label: "Statut" },
    { key: "nom_prenom", label: "Nom prenom" },
    { key: "pays_de_residence", label: "Pays de residence" },
    { key: "ville_de_residence", label: "Ville de residence" },
    { key: "email", label: "Email" },
    {
      key: "secteurs",
      label: "Secteurs",
      render: (v, item) => (
        <LinkButton
          label="Voir plus"
          onClick={() => navigate("/Liste_des_entrep", { state: { focusEntrepreneurId: item._id } })}
        />
      ),
    },
  ];
}

// Colonnes explicites pour Investisseurs (mêmes raisons que pour
// Entrepreneurs : "secteurs" est un tableau, donc un lien "Voir plus" plutôt
// que d'essayer de l'afficher dans une cellule).
function buildInvestisseursColumns(navigate) {
  return [
    { key: "statut", label: "Statut" },
    { key: "nom", label: "Nom" },
    { key: "prenom", label: "Prenom" },
    { key: "email", label: "Email" },
    { key: "gouvernorat", label: "Gouvernorat" },
    {
      key: "secteurs",
      label: "Secteurs",
      render: (v, item) => (
        <LinkButton
          label="Voir plus"
          onClick={() => navigate("/Liste_des_inv", { state: { focusInvestisseurId: item._id } })}
        />
      ),
    },
  ];
}

// Statuts d'un Projet, tels que gérés par le backend (POST /Projet met
// statut='en_attente', PATCH /Projet/:id/valider -> 'valide', /refuser -> 'refuse')
const PROJET_STATUT_STYLE = {
  en_attente: { label: "En attente", color: C.amber },
  valide: { label: "Validé", color: C.green },
  refuse: { label: "Refusé", color: C.seal },
};

function ProjetStatutBadge({ statut }) {
  const s = PROJET_STATUT_STYLE[statut];
  if (!s) return <span style={{ color: C.slate }}>—</span>;
  return (
    <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 600, color: s.color, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

// Le corps de réponse varie selon la route (ex: { projet: ... } pour
// /valider, { reunion: ... } pour PUT /Reunion/:id) — on cherche la clé
// pertinente pour fusionner la mise à jour dans le state local.
function extractUpdated(res) {
  const d = res && res.data;
  if (!d || typeof d !== "object") return {};
  return d.projet || d.reunion || d.investisseur || d.entrepreneur || {};
}

// -----------------------------------------------------------------------
// Config des routes réelles de server.js. Les GET (listes) sont au pluriel
// (/Projets, /Investisseurs, /Entrepreneurs, /Reunions) mais les routes de
// mutation sont au SINGULIER (/Projet/:id, /Investisseur/:id, /Entrepreneur/:id,
// /Reunion/:id) — c'est ce décalage qui causait les 404.
//
// Ce qui existe déjà côté backend et fonctionne tel quel :
//   - Projets    : Accepter (PATCH /Projet/:id/valider)
//   - Investisseurs / Entrepreneurs : Supprimer (DELETE /.../:id)
//
// Ce qui n'a PAS encore de route côté backend (voir les routes à ajouter
// données dans la réponse) :
//   - Projets       : Modifier, Supprimer
//   - Investisseurs : Modifier
//   - Entrepreneurs : Modifier
// Ces boutons restent câblés vers une route "logique" (PUT/DELETE /Xxx/:id)
// prête à fonctionner dès que vous ajoutez la route correspondante.
//
// Réunions n'est plus ici : ses actions (Planifier, Accepter/Refuser,
// Annuler, Supprimer) sont portées telles quelles depuis
// Liste_des_reuinions.jsx (voir plus bas dans le composant), pas devinées.
const ENTITY_MUTATION = {
  Projets: {
    
    supprimer: (item) => axios.delete(`http://localhost:8000/Projet/${item._id}`), // ⚠️ route à créer
    modifier: (item, form) => axios.put(`http://localhost:8000/Projet/${item._id}`, form), // ⚠️ route à créer
  },
  Investisseurs: {
    accepter: null, // pas de workflow de validation pour les investisseurs dans le backend actuel
    supprimer: (item) => axios.delete(`http://localhost:8000/Investisseur/${item._id}`),
    modifier: (item, form) => axios.put(`http://localhost:8000/Investisseur/${item._id}`, form), // ⚠️ route à créer
  },
  Entrepreneurs: {
    accepter: null, // idem
    supprimer: (item) => axios.delete(`http://localhost:8000/Entrepreneur/${item._id}`),
    modifier: (item, form) => axios.put(`http://localhost:8000/Entrepreneur/${item._id}`, form), // ⚠️ route à créer
  },
};

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function DashboardAdmin() {
  const navigate = useNavigate(); // gardé au cas où d'autres écrans en ont besoin

  const [activeView, setActiveView] = useState("dashboard"); // dashboard | Projets | Investisseurs | Entrepreneurs | Reunions

  const [projets, setProjets] = useState([]);
  const [reunions, setReunions] = useState([]);
  const [investisseurs, setInvestisseurs] = useState([]);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [stats, setStats] = useState({ totalProjets: 0, totalInvestisseurs: 0, totalEntrepreneurs: 0, secteursActifs: 0 });
  const [loading, setLoading] = useState(true);

  const [editingItem, setEditingItem] = useState(null); // { entity, item }

  useEffect(() => {
    // RequireAuth (allowedStatuts=['admin']) garantit déjà qu'un admin est connecté ici
    Promise.all([
      axios.get('http://localhost:8000/Projets'),
      axios.get('http://localhost:8000/Reunions'),
      axios.get('http://localhost:8000/Stats'),
      // ⚠️ adaptez ces deux routes si vos endpoints Investisseurs/Entrepreneurs
      // portent un autre nom côté backend
      axios.get('http://localhost:8000/Investisseurs'),
      axios.get('http://localhost:8000/Entrepreneurs'),
    ])
      .then(([projetsRes, reunionsRes, statsRes, investisseursRes, entrepreneursRes]) => {
        setProjets(projetsRes.data);
        setReunions(reunionsRes.data);
        setStats(statsRes.data);
        setInvestisseurs(investisseursRes.data);
        setEntrepreneurs(entrepreneursRes.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const derived = useMemo(() => {
    const budgetTotal = projets.reduce((sum, p) => sum + (p.bud_max_projet || 0), 0);

    const secteurCounts = {};
    projets.forEach((p) => {
      secteurCounts[p.secteur] = (secteurCounts[p.secteur] || 0) + 1;
    });
    const parSecteur = Object.entries(secteurCounts)
      .map(([secteur, value]) => ({ secteur: SECTEUR_LABELS[secteur] || secteur, value }))
      .sort((a, b) => b.value - a.value);

    const reunionCounts = { en_attente: 0, planifiee: 0, annulee: 0 };
    reunions.forEach((r) => {
      if (reunionCounts[r.statut] !== undefined) reunionCounts[r.statut] += 1;
    });
    const parStatutReunion = Object.keys(REUNION_STYLE)
      .map((key) => ({
        statut: key,
        value: reunionCounts[key],
        color: REUNION_STYLE[key].color,
      }))
      .filter((item) => item.value > 0);

    const recents = [...projets].slice(0, 6);

    return { budgetTotal, parSecteur, parStatutReunion, recents };
  }, [projets, reunions]);

  const projetsColumns = useMemo(() => buildProjetsColumns(), []);
  const reunionsColumns = useMemo(() => buildReunionsColumns(), []);
  const entrepreneursColumns = useMemo(() => buildEntrepreneursColumns(navigate), [navigate]);
  const investisseursColumns = useMemo(() => buildInvestisseursColumns(navigate), [navigate]);

  // -------------------------------------------------------------------------
  // Actions Modifier / Accepter / Supprimer, câblées sur les vraies routes
  // de server.js (voir ENTITY_MUTATION plus haut).
  // -------------------------------------------------------------------------
  const listSetters = {
    Projets: setProjets,
    Investisseurs: setInvestisseurs,
    Entrepreneurs: setEntrepreneurs,
    Reunions: setReunions,
  };

  function makeActionsFor(entity) {
    const setList = listSetters[entity];
    const conf = ENTITY_MUTATION[entity];
    return {
      onModifier: (item) => setEditingItem({ entity, item }),
      // Si aucune route "accepter" n'existe pour cette entité (Investisseurs,
      // Entrepreneurs), on ne passe pas onAccepter -> EntityListView masque
      // le bouton au lieu d'appeler une route qui n'existe pas.
      onAccepter: conf.accepter
        ? (item) => {
            conf
              .accepter(item)
              .then((res) => {
                setList((prev) =>
                  prev.map((x) => (x._id === item._id ? { ...x, ...extractUpdated(res) } : x))
                );
              })
              .catch((err) => console.log(err));
          }
        : undefined,
      onSupprimer: (item) => {
        if (!window.confirm("Confirmer la suppression ?")) return;
        conf
          .supprimer(item)
          .then(() => {
            setList((prev) => prev.filter((x) => x._id !== item._id));
          })
          .catch((err) => console.log(err));
      },
    };
  }

  function handleSaveEdit(form) {
    if (!editingItem) return;
    const { entity, item } = editingItem;
    const conf = ENTITY_MUTATION[entity];
    conf
      .modifier(item, form)
      .then((res) => {
        listSetters[entity]((prev) =>
          prev.map((x) => (x._id === item._id ? { ...x, ...form, ...extractUpdated(res) } : x))
        );
        setEditingItem(null);
      })
      .catch((err) => console.log(err));
  }

  // Réunions n'a plus de logique propre ici : le bouton "Gérer" renvoie
  // directement vers Liste_des_reuinions.jsx, qui contient déjà le
  // mécanisme complet (planifier, accepter/refuser, annuler, supprimer).

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        fontFamily: SANS,
        background: C.paperDeep,
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          flexShrink: 0,
          background: C.graphite,
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${C.graphiteLine}`,
        }}
      >
        <div style={{ padding: "24px 20px 18px", paddingTop: "clamp(96px, 12vh, 130px)" }}>
          <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, color: "#F4F2EC" }}>
            InvestLink
          </div>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.slate,
              marginTop: 3,
            }}
          >
            Admin
          </div>
        </div>
        <nav style={{ padding: "6px 12px" }}>
          <NavItem
            icon={LayoutDashboard}
            label="Tableau de bord"
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
          />
          <NavItem
            icon={Briefcase}
            label="Projets"
            active={activeView === "Projets"}
            onClick={() => setActiveView("Projets")}
          />
          <NavItem
            icon={Users}
            label="Investisseurs"
            active={activeView === "Investisseurs"}
            onClick={() => setActiveView("Investisseurs")}
          />
          <NavItem
            icon={UserCheck}
            label="Entrepreneurs"
            active={activeView === "Entrepreneurs"}
            onClick={() => setActiveView("Entrepreneurs")}
          />
          <NavItem
            icon={FileText}
            label="Réunions"
            active={activeView === "Reunions"}
            onClick={() => setActiveView("Reunions")}
          />
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "30px 36px 40px", paddingTop: "clamp(96px, 12vh, 130px)" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: C.gold,
              marginBottom: 4,
            }}
          >
            Admin · {activeView === "dashboard" ? "Vue d'ensemble" : ENTITY_CONFIG[activeView]?.label}
          </div>
          <div style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: C.ink }}>
            {activeView === "dashboard" ? "Tableau de bord" : ENTITY_CONFIG[activeView]?.label}
          </div>
          <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 3 }}>
            {activeView === "dashboard"
              ? "Aperçu global des projets, investisseurs et entrepreneurs sur la plateforme."
              : `Liste complète : modifiez, acceptez ou supprimez ${ENTITY_CONFIG[activeView]?.singular}.`}
          </div>
        </div>

        {loading ? (
          <div style={{ color: C.inkSoft, padding: "40px 0", textAlign: "center" }}>Chargement...</div>
        ) : activeView === "dashboard" ? (
          <>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
              <KpiCard
                icon={Briefcase}
                label="Projets totaux"
                value={stats.totalProjets}
                detail={`Budget total demandé: ${formatBudget(derived.budgetTotal)}`}
                fg={C.ink}
                bg="#EDEAE0"
              />
              <KpiCard
                icon={Users}
                label="Investisseurs"
                value={stats.totalInvestisseurs}
                detail="inscrits sur la plateforme"
                fg={C.blue}
                bg={C.blueBg}
              />
              <KpiCard
                icon={UserCheck}
                label="Entrepreneurs"
                value={stats.totalEntrepreneurs}
                detail="porteurs de projet"
                fg={C.green}
                bg={C.greenBg}
              />
              <KpiCard
                icon={Layers}
                label="Secteurs couverts"
                value={`${stats.secteursActifs}/7`}
                detail="domaines d'activité actifs"
                fg={C.gold}
                bg={C.goldBg}
              />
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 16, marginBottom: 20 }}>
              <ChartCard title="Réunions par statut">
                {derived.parStatutReunion.length === 0 ? (
                  <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: C.slate, fontSize: 12.5 }}>
                    Aucune demande de réunion pour le moment
                  </div>
                ) : (
                  <div style={{ height: 230 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={derived.parStatutReunion}
                          dataKey="value"
                          nameKey="statut"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {derived.parStatutReunion.map((entry) => (
                            <Cell key={entry.statut} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={tooltipStyle}
                          formatter={(v, n, props) => [v, REUNION_STYLE[props.payload.statut]?.label || props.payload.statut]}
                        />
                        <Legend
                          verticalAlign="bottom"
                          iconType="circle"
                          iconSize={8}
                          formatter={(value, entry) => REUNION_STYLE[entry.payload.statut]?.label || value}
                          wrapperStyle={{ fontFamily: SANS, fontSize: 11.5, color: C.inkSoft }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>

              <ChartCard title="Projets par secteur">
                {derived.parSecteur.length === 0 ? (
                  <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center", color: C.slate, fontSize: 12.5 }}>
                    Aucun projet pour le moment
                  </div>
                ) : (
                  <div style={{ height: 230 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={derived.parSecteur} layout="vertical" margin={{ left: 10, right: 20 }}>
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: C.slate }} axisLine={{ stroke: C.paperLine }} tickLine={false} />
                        <YAxis
                          type="category"
                          dataKey="secteur"
                          width={140}
                          tick={{ fontSize: 11, fill: C.inkSoft, fontFamily: SANS }}
                          axisLine={{ stroke: C.paperLine }}
                          tickLine={false}
                        />
                        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [v, "projets"]} cursor={{ fill: C.paperDeep }} />
                        <Bar dataKey="value" fill={C.gold} radius={[0, 4, 4, 0]} barSize={14} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </ChartCard>
            </div>

            {/* Recent projects */}
            <div
              style={{
                background: C.paper,
                border: `1px solid ${C.paperLine}`,
                borderRadius: 16,
                padding: "20px 22px",
              }}
            >
              <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12 }}>
                Derniers projets ajoutés
              </div>

              {derived.recents.length === 0 ? (
                <div style={{ color: C.slate, fontSize: 12.5, padding: "20px 4px" }}>
                  Aucun projet pour le moment.
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.6fr 1.2fr 1.3fr 1fr 0.9fr",
                      fontFamily: SANS,
                      fontSize: 10.5,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: C.slate,
                      padding: "0 4px 8px",
                      borderBottom: `1px solid ${C.paperLine}`,
                    }}
                  >
                    <span>Projet</span>
                    <span>Secteur</span>
                    <span>Entrepreneur</span>
                    <span>Budget max</span>
                    <span>Type</span>
                  </div>
                  {derived.recents.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.6fr 1.2fr 1.3fr 1fr 0.9fr",
                        alignItems: "center",
                        padding: "12px 4px",
                        borderBottom: `1px solid ${C.paperLine}`,
                        fontSize: 12.5,
                        color: C.ink,
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{p.Titre_projet}</span>
                      <span style={{ color: C.inkSoft }}>{SECTEUR_LABELS[p.secteur] || p.secteur}</span>
                      <span style={{ color: C.inkSoft }}>
                        {p.entrepreneur_id && p.entrepreneur_id.nom_prenom ? p.entrepreneur_id.nom_prenom : '—'}
                      </span>
                      <span style={{ fontFamily: SERIF, fontWeight: 700, color: C.gold }}>
                        {formatBudget(p.bud_max_projet)}
                      </span>
                      <span>
                        <TypePill type={p.type_projet} />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : activeView === "Projets" ? (
          <EntityListView
            title="Tous les projets"
            items={projets}
            columns={projetsColumns}
            emptyLabel="Aucun projet pour le moment."
            {...makeActionsFor("Projets")}
          />
        ) : activeView === "Investisseurs" ? (
          <EntityListView
            title="Tous les investisseurs"
            items={investisseurs}
            columns={investisseursColumns}
            emptyLabel="Aucun investisseur pour le moment."
            {...makeActionsFor("Investisseurs")}
          />
        ) : activeView === "Entrepreneurs" ? (
          <EntityListView
            title="Tous les entrepreneurs"
            items={entrepreneurs}
            columns={entrepreneursColumns}
            emptyLabel="Aucun entrepreneur pour le moment."
            {...makeActionsFor("Entrepreneurs")}
          />
        ) : activeView === "Reunions" ? (
          <EntityListView
            title="Toutes les réunions"
            items={reunions}
            columns={reunionsColumns}
            emptyLabel="Aucune réunion pour le moment."
            renderActions={() => <LinkButton label="Gérer" onClick={() => navigate("/Liste_des_reuinions")} />}
          />
        ) : null}
      </main>

      {editingItem && (
        <EditModal
          item={editingItem.item}
          columns={editingItem.entity === "Projets" ? projetsColumns : null}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}