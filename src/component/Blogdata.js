// Contenu des articles, partagé entre l'accueil (teasers) et BlogDetail.jsx
// (page complète). Un seul endroit à modifier pour mettre à jour un article.

const BLOG_POSTS = [
  {
    id: 1,
    slug: 'dossier-projet',
    image: '/assets/images/blog/dossier-projet.webp',
    tag: 'Entrepreneurs',
    title: "Comment préparer un dossier de projet qui convainc les investisseurs",
    desc: "Budget réaliste, secteur clair, jalons précis : les éléments qui font la différence dans un dossier de financement.",
    content: [
      {
        heading: "Un secteur et une localisation clairement identifiés",
        paragraphs: [
          "Sur la plateforme, chaque projet est rattaché à un secteur précis (technologie, agriculture et agroalimentaire, santé...) et à une localisation. Ce ne sont pas de simples champs administratifs : c'est ce qui permet à un investisseur de vous trouver quand il filtre les projets selon ses propres secteurs d'intérêt. Un projet mal classé, ou avec une localisation vague, risque tout simplement de ne jamais apparaître dans les recherches des bonnes personnes.",
        ],
      },
      {
        heading: "Un budget cohérent, pas seulement optimiste",
        paragraphs: [
          "Le budget minimum et maximum que vous indiquez doit refléter une fourchette réaliste, pas le montant idéal dont vous rêvez. Un investisseur qui compare plusieurs projets d'un même secteur remarque tout de suite un budget qui ne correspond pas à l'ampleur réelle du projet décrit. Mieux vaut une fourchette resserrée et justifiable qu'un écart large qui donne l'impression que le montant n'a pas été réfléchi.",
        ],
      },
      {
        heading: "Un titre et une description qui vont à l'essentiel",
        paragraphs: [
          "Le titre de votre projet est souvent la première chose qu'un investisseur voit dans la liste. Il doit dire clairement de quoi il s'agit, sans jargon inutile. La description, elle, doit répondre en quelques phrases aux questions évidentes : quel problème le projet résout-il, pour qui, et pourquoi maintenant.",
        ],
      },
      {
        heading: "Le type de projet compte aussi",
        paragraphs: [
          "Un projet \"en ligne\" et un projet \"physique\" n'attirent pas le même profil d'investisseur, ni les mêmes attentes en termes de logistique et de délais. Assurez-vous que ce champ correspond bien à la réalité de votre activité : ça évite les malentendus dès la première prise de contact.",
        ],
      },
      {
        heading: "Après la soumission : la validation",
        paragraphs: [
          "Chaque projet soumis passe d'abord par le statut \"en attente\" le temps qu'un administrateur de la plateforme le valide. C'est une étape de contrôle qualité, pas une formalité à prendre à la légère : un dossier incomplet ou peu clair peut être refusé. Prenez le temps de relire votre soumission avant de l'envoyer.",
        ],
      },
      {
        heading: "Une fois validé : restez réactif",
        paragraphs: [
          "Un projet validé devient visible publiquement, et les investisseurs intéressés peuvent demander une réunion directement depuis la liste des projets. À partir de là, la balle est autant dans votre camp que dans le leur : une réponse rapide et une disponibilité réelle pour la réunion pèsent presque autant que le dossier lui-même dans la décision finale.",
        ],
      },
      {
        heading: "Ce qui se passe après une réunion",
        paragraphs: [
          "Si la réunion se passe bien, l'investisseur (ou l'administrateur, selon le fonctionnement de la plateforme) peut donner une décision favorable, ce qui déclenche la création d'un contrat entre vous et l'investisseur. C'est à ce moment que les modalités concrètes (montant, participation) se discutent et se formalisent.",
        ],
      },
    ],
  },
  {
    id: 2,
    slug: 'criteres-investisseurs',
    image: '/assets/images/blog/criteres-investisseurs.webp',
    tag: 'Investisseurs',
    title: "Ce que les investisseurs regardent avant de s'engager",
    desc: "Cohérence du budget, sérieux du porteur de projet, potentiel du secteur : les critères qui pèsent le plus dans la décision.",
    content: [
      {
        heading: "La cohérence entre le budget et le secteur",
        paragraphs: [
          "Avant même de penser au retour sur investissement, la première chose qu'un investisseur expérimenté vérifie, c'est si le budget demandé est cohérent avec l'ampleur du projet et les standards du secteur. Un budget qui semble décorrélé de la réalité du terrain est souvent le premier signal d'alerte, avant même d'avoir échangé avec le porteur de projet.",
        ],
      },
      {
        heading: "Le sérieux et la clarté du dossier",
        paragraphs: [
          "Un projet bien décrit, avec un titre précis et une localisation cohérente, en dit long sur le soin que l'entrepreneur a mis dans sa préparation. Ce n'est pas une garantie de réussite, mais un dossier flou ou approximatif est rarement le fait d'un porteur de projet organisé.",
        ],
      },
      {
        heading: "Le potentiel du secteur choisi",
        paragraphs: [
          "Tous les secteurs ne se valent pas au même moment. La plateforme couvre sept domaines (technologie, construction et immobilier, agriculture et agroalimentaire, commerce et e-commerce, santé, éducation, énergie et environnement), et leur dynamisme respectif évolue avec le contexte économique. Un projet dans un secteur en croissance n'est pas automatiquement meilleur, mais ça reste un facteur à intégrer dans l'analyse globale.",
        ],
      },
      {
        heading: "Utiliser les filtres par secteur pour cibler sa recherche",
        paragraphs: [
          "Plutôt que de parcourir tous les projets un par un, la plateforme permet de filtrer directement par secteur d'intérêt. C'est le moyen le plus efficace de concentrer son attention sur les projets réellement pertinents, surtout quand le nombre de projets soumis augmente.",
        ],
      },
      {
        heading: "Après la demande de réunion",
        paragraphs: [
          "Une fois qu'un projet retient votre attention, la demande de réunion se fait directement depuis la liste des projets. C'est l'occasion de poser les questions que le dossier écrit ne couvre pas : la disponibilité et la clarté des réponses de l'entrepreneur pendant cet échange sont souvent aussi révélatrices que le dossier lui-même.",
        ],
      },
      {
        heading: "La décision finale et le contrat",
        paragraphs: [
          "Après la réunion, la décision (accepter ou refuser) est enregistrée sur la plateforme. En cas d'acceptation, un contrat est créé pour formaliser la suite : montant, pourcentage de participation, et modalités. C'est cette étape qui transforme un intérêt en engagement concret.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: 'secteurs-tunisie',
    image: '/assets/images/blog/secteurs-tunisie.webp',
    tag: 'Marché',
    title: "Les secteurs qui attirent le plus les investisseurs en Tunisie",
    desc: "Technologie, agroalimentaire, énergie : tour d'horizon des secteurs les plus actifs sur la plateforme.",
    content: [
      {
        heading: "Une année charnière pour l'investissement en Tunisie",
        paragraphs: [
          "Le nouveau plan quinquennal tunisien vise une hausse de 12% des investissements, avec un objectif proche de 30 milliards de dinars, dont environ 4 milliards d'investissements directs étrangers. Cette dynamique s'appuie notamment sur la digitalisation des procédures et de nouveaux mécanismes de financement destinés à élargir l'accès au crédit pour les porteurs de projets.",
        ],
      },
      {
        heading: "La technologie, secteur le plus dynamique",
        paragraphs: [
          "Avec plus de 1 450 startups actives, la Tunisie continue de se positionner comme un pôle technologique régional, porté par une main-d'œuvre qualifiée et des coûts compétitifs. La FinTech, la HealthTech et l'EdTech figurent parmi les segments qui attirent le plus de financements, aux côtés de l'intelligence artificielle et du deep tech, des domaines où des succès locaux ont démontré le potentiel du pays à l'international.",
        ],
      },
      {
        heading: "Agriculture et agroalimentaire : un secteur stratégique",
        paragraphs: [
          "L'agriculture reste identifiée par les autorités comme l'un des secteurs porteurs prioritaires, aux côtés de projets liés au dessalement de l'eau. L'agritech en particulier profite d'un double avantage : une forte demande locale et un potentiel d'exportation vers les marchés européens et africains.",
        ],
      },
      {
        heading: "Énergie et environnement : la transition qui attire les capitaux",
        paragraphs: [
          "Le solaire, l'interconnexion énergétique régionale et les projets liés aux énergies renouvelables figurent parmi les priorités du plan national. La GreenTech, incluant la gestion des déchets et les infrastructures énergétiquement sobres, gagne aussi du terrain, portée par l'intérêt croissant pour des projets combinant impact environnemental et rentabilité.",
        ],
      },
      {
        heading: "Santé et éducation : des niches en émergence",
        paragraphs: [
          "La santé numérique (télémédecine, gestion hospitalière) et l'EdTech (formation en ligne, bootcamps de programmation) sont régulièrement citées parmi les secteurs à surveiller, avec une demande qui dépasse déjà l'offre actuelle de solutions locales.",
        ],
      },
      {
        heading: "Comment ça se reflète sur la plateforme",
        paragraphs: [
          "Ces tendances ne sont pas qu'une question de statistiques nationales : elles se retrouvent directement dans les secteurs les plus actifs sur la plateforme. Que vous soyez entrepreneur ou investisseur, garder un œil sur ces dynamiques peut vous aider à mieux positionner votre projet, ou à orienter vos recherches vers les secteurs les plus prometteurs du moment.",
        ],
      },
    ],
  },
];

export default BLOG_POSTS;