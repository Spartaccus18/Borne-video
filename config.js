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
  couleurPrincipale: "#0b57d0",   // fond bleu
  couleurAccent: "#ffffff",       // boutons

  /* ---------- Logo (accueil + écran « Merci ») ----------
     Nom du fichier image placé à côté d'index.html. "" = pas de logo.
     Idéalement un PNG blanc sur fond transparent.                           */
  logo: "logo-content-camp.png",

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
  prisesMax: 3,                   // nombre d'essais maximum par question
  retourAccueilSecondes: 90,      // retour à l'accueil si personne ne touche l'écran
  ecranMerciSecondes: 8,          // durée de l'écran « Merci »
  exportParLot: 0,                // vidéos par envoi à l'export : 0 = tout en une fois (sinon 50, 25 ou 10)
                                  // modifiable aussi directement dans le menu organisateur

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

  /* ---------- Étape « La pose » (vidéo muette en ouverture) ----------
     Un mannequin 3D montre la pose ; la borne enregistre ensuite quelques
     secondes guidées (regard, sourire, mouvement de tête) pour les montages. */
  pose: {
    active: true,
    duree: 9,
    titre: "D'abord, la pose",
    etapesAvant: [
      "Tournez légèrement le corps, visage vers l'objectif",
      "Menton un peu en avant et vers le bas",
      "Épaules relâchées, penchez-vous un peu vers nous"
    ],
    etapesPendant: [
      "Regard dans l'objectif, visage détendu",
      "Souriez, naturellement",
      "Tournez un peu la tête… et revenez vers nous"
    ]
  },

  /* Analyse automatique de chaque prise, directement sur l'iPad (sans internet) :
     cadrage, lumière, son, sourire. Conseils affichés au candidat. */
  analyseAuto: true,

  /* ---------- Questions ----------
     id     : court, sans espace ni accent (sert au nom du fichier)
     texte  : la question affichée en grand
     aide   : une ligne d'aide sous la question (facultatif)
     duree  : durée maximale en secondes                                      */
  questions: [
    {
      id: "Q1-presentation",
      texte: "Présentez-vous",
      aide: "Prénom, nom, métier et commune. « Je m'appelle…, je suis… et j'habite à… »",
      duree: 30
    },
    {
      id: "Q2-engagement",
      texte: "Pour quoi vous engagez-vous ?",
      aide: "Deux thèmes qui vous tiennent à cœur, et pourquoi.",
      duree: 30
    },
    {
      id: "Q3-vaud-2037",
      texte: "Complétez : « Le Canton de Vaud dans dix ans, j'aimerais qu'il soit… »",
      aide: "Une phrase, avec votre cœur.",
      duree: 20
    },
    {
      id: "Q4-coin-prefere",
      texte: "Votre coin préféré du canton ?",
      aide: "Dites où, et pourquoi en une phrase.",
      duree: 20
    }
  ],

  /* ---------- Journées de shooting ----------
     Les noms peuvent être saisis ici OU collés directement sur l'iPad
     (menu administrateur > « Noms du jour »), ce qui évite de les publier
     en ligne. La liste saisie sur l'iPad est prioritaire.                    */
  journees: [
    {
      id: "J1",
      libelle: "Mar 27 oct · Lausanne",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J2",
      libelle: "Jeu 29 oct · Lausanne",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J3",
      libelle: "Sam 31 oct · Féchy",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J4",
      libelle: "Mer 4 nov · Villeneuve",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    },
    {
      id: "J5",
      libelle: "Sam 7 nov · Yverdon",
      candidats: ["Personne 1", "Personne 2", "Personne 3"]
    }
  ]
};
