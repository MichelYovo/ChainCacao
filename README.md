# 🍫 ChainCacao - Guide Complet du MVP

Ce projet est structuré pour être un MVP (Minimum Viable Product) fonctionnel incluant le Web, le Mobile et la Blockchain.

---

## 🏗️ 1. Clonage et Installation du Projet
Pour récupérer et installer le projet sur votre machine locale :

```bash
# 1. Cloner le dépôt
git clone <votre-url-repo>
cd chain-cacao

# 2. Installer les dépendances globales (Backend & Frontend)
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Ouvrez .env et ajoutez votre PRIVATE_KEY pour la blockchain
```

---

## 📱 2. Lancement du Mobile (Sur votre téléphone)
L'application mobile utilise **Expo**. Voici comment la voir sur votre téléphone réel :

1. **Installer l'app "Expo Go"** sur votre iPhone (App Store) ou Android (Play Store).
2. Dans votre terminal sur PC :
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. **Scanner le QR Code** avec l'application Expo Go (Android) ou l'appareil photo (iOS).
4. *Note : Votre téléphone et votre PC doivent être sur le même réseau Wi-Fi.*

---

## ⛓️ 3. Déploiement de la Blockchain (Réel)
Nous utilisons **Polygon Amoy** pour une blockchain réelle sans frais élevés.

1. **Obtenir des jetons de test** : Allez sur le [Polygon Faucet](https://faucet.polygon.technology/) et demandez des jetons POL pour votre adresse.
2. **Configurer la clé privée** : Ajoutez votre `PRIVATE_KEY` dans le fichier `.env` à la racine.
3. **Déployer** :
   ```bash
   cd blockchain
   npm install
   npm run deploy:amoy
   ```
4. Copiez l'adresse du contrat affichée dans la console pour l'utiliser dans le backend.

---

## 🌐 4. Lancement du Web & API
```bash
# À la racine du projet
npm run dev
```
Accès : `http://localhost:3000`

---

## 📂 Structure du Code
- **/frontend** : Interface Web React (Togo, traçabilité, dashboard).
- **/backend** : API Express gérant la logique et la liaison blockchain.
- **/mobile** : App mobile React Native pour les planteurs sur le terrain.
- **/blockchain** : Contrats intelligents (Solidity) et scripts de déploiement réels.

---

## 🎨 Logo
Le nouveau logo a été intégré. Pour le modifier, remplacez simplement le fichier `frontend/public/logo.png` par votre image finale.

