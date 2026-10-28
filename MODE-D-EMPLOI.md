# Borne vidéo v2 — Mode d'emploi

Borne d'enregistrement autonome pour iPad (format vertical 9:16), shooting PLR Vaud EC 2027.

## 1. Contenu du dossier

| Fichier | Rôle | À modifier ? |
|---|---|---|
| `index.html` | L'application (écrans, caméra, enregistrement, menu organisateur) | Non |
| `config.js` | Questions, journées, noms, durées, code organisateur | **Oui, c'est le seul** |
| `sw.js` | Permet à la borne de fonctionner sans internet sur place | Non |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Icône et affichage plein écran | Non |
| `logo-content-camp.png` | Logo Content Camp, en haut à droite de l'accueil et de l'écran « Merci » (blanc sur fond transparent) ; le logo PLR est en haut à gauche (`fdp-logo-blanc.svg`) | Remplaçable (même nom, ou changer `logo` / `logoDroite` dans `config.js`) |
| `MODE-D-EMPLOI.md` | Ce guide (inutile de le mettre en ligne) | — |

## 2. Mise en ligne sur GitHub Pages (une seule fois, env. 10 min, gratuit)

1. Créer un compte gratuit sur github.com (si ce n'est pas déjà fait).
2. En haut à droite : **+ › New repository**. Nom : `borne-video`. Cocher **Public** (obligatoire pour GitHub Pages gratuit). Cliquer **Create repository**.
3. Sur la page du dépôt vide : lien **uploading an existing file**. Glisser les fichiers et les dossiers `vendor` et `models`, ainsi que les 8 fichiers (`index.html`, `config.js`, `sw.js`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `logo-content-camp.png`). Cliquer **Commit changes**.
4. **Settings › Pages** (menu de gauche). Source : **Deploy from a branch**, branche **main**, dossier **/ (root)**. **Save**.
5. Attendre 1 à 2 minutes. L'adresse de la borne apparaît en haut de la page Pages : `https://VOTRE-COMPTE.github.io/borne-video/`.

> Ce qui est public : le code et le contenu de `config.js` (questions, noms s'ils y sont inscrits). **Les vidéos, elles, ne quittent jamais l'iPad.** Pour ne pas publier les noms avant l'annonce officielle, saisissez-les directement sur l'iPad (menu organisateur › « Noms du jour »).

## 3. Installation sur l'iPad

1. Mettre l'iPad à jour (Réglages › Général › Mise à jour logicielle).
2. Ouvrir l'adresse de la borne dans **Safari**.
3. Bouton **Partager** › **Sur l'écran d'accueil** › **Ajouter**.
4. **Toujours lancer la borne depuis cette icône** (plein écran, hors ligne, stockage protégé). Attention : Safari et l'icône n'ont pas le même stockage ; des vidéos enregistrées dans l'un ne sont pas visibles dans l'autre.
5. Toucher un nom › autoriser **Caméra** et **Micro**.

## 4. Premier réglage (menu organisateur)

Ouverture : **5 touches rapides dans le coin en haut à droite** de l'écran d'accueil, puis le code (par défaut `1848` ; à changer dans `config.js`).

1. **Position de la caméra frontale** : « En haut » pour les iPad Pro jusqu'à 2022 (objectif sur le petit côté). Sur un iPad plus récent, l'objectif est sur le grand côté : choisir « À gauche » ou « À droite » selon le sens de l'iPad.
2. **Journée active** : choisir la date du jour. Les candidats ne voient que les noms de cette journée.
3. **Noms du jour** : coller la liste (un nom par ligne), puis **Enregistrer les noms**.
4. **Test caméra et micro** : « Calibrer et enregistrer un test de 5 s ». La borne essaie d'abord plusieurs formats de caméra et garde celui qui donne la meilleure définition en vertical (ligne « Réglage retenu »). Vérifier :
   - la ligne *Zone utile 9:16* : idéalement **1080 × 1920 ✔ pleine définition** ;
   - la ligne *Fichier test* indique **1080 × 1920 · vertical ✔** ;
   - la lecture est nette et le son propre (écouter avec le micro prévu pour le jour J).
   - la ligne *Profil* indique **lisible ✔** (sinon la borne essaie d'elle-même un autre profil) ;
   - Si la vidéo est couchée ou au mauvais format : passer en **« Recadrage 9:16 forcé »** et refaire le test.
5. Faire un **essai d'export** (voir point 7) vers votre Mac pour valider toute la chaîne.

## 5. Mode borne (à faire chaque matin)

- **Accès guidé** : Réglages › Accessibilité › Accès guidé › activer et définir un code. Dans la borne, triple-clic sur le bouton du haut › **Démarrer**. Le candidat ne peut plus quitter l'application. Pour sortir : triple-clic + code.
- **Verrouillage automatique** : Réglages › Luminosité et affichage › Verrouillage automatique › **Jamais**.
- **Concentration « Ne pas déranger »** activée (aucune notification pendant une prise).
- iPad **branché** au secteur, sur pied, objectif à hauteur des yeux.
- Relancer la borne depuis l'icône et faire le test « Calibrer et enregistrer un test de 5 s ».
- Micro allumé, chargé et porté à sa place, puis menu organisateur › « Micro et contrôle du son » › **Test du son (10 s)** : 3 secondes de silence, puis 6 secondes en parlant normalement. Le verdict doit afficher « ✔ Son prêt pour le tournage ».

## 6. Parcours du candidat

Accueil (noms dans l'ordre de passage, les candidats déjà passés en bas de liste) › **fiche du candidat** (sommaire des 5 étapes, faites = grisées, à faire = blanches) › « Commencer » › **vérification du cadrage** › « Bonjour [nom] ! » et 3 conseils, un par écran, sans caméra (ils défilent seuls ; toucher l'écran avance) › pour chaque étape (questions 1 à 4, puis la pose = étape 5) : écran de la question › décompte 3-2-1 › enregistrement (barre de temps, bouton « Terminer ») › relecture et 3 conseils (son, regard, cadrage) › « C'est parfait » ou « Recommencer » (autant d'essais que voulu ; la question est relue avant chaque nouvelle prise) › « Merci ! » › retour automatique à l'accueil.

- **Se repérer** : une barre de progression et « Étape 2 sur 5 » sont visibles à chaque étape. Le lien « Sommaire » (et « Question précédente ») permet de revenir en arrière ou de refaire une vidéo manquante ; « Annuler cette prise » arrête la prise en cours sans rien garder.
- **Candidat qui ne tournera aucune vidéo** : petit bouton « Je refuse de tourner la vidéo » en bas de sa fiche, ou bouton « Aucune vidéo » dans le menu organisateur (suivi des candidats). Son nom passe en bas de liste, marqué « aucune vidéo ». Annulable de la même façon. Le refus est signalé au dashboard (statut seulement) et apparaît dans la colonne « Remarques » de l'Excel de Contrôle-infos.
- **Menu organisateur depuis n'importe quel écran** : 5 touches rapides dans le coin en haut à droite, même pendant une prise (la prise est alors annulée).

- « Passer » permet de sauter une question.
- Si personne ne touche l'écran pendant 10 minutes, la borne revient à l'accueil (une prise en attente de relecture est conservée).
- Nom absent de la liste : le candidat tape son prénom et son nom dans la recherche ; s'il n'y a aucune correspondance, le bouton « Continuer avec ce nom » apparaît juste en dessous (la touche « OK » du clavier fait la même chose). La recherche ignore les accents, les majuscules et l'ordre des mots.
- Les textes des conseils et leur durée se modifient dans `config.js` (`consignes`, `dureeBonjour`, `dureeConsigne`).

## 6 bis. Nouveautés v3 : la pose et l'analyse automatique

- **La pose** (dernière étape, après les questions 1 à 4, 16 s, avec le son) : un mannequin 3D montre cinq gestes, puis le candidat les enchaîne devant la caméra : droit face à l'objectif → profil de trois-quarts → bras croisés → sourire → en montrant l'objectif de l'index, « Le 28 février on vote ! », une courte pause, puis « En attendant, bon film ! » (clip pour la pub au cinéma). Le son de cette phrase est contrôlé comme celui des réponses. Réglable ou désactivable dans `config.js` (`pose`).
- **Aide au cadrage en direct** sur l'écran de préparation : « Rapprochez-vous de la caméra », « Éloignez-vous de la caméra », « Placez-vous au centre », « Cadrage parfait ✔ »…
- **Analyse de chaque prise** (sur l'iPad, sans internet) : cadrage, lumière, volume de la voix, saturation, phrase coupée, sourire. Si un défaut important est détecté, le bouton « Recommencer » est mis en avant. Désactivable : `analyseAuto: false`.
- Fichiers à envoyer sur GitHub en plus : le dossier `vendor` (3D et analyse) et le dossier `models` (modèles de détection du visage).

## 6 ter. Nouveautés v3.2 : contrôle du son et de l'image

Tout tourne sur l'iPad, sans internet.

**Pendant la préparation (écran caméra)** : sous l'image, un vumètre et un message (« Dites quelques mots pour tester le son », « On vous entend mal », « Il y a beaucoup de bruit autour de vous », « Le son est parfait ✔ »). Le nom du micro utilisé s'affiche en dessous.

**Avant chaque prise** : la borne refuse de tourner si le micro est absent, déconnecté ou muet (écran « Problème de micro » avec « Réessayer »). Avec le réglage « Obligatoire », elle refuse aussi de tourner avec le micro de l'iPad.

**Pendant la prise** : vumètre à gauche de l'image ; messages en direct « 🔊 Parlez plus fort », « Un peu moins fort », « ⚠ Le micro s'est coupé », « Revenez face à l'iPad ». Le décompte 3-2-1 sert à mesurer le bruit de fond.

**Après chaque prise**, en plus du cadrage et de la lumière :

| Contrôle | Conséquence |
|---|---|
| Micro coupé ou muet pendant la prise, son trop faible, saturation forte, trop de bruit de fond, coupures répétées, grésillements, premier mot coupé (parole pendant le décompte), fin de phrase coupée, image figée | « Nous vous conseillons de recommencer » |
| Voix un peu faible, saturation passagère, bruit de fond modéré, frottement du micro, long silence, visage trop bas (caché par les sous-titres), haut de la tête coupé, mouvements, tête tournée ou penchée, yeux peu visibles, autre personne dans le champ, reflets, contre-jour | Conseil pour la suite |
| Micro de l'iPad utilisé à la place du micro externe, son « téléphone » (Bluetooth en mode mains libres), bourdonnement électrique 50 Hz, coupures isolées, image moins nette que d'habitude (objectif sale) | Remarque « Pour l'organisateur » |

Dans le menu organisateur, la carte **Micro et contrôle du son** montre le micro utilisé, le niveau en direct et le bruit de fond, permet de choisir le micro et le comportement si le micro externe manque (« Avertir », « Obligatoire » ou « Pas de micro externe »). Un bandeau rouge en bas à gauche de l'écran signale en permanence un micro externe absent ou déconnecté. Dans le suivi des candidats, les prises à refaire sont marquées ⚠.

À savoir sur le Bluetooth : un micro Bluetooth relié directement à l'iPad passe par le profil « mains libres », limité à 16 kHz, donc un son de qualité « téléphone ». Un micro sans fil livré avec un **récepteur à brancher sur le port USB-C (ou Lightning)** de l'iPad donne un son nettement meilleur et plus fiable. La borne signale ce cas (« son de qualité téléphone ») dans le test du son.

Les seuils (niveau, bruit, netteté, regard) sont réglés de manière prudente : à valider lors du premier test sur place, en regardant si les conseils correspondent à ce qu'on voit et entend à la relecture.

## 6 quater. Nouveautés v3.5 : charte, écran de tournage, regard

- **Charte PLR Suisse 2027** : fond cyan (#00A0E2), bleu foncé (#074EA1) pour les cadres, magenta (#E6007D) pour le bouton « C'est parfait », police Jost, logo PLR blanc.
- **Écran de tournage sans retour vidéo** : pendant la prise, l'écran est entièrement blanc (lumière maximale sur le visage). Seul un cadre bleu foncé, placé près de l'objectif, affiche la question (ou le mannequin pour la pose). Le candidat revoit sa vidéo juste après la prise. Le retour vidéo peut être réaffiché dans le menu organisateur (« Retour vidéo pendant la prise »).
- **Luminosité** : une application web ne peut pas régler la luminosité de l'iPad. Avant le shooting : luminosité au maximum (Centre de contrôle), « Luminosité automatique » et « True Tone » désactivés.
- **Trois conseils seulement** après chaque prise : le son (voix assez forte ou non), le regard (vers l'objectif ou non) et le cadrage (distance, centrage, hauteur). Ton calme : la borne « conseille », le candidat décide. Les alertes de matériel (micro coupé, image figée…) sont gardées avec la vidéo et visibles dans le suivi du menu organisateur (icône 🔧).
- **Contrôle du regard** : outil MediaPipe Face Mesh de Google (dossier `vendor/mediapipe`, fonctionne sans internet, chargé une fois puis gardé sur l'iPad). Il repère l'iris ; seuils réglés sur 942 images de 31 candidats (`regard` dans `config.js`). Il suppose l'objectif en haut de l'iPad. Si l'outil ne peut pas se charger, la borne revient à l'ancienne estimation.
- **Cadrage de référence** : menu organisateur › « Cadrage de référence » › « Mémoriser le cadrage actuel » (une personne bien placée). Les candidats sont ensuite guidés vers cette même taille de visage. Désactiver « Cadrage centré » (Center Stage) dans le Centre de contrôle de l'iPad.
- **Retour son** : le son de la vidéo revue est amplifié (menu organisateur › « Volume du retour son », réglé sur « Très fort ») ; mettre aussi le volume de l'iPad au maximum.
- **Micro** : la borne reconnecte toute seule le micro s'il se coupe, devient muet ou vieillit (contrôle toutes les 5 secondes entre deux prises, et avant chaque prise).
- **Pose** : le mannequin est le modèle libre « X Bot » (exemple fourni avec Three.js, fichier `models/mannequin.glb`), un mannequin lisse à squelette humain avec doigts. Il reproduit les gestes de la vidéo de référence : face, trois-quarts, bras croisés, sourire dessiné, phrase finale (« Le 28 février on vote ! », pause, « En attendant, bon film ! ») en restant de trois-quarts, l'index pointé vers l'objectif et l'autre bras toujours croisé.

## 7. Récupérer les vidéos et le rapport (fin de journée)

Les vidéos ne sont **jamais envoyées au site** : le dashboard ne reçoit que des statuts (qui a tourné quoi, qui a refusé). Le menu organisateur propose deux exports **séparés**, car ils ne vont pas au même endroit.

**Carte 1 : exporter toutes les vidéos (feuille de partage).** Les vidéos partent par la feuille de partage de l'iPad, sans passer par les téléchargements de Safari. Elles sont renommées et classées par candidat (`Marie-Dupont_Q1_p2_validee.mp4`).

Limite à connaître : Safari charge en mémoire tous les fichiers d'un même partage ; au-delà de 1 à 2 Go, l'app peut planter. L'envoi de 20 Go ou plus ne peut donc pas tenir dans un seul partage. L'app le découpe en **lots de candidats entiers** (500 Mo, 1 Go ou 2 Go au choix, 1 Go par défaut) et prépare le lot suivant toute seule : un **seul gros bouton** à toucher, qui affiche « Préparer l'export », puis « Partager le lot 3 / 12 », jusqu'à « Tout est exporté ✔ ».

1. Choisir la destination : **AirDrop** (vers le Mac) ou **Disque dur externe** (dans la feuille de partage : « Enregistrer dans Fichiers », puis le disque). Case « Inclure aussi les prises rejetées » cochée par défaut.
2. Toucher le bouton : l'iPad prépare le lot 1, puis le bouton propose « Partager le lot 1 / N ».
3. Dans la feuille de partage : AirDrop puis le Mac (ou Fichiers puis le disque). Un lot n'est marqué « exporté » que si le partage a abouti ; annulé ou échoué, il se refait tel quel.
4. Recommencer jusqu'à « Tout est exporté ✔ ». Garder l'iPad et le Mac déverrouillés, côte à côte, pendant AirDrop.

**Carte 2 : rapport « qui a tourné quoi » (.json).** Un seul rapport remplace l'ancienne liste de contrôle et l'ancien rapport CSV : pour chaque candidat, ses vidéos (Pose, Q1 à Q4 : oui / rejetée), son éventuel refus, et la liste de ses fichiers (nom, taille, durée, somme de contrôle, exporté ou non). Il sert aussi à vérifier le contenu du disque.
- **Synchronisation automatique** : la borne envoie ces informations à Contrôle-infos par le site, après chaque prise. L'état s'affiche dans la carte (bouton « Renvoyer maintenant » pour tout renvoyer).
- **Secours** : « Exporter le rapport (.json) », à envoyer par AirDrop sur l'iPad d'accueil, puis Contrôle-infos › Administration › « Importer le rapport de la borne ».

Dans l'Excel, les colonnes Q1 à Q5 affichent **Oui** (vidéo gardée), **Non** (le candidat est passé à l'accueil mais la vidéo manque : oubli) ou **Refus** (le candidat ne veut pas de vidéo), en rouge pour Non et Refus. Rien n'est écrit dans la colonne Remarques.

**Option principale (en haut de la carte 1) : tout télécharger en une seule fois (ZIP)** (passe par les téléchargements de Safari ; l'envoi par lots décrit plus haut est l'autre option, repliée) : écrit au fil de l'eau, vidéo après vidéo, sans limite de mémoire, avec un dossier par candidat et **sans** rapport. Il exige autant de place libre sur l'iPad que le fichier ; l'iPad affiche la taille exacte attendue, à comparer dans Fichiers avant de confirmer. L'**Essai de transfert** (faux ZIP de 2, 10 ou 25 Go) permet de le tester à l'avance.

Autres boutons : **Supprimer les vidéos déjà exportées** (double touche), **Supprimer les vidéos vides** (n'apparaît que s'il y a des enregistrements ratés) et **Tout effacer (remise à zéro)** (double touche ; un avertissement indique s'il reste des vidéos jamais exportées ; efface aussi les « passés » et « aucune vidéo » mémorisés).

Nom des fichiers : `Marie-Dupont_Q1_p2_validee.mp4` (prénom-nom · étape · numéro de prise · statut). La pose est la **Q5**. Les prises rejetées portent `_rejetee`. Les noms n'ont **jamais** d'accent ni de symbole (lettres, chiffres, tirets, soulignements) : ils s'ouvrent tels quels sous Windows, macOS et Linux.

**Exporter chaque soir.** Ne jamais supprimer l'icône de la borne de l'écran d'accueil avant d'avoir exporté : cela peut effacer les vidéos qu'elle contient.

## 8. Modifier les questions ou les réglages

1. Sur github.com, ouvrir `config.js` dans le dépôt › icône crayon › modifier › **Commit changes**.
2. Attendre 1 à 2 minutes, puis sur l'iPad (connecté à internet) : menu organisateur › **Recharger**. Si l'ancienne version s'affiche encore, recharger une seconde fois.

Réglages utiles dans `config.js` : `duree` de chaque question, `prisesMax`, `compteARebours`, `retourAccueilSecondes`, `codeAdmin`, `traitementAudio` (laisser `false` avec un bon micro), `couleurPrincipale`.

## 9. Qualité : ce qui compte le plus

0. **Cadre centré (Center Stage)** : si l'iPad le propose, le désactiver dans le Centre de contrôle pendant que la caméra est active, pour éviter un zoom automatique sur le visage.

1. **Lumière** : une source douce face au candidat (panneau LED ou boîte à lumière), pas de fenêtre dans le dos.
2. **Son** : micro-cravate branché en USB-C sur l'iPad ; borne à l'écart de la musique du plateau photo.
3. **Cadrage** : iPad sur pied, objectif à hauteur des yeux, 60 à 80 cm du visage, fond sobre.

## 10. Dépannage

| Problème | Solution |
|---|---|
| « La caméra n'est pas disponible » | Vérifier qu'on utilise l'icône (adresse https). Réglages de l'iPad › la borne / Safari › Caméra et Micro › Autoriser. Menu organisateur › Redémarrer la caméra. |
| Vidéo couchée ou au mauvais format | Le mode « Automatique » recadre normalement tout seul. Sinon : menu organisateur › « Recadrage 9:16 forcé ». |
| Écran noir à la relecture, vidéos vides (0 octet) | Menu organisateur › « Calibrer et enregistrer un test de 5 s » : la borne essaie automatiquement d'autres profils d'enregistrement et garde celui qui produit une vidéo lisible. Pendant la journée, elle bascule aussi seule et fait recommencer la réponse. |
| Le partage échoue | Menu organisateur › choisir un envoi plus petit (50, 25 ou 10) et recommencer. |
| Ancienne version affichée | Menu organisateur › Recharger (deux fois si besoin, avec internet). |
| Pas de son | Vérifier la ligne « Micro » dans le test ; débrancher / rebrancher le micro, puis Redémarrer la caméra. |
| Bandeau rouge « Micro de l'iPad utilisé » | Allumer le micro et le reconnecter (Bluetooth de l'iPad ou récepteur branché), puis menu organisateur › « Reconnecter le micro ». La borne se reconnecte aussi seule entre deux prises dès que le micro réapparaît. |
| « Problème de micro » avant une prise | Micro éteint, batterie vide ou trop loin du récepteur. Le rallumer, puis « Réessayer ». En dépannage : « Continuer quand même » (sauf réglage « Obligatoire »). |
| « Son de qualité téléphone » | Le micro est relié en Bluetooth direct (16 kHz). Préférer son récepteur branché sur l'iPad. |
| Conseils de son ou de regard qui ne correspondent pas à la réalité | Le noter et me le signaler : les seuils sont ajustables. En dernier recours : `analyseAuto: false` ou `alertesEnDirect: false` dans `config.js`. |

## 11. Matériel à emporter (checklist)

**Support et cadrage**
- [ ] Pied de sol réglable (jusqu'à ~1,8 m) avec pince pour iPad Pro, objectif à hauteur des yeux
- [ ] Marque au sol (scotch) pour la position du candidat, à 60–80 cm de l'iPad
- [ ] Fond neutre (mur uni, toile ou roll-up) ; jamais de fenêtre dans le dos

**Lumière**
- [ ] 1 panneau LED ou boîte à lumière avec diffuseur, sur pied, à 45° face au candidat (lumière principale)
- [ ] Idéalement un 2e panneau plus faible ou un réflecteur de l'autre côté (déboucher les ombres)
- [ ] Anneau lumineux de la borne activé + luminosité de l'iPad au maximum (appoint)

**Son**
- [ ] Micro-cravate compatible USB-C (sans fil avec récepteur USB-C ou filaire), chargé + bonnette
- [ ] Si le micro est en Bluetooth direct : vérifier au test du son qu'il n'est pas signalé « téléphone » ; prévoir son récepteur filaire ou USB-C s'il en a un
- [ ] Piles ou câble de charge du micro (une journée de 30 à 50 candidats dépasse souvent l'autonomie)
- [ ] Hub USB-C avec charge (Power Delivery) : l'iPad n'a qu'un port, il faut brancher micro ET chargeur en même temps. À tester avant (tous les hubs ne transmettent pas l'audio)
- [ ] Emplacement calme, à l'écart de la musique du plateau photo

**Énergie et câbles**
- [ ] Chargeur USB-C 30 W ou plus + câble long (2–3 m)
- [ ] Rallonge + multiprise
- [ ] Batterie externe USB-C de secours
- [ ] Scotch gaffer pour fixer les câbles au sol

**Signalétique et plan B**
- [ ] Panneau « Borne vidéo — dernière étape » + mode d'emploi en 3 étapes
- [ ] Feuille des questions imprimée (si la borne plante : app Appareil photo + quelqu'un qui lance l'enregistrement)

**Entretien et confort**
- [ ] Chiffon microfibre (objectif et écran, à nettoyer régulièrement)
- [ ] Mouchoirs / poudre anti-brillance, eau

**Organisation**
- [ ] Mac avec AirDrop + environ 15 Go libres par journée + disque externe de sauvegarde
- [ ] Code organisateur noté, liste des candidats du jour

## Revenir à l'ancien mannequin (v3.7)

La version 3.7 du mannequin (bras croisés plus raides) est conservée dans `versions/pose3d-v3.7-xbot.js`. Pour y revenir : remplacer `vendor/pose3d.js` par ce fichier (même contenu, renommé `pose3d.js`), puis changer le numéro de cache dans `sw.js` (`borne-video-v3-8` → un nouveau nom) pour que l'iPad recharge. Sur GitHub, le commit `aad155a` correspond exactement à la v3.7.

## Importer le planning Excel (v3.11)

**Importer le planning** : menu organisateur > carte « Importer le planning (Excel) » > choisir « planning et infos shooting photo.xlsx » (ou un CSV). L'app lit les colonnes Date, Heure, Nom, Prénom et Arrondissement, répartit les candidats dans les journées J1 à J5 (dates dans `config.js`) et les classe par heure d'arrivée. L'heure et l'arrondissement s'affichent sous chaque nom. Les personnes sans date restent trouvables avec la recherche.

**Rapport** : voir le chapitre 7 (carte 2 du menu organisateur, fichier .json, importable dans l'app contrôle des infos).

## Contrôle des exports (v3.12)

Tout en haut du menu organisateur, la carte « Contrôle des exports » indique combien de vidéos gardées n'ont pas encore été exportées, journée par journée. Bordure verte : tout est exporté. Bordure orange : des vidéos ne sont pas encore exportées, n'effacez rien. Pensez aussi au « Rapport de fin de journée ».

## Liaison avec le dashboard PLR Vaud (v3.15)

**Relier la borne (une seule fois)** : dans le dashboard, onglet Shooting > bouton « iPads » > copier le lien « Borne vidéo » et l'ouvrir sur l'iPad. Si la borne est déjà installée sur l'écran d'accueil, coller plutôt la clé dans le menu organisateur > carte « Dashboard » > « Enregistrer la clé » (Safari et l'icône n'ont pas le même stockage).

**Liste du jour** : elle arrive toute seule du dashboard (au démarrage, puis toutes les 3 minutes quand la borne est à l'accueil), dans l'ordre de passage, avec heure et arrondissement. Plus besoin d'importer le planning Excel (l'import reste possible en secours).

**Statut des prises** : chaque prise gardée ou rejetée est signalée au dashboard (colonne 🎬 de l'onglet Shooting). Sans réseau, rien ne se perd : le statut part plus tard.

**Vidéos** : depuis la v4.0, la borne n'envoie plus les vidéos au serveur (liste du jour et statuts seulement). Elles se récupèrent par l'export AirDrop ou disque (point 7).

## Confirmation de la liaison (v3.16)

Menu organisateur > carte « Dashboard » : la ligne d'état commence par « ✔ Borne reliée au dashboard » dès qu'une liste du jour a été reçue. Après avoir collé la clé et touché « Enregistrer la clé », l'app teste aussitôt la connexion et affiche « ✔ Borne reliée au dashboard : liste du jour reçue » ou « ⚠ Connexion impossible : clé refusée ». Le rapport de la borne n'a plus besoin d'être transmis par fichier à l'app contrôle des infos : les prises gardées ou rejetées passent par le dashboard, et l'import du rapport CSV reste possible comme contrôle.
