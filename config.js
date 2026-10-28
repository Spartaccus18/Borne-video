/* ==========================================================================
   BORNE VIDÉO — FICHIER DE CONFIGURATION
   C'est le SEUL fichier à modifier pour changer les questions, les journées,
   les noms ou les réglages. Respectez les guillemets et les virgules.
   ========================================================================== */

window.BORNE_CONFIG = {

  /* ---------- Textes généraux ---------- */
  titre: "Élections cantonales 2027",
  sousTitre: "Votre vidéo en 2 minutes",
  messageFinTitre: "Merci beaucoup !",
  messageFin: "Vos vidéos ont bien été enregistrées.",

  /* ---------- Couleurs (codes hexadécimaux) ---------- */
  couleurPrincipale: "#00a0e2",   // fond cyan PLR (charte 2027 : cyan #00A0E2, bleu foncé #074EA1, magenta #E6007D)
  retourVideoPendantPrise: false, // false = pas de retour vidéo pendant la prise (écran blanc + cadre de la question)
  couleurAccent: "#ffffff",       // boutons

  /* ---------- Logo (accueil + écran « Merci ») ----------
     Nom du fichier image placé à côté d'index.html. "" = pas de logo.
     Idéalement un PNG blanc sur fond transparent.                           */
  logo: "fdp-logo-blanc.svg",
  logoDroite: "logo-content-camp.png",   // logo Content Camp, en haut à droite (symétrique du logo PLR)

  /* ---------- Anneau lumineux pendant l'enregistrement ----------
     Cadre blanc sur tout le tour de l'écran pour éclairer le visage (activable aussi
     dans le menu organisateur). largeurAnneau : épaisseur en % du petit côté de
     l'écran (12 = environ 100 px ; 16 = plus de lumière, image plus petite). */
  anneauLumineux: true,
  largeurAnneau: 12,
  couleurAnneau: "#ffffff",       // blanc pur (lumière maximale)

  /* ---------- Réglages de la borne ---------- */
  codeAdmin: "1848",              // code du menu administrateur (à changer !)
  compteARebours: 3,              // secondes avant le début de l'enregistrement
  // (plus de limite d'essais : le candidat peut refaire une prise autant de fois qu'il le souhaite)
  retourAccueilSecondes: 600,     // retour à l'accueil si personne ne touche l'écran (10 minutes)
  ecranMerciSecondes: 8,          // durée de l'écran « Merci »
  exportParLot: 0,                // vidéos par envoi à l'export : 0 = tout en une fois (sinon 50, 25 ou 10)
                                  // modifiable aussi directement dans le menu organisateur

  /* ---------- Dashboard PLR Vaud (module Shooting) ----------
     Liste du jour, statut des prises et envoi des vidéos au serveur.
     La clé n'est PAS ici : elle se colle dans le menu organisateur (carte « Dashboard »)
     ou arrive par le lien donné dans l'onglet Shooting du dashboard.                 */
  dashboardUrl: "https://plr-vd.contentcamp.ch/ipad/api",

  /* Qualité vidéo : l'iPad fait au mieux dans la limite de ces valeurs */
  video: {
    largeur: 1080,
    hauteur: 1920,
    imagesParSeconde: 30,
    debitVideo: 12000000,         // 12 Mbit/s
    debitAudio: 192000            // 192 kbit/s
  },

  /* true  = traitement audio de l'iPad activé (recommandé : niveau de voix correct)
     false = son brut : sur iPad, le micro devient quasi muet, à éviter      */
  traitementAudio: true,

  /* ---------- Bonjour + consignes (avant le retour caméra) ----------
     Après avoir touché son nom, le candidat voit « Bonjour [nom] ! », puis
     chaque consigne en grand, une par écran, sans se voir à l'écran.
     Chaque écran passe tout seul (durées en secondes) ; toucher l'écran avance.
     icone : objectif | sourire | refaire | info
     {objectif} est remplacé par la position de l'objectif (« tout en haut de l'iPad »…). */
  dureeBonjour: 3.5,
  dureeConsigne: 6,
  consignes: [
    { icone: "objectif", titre: "Regardez l'objectif", texte: "Pas l'écran : l'objectif, {objectif}. C'est lui, votre public." },
    { icone: "sourire",  titre: "Parlez comme à un ami", texte: "Souriez, faites des phrases courtes, gardez un ton naturel." },
    { icone: "refaire",  titre: "Pas de stress", texte: "Vous pourrez revoir chaque réponse et la refaire si besoin." }
  ],

  /* ---------- Étape « La pose » (ouverture de la séance) ----------
     Un mannequin 3D montre les cinq gestes ; la borne enregistre ensuite
     16 secondes guidées, avec le son (la phrase finale : « Le 28 février on vote ! … En attendant, bon film ! »). */
  pose: {
    active: true,
    duree: 16,
    titre: "Pour finir, la pose",
    /* Cinq gestes, dans cet ordre ; le dernier est parlé : « Le 28 février on vote ! » [pause] « En attendant, bon film ! » (diffusion au cinéma) */
    etapes: [
      "Droit, face à l'objectif",
      "Tournez-vous : profil de trois-quarts, visage vers l'objectif",
      "Croisez les bras",
      "Souriez",
      "Montrez l'objectif de l'index et dites « Le 28 février on vote ! », puis, après une courte pause, « En attendant, bon film ! »"
    ]
  },

  /* Analyse automatique de chaque prise, directement sur l'iPad (sans internet) :
     cadrage, lumière, son, sourire. Conseils affichés au candidat. */
  analyseAuto: true,

  /* ---------- Contrôle du son (micro Bluetooth ou sans fil) ----------
     microExterne : "avertir" = bandeau rouge et remarque si l'iPad utilise son propre micro
                    "bloquer" = aucune prise possible sans le micro externe
                    "non"     = on tourne avec le micro de l'iPad
     (modifiable aussi dans le menu organisateur, carte « Micro et contrôle du son »)
     alertesEnDirect : messages pendant la prise (« Parlez plus fort », « Le micro s'est coupé »…) */
  microExterne: "avertir",
  alertesEnDirect: true,

  /* ---------- Contrôle du regard et du cadrage ----------
     Outil : MediaPipe Face Mesh (dossier vendor/mediapipe, 100 % local). Il repère l'iris de chaque œil.
     Seuils réglés sur 942 images de 31 candidats (27.10) : quand on regarde l'objectif, l'iris est à 0,49 ± 0,02
     de la largeur de l'œil. regard.h : écart horizontal toléré (0,065 = un peu plus que 3 fois l'écart habituel) ;
     regard.bas : position verticale de l'iris au-delà de laquelle on regarde vers le bas (l'écran) ;
     regard.tete : écart de rotation de la tête toléré ; regard.part : part de la prise passée à regarder ailleurs
     avant de le signaler (0,4 = 40 %). Augmenter = plus tolérant.
     detectionRegard: false désactive l'outil (retour à l'ancienne estimation, moins fiable). */
  detectionRegard: true,
  regard: { h: 0.065, bas: 0.57, tete: 0.2, part: 0.4 },
  /* Taille visée du visage, en part de la hauteur de l'image (candidats du 27.10 : de 0,13 à 0,43 ; médiane 0,17).
     Mémoriser un cadrage de référence dans le menu organisateur remplace cette fenêtre. */
  cadrage: { visageMin: 0.18, visageMax: 0.26 },

  /* ---------- Noms des fichiers exportés ----------
     Prenom-Nom_Q1_p1_validee.mp4 (la pose est la Q5). Toujours sans accent ni symbole (compatible Windows). */

  /* ---------- Questions ----------
     id     : court, sans espace ni accent (sert au nom du fichier)
     texte  : la question affichée en grand
     titreCourt : intitulé court affiché dans le sommaire du candidat
     aide   : une ligne d'aide sous la question (facultatif)
     duree  : durée maximale en secondes                                      */
  questions: [
    {
      id: "Q1-presentation",
      titreCourt: "Se présenter",
      texte: "Présentez-vous en quelques mots.",
      aide: "Votre nom, votre commune, votre métier, un détail qui vous ressemble, et votre candidature. (environ 5 secondes)",
      duree: 20
    },
    {
      id: "Q2-engagement",
      titreCourt: "Mon engagement",
      texte: "Pourquoi vous engagez-vous ? Quels thèmes politiques vous tiennent à cœur ?",
      aide: "Ce que vous observez autour de vous, puis ce que vous voulez changer. Un ou deux thèmes suffisent. (environ 10 secondes)",
      duree: 30
    },
    {
      id: "Q3-vaud-2037",
      titreCourt: "Ma vision du canton",
      texte: "Quelle est votre vision pour le futur du canton ?",
      aide: "Par exemple : « Dans dix ans, j'aimerais que le canton de Vaud… » ou « Je veux un canton où… ». (environ 10 secondes)",
      duree: 30
    },
    {
      id: "Q4-coin-prefere",
      titreCourt: "Un coin ou une anecdote",
      texte: "Voulez-vous partager une anecdote personnelle, un coin du canton qui vous est cher, ou porter un autre message ?",
      aide: "Question facultative : si rien ne vous vient, touchez « Passer ». (environ 10 secondes)",
      facultative: true,
      duree: 30
    }
  ],

  /* ---------- Journées de shooting ----------
     Les noms peuvent être saisis ici OU collés directement sur l'iPad
     (menu administrateur > « Noms du jour »), ce qui évite de les publier
     en ligne. La liste saisie sur l'iPad est prioritaire.                    */
  journees: [
    {
      id: "J1",
      date: "2026-10-27",
      libelle: "Mar 27 oct · Lausanne",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J2",
      date: "2026-10-29",
      libelle: "Jeu 29 oct · Lausanne",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J3",
      date: "2026-10-31",
      libelle: "Sam 31 oct · Féchy",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J4",
      date: "2026-11-04",
      libelle: "Mer 4 nov · Villeneuve",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J5",
      date: "2026-11-07",
      libelle: "Sam 7 nov · Yverdon",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    }
  ]
};
