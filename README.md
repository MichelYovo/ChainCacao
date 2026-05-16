# 🍫 ChainCacao - MVP Full-Stack & Blockchain

Bienvenue dans le dépôt officiel de **ChainCacao**, le protocole de traçabilité du cacao togolais. Ce projet est un MVP complet incluant Web, API, Mobile et Smart Contracts.

---

## 🚀 Guide de Clonage et Installation (PC Local)

Pour installer le projet proprement sur votre machine :

### 1. Clonage et Dépendances
```bash
# 1. Cloner le repo
git clone https://github.com/votre-username/chain-cacao.git
cd chain-cacao

# 2. Installer les dépendances (tout est géré à la racine)
npm install
```

### 2. Configuration (.env)
Copiez le fichier d'exemple et configurez vos clés :
```bash
cp .env.example .env
```
Éditez le fichier `.env` :
- `PRIVATE_KEY` : Allez sur **MetaMask** > Détails du compte > **Exporter la clé privée**. (Ne partagez jamais cette clé !).
- `JWT_SECRET` : Tapez n'importe quelle phrase longue et complexe (ex: `ma_super_cle_secrete_2026_chaincacao`).
- `CONTRACT_ADDRESS` : Laissez vide jusqu'au déploiement de la blockchain.

---

## 🛠️ Utilisation et Commandes

### 🌐 Lancer le Web + API (Simultané)
**Important :** Vous ne devez ouvrir qu'UN SEUL terminal à la racine pour cette commande.
```bash
# À la racine du projet
npm run dev
```
Accès local : [http://localhost:3000](http://localhost:3000) (N'utilisez pas l'adresse 0.0.0.0)

### ⚠️ Erreur "Port 3000 is already in use" ?
Si vous voyez cette erreur :
- Sur Windows : 
  1. Ouvrez `PowerShell` en tant qu'administrateur.
  2. Tapez : `Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force`
- Ou redémarrez simplement votre PC.

### ⚠️ Erreur "Failed to load url /src/main.tsx" ?
Cela arrive si vous lancez la commande dans le mauvais dossier.
- Assurez-vous d'être à la **RACINE** du projet (dossier `ChainCacao`).
- Le terminal doit afficher `PS C:\...\ChainCacao>`.
- Tapez `npm run dev`.

---

## ⛓️ 1. Blockchain (Polygon Amoy Testnet)
Les contrats sont dans `/blockchain`.
```bash
cd blockchain
npm install
npm run deploy:amoy
```
Une fois déployé, copiez l'adresse du contrat dans votre `.env` à la racine : `CONTRACT_ADDRESS=0x...`

---

## 📱 2. Mobile (Expo Go)
Testez l'application directement sur votre téléphone :
1. Installez l'app **Expo Go** sur votre téléphone.
2. Sur PC :
   ```bash
   cd mobile
   npm install
   npx expo start
   ```
3. Scannez le QR Code avec Expo Go. (PC et Téléphone doivent être sur le même Wi-Fi).

---

## 📂 Architecture du Projet
- `/backend` : API Express + Liaison Blockchain.
- `/frontend` : Interface React (gérée comme middleware par le backend).
- `/mobile` : Appli React Native (Expo).
- `/blockchain` : Smart Contracts Solidity.
- `/dist` : Dossier généré après `npm run build`.

---

## 🎨 Personnalisation du Logo
Remplacez simplement le fichier suivant par votre propre logo :
`frontend/public/logo.png`
Le site se mettra à jour automatiquement.

