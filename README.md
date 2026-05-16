# 🍫 ChainCacao - MVP Full-Stack & Blockchain

Bienvenue dans le dépôt officiel de **ChainCacao**, le protocole de traçabilité du cacao togolais. Ce projet contient le Web (Frontend), l'API (Backend), l'Application Mobile (Expo) et les Contrats Intelligents (Polygon).

---

## 🚀 Guide de Clonage Rapide (GitHub)

Pour installer le projet proprement sur votre machine :

```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/chain-cacao.git
cd chain-cacao

# 2. Installer les dépendances globales
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env
# ÉDITEZ le fichier .env et ajoutez votre PRIVATE_KEY (MetaMask)
```

---

## ⛓️ 1. Blockchain (Réseau Réel Polygon Amoy)

Nous n'utilisons plus de simulation. Le contrat est prêt pour le réseau de test **Amoy**.

1. **Obtenir des POL de test** : Allez sur le [Faucet Polygon](https://faucet.polygon.technology/).
2. **Déployer le contrat** :
   ```bash
   cd blockchain
   npm install
   npm run deploy:amoy
   ```
3. Copiez l'adresse affichée et collez-la dans votre `.env` à la racine : `CONTRACT_ADDRESS=0x...`

---

## 📱 2. Mobile (Installer sur votre Téléphone)

L'application mobile utilise **Expo Go** pour être testée instantanément sans câbles.

1. **Sur votre téléphone** : Téléchargez l'application **Expo Go** (App Store ou Play Store).
2. **Sur votre PC** :
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. **Connecter** : Scannez le QR Code qui s'affiche dans votre terminal avec l'application Expo Go (Android) ou l'appareil photo (iOS).
   *Important : Votre téléphone et votre PC doivent être sur le même Wi-Fi.*

---

## 🌐 3. Web & API (Lancement local)

Pour lancer le site web et le backend simultanément :

```bash
# À la racine du projet
npm run dev
```
Accès local : `http://localhost:3000`

---

## 📂 Organisation des Dossiers
- `/backend` : API Express + Liaison Blockchain (Ethers.js).
- `/frontend` : Interface Web React (Traçabilité, Dashboards).
- `/mobile` : Application React Native pour le terrain (Planteurs/Transport).
- `/blockchain` : Smart Contracts Solidity (Polygon Amoy).

---

## 🎨 Logo
L'image du logo doit être placée dans le dossier :
`frontend/public/logo.png`
Le site l'affichera automatiquement en haut à gauche.

