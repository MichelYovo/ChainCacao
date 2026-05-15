🚀 Guide d'Installation Complet (ChainCacao)
1. Clonage du Projet
code
Bash
git clone <URL_DE_VOTRE_REPO_GITHUB>
cd chain-cacao
2. Installation Globale (Web & API)
code
Bash
# Installation des dépendances à la racine
npm install

# Lancement du site et du serveur
npm run dev
Le site sera alors disponible sur http://localhost:3000.
3. Installation du Mobile (Sur ton téléphone)
Télécharge l'application Expo Go sur ton téléphone.
Dans un nouveau terminal :
code
Bash
cd mobile
npm install
npx expo start
Scanne le QR Code qui s'affiche avec ton téléphone.
4. Déploiement Blockchain (MVP Réel)
Le contrat est prêt à être déployé sur Polygon.
Va dans le dossier blockchain : cd blockchain
Installe les outils : npm install
Ajoute ta clé privée dans le fichier .env à la racine : PRIVATE_KEY=ta_cle_secrete
Déploie le contrat :
code
Bash
npm run deploy:amoy
🖼️ Où mettre le logo ?
Pour que ton logo s'affiche partout :
Place ton image nommée logo.png dans le dossier : /frontend/public/logo.png.
