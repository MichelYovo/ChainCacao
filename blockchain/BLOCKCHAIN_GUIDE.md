# 🚀 Guide Complet: ChainCacao - Blockchain + Backend Mobile

## 📝 TABLE DES MATIÈRES

1. [Type d'application](#type-dapplication)
2. [Architecture Blockchain intégrée](#architecture-blockchain-intégrée)
3. [Modules installés](#modules-installés)
4. [Démarrage du serveur](#démarrage-du-serveur)
5. [API Endpoints](#api-endpoints)
6. [Comment connecter une app Mobile](#comment-connecter-une-app-mobile)
7. [Déployer le Smart Contract](#déployer-le-smart-contract)

---

## Type d'Application

**ChainCacao est une APPLICATION WEB FULLSTACK avec blockchain:**

- ✅ Frontend: React 19 + TypeScript + Vite
- ✅ Backend: Express.js (Node.js)
- ✅ Blockchain: Polygon Mumbai Testnet (prêt)
- ✅ Déploiement: Vercel
- ✅ Prêt pour: Mobile (Flutter, React Native, iOS, Android)

---

## Architecture Blockchain Intégrée

### Composants ajoutés:

1. **Smart Contract (CacaoTrace.sol)**
   - Enregistrement immuable des lots
   - Historique des transitions de status
   - Vérification de l'intégrité

2. **Service Blockchain (src/services/blockchain.ts)**
   - Connexion à Polygon Mumbai
   - Fonctions d'enregistrement de lot
   - Génération de vrais hash blockchain
   - Mode simulation (sans clé privée)

3. **Backend API Endpoints**
   - POST `/api/blockchain/record-lot` - Enregistre un lot
   - POST `/api/blockchain/update-status/:lotId` - Met à jour le status
   - GET `/api/blockchain/verify/:lotId` - Vérifie l'intégrité
   - GET `/api/blockchain/status` - État du blockchain

### Mode de fonctionnement:

**Mode Simulation (actuel):**

- Génère des vrais hash blockchain avec ethers.js
- Les données sont toujours enregistrées en base de données
- Prêt pour upgrade vers blockchain réelle

**Mode Blockchain (après déploiement du smart contract):**

- Chaque enregistrement crée une transaction réelle
- Les données sont immuables sur Polygon
- Coûts de gas minimaux (testnet = gratuit)

---

## Modules Installés

### 🔗 Blockchain & Web3:

```
ethers@^6.10.0           - Bibliothèque Web3 pour Ethereum/Polygon
wagmi@^2.5.8            - État management Web3
@rainbow-me/rainbowkit  - Wallet connection UI (MetaMask, WalletConnect, etc)
```

### 📦 Frontend:

```
react@^19.0.1           - UI Framework
react-router-dom@^7.14.2 - Routage
tailwindcss@^4.1.14     - Styling
lucide-react            - Icons
motion@^12.23.24        - Animations
qrcode.react            - Génération QR codes
```

### 🛠️ Backend:

```
express@^4.21.2         - API Server
cors@^2.8.6             - Cross-Origin Requests (pour mobile)
jsonwebtoken@^9.0.3     - JWT Authentication
bcryptjs@^3.0.3         - Password hashing
dotenv@^17.2.3          - Variables d'environnement
```

### 📚 Dev Tools:

```
typescript@~5.8.2       - Type safety
vite@^6.2.3             - Build tool
tsx@^4.21.0             - Run TypeScript files
```

---

## 🎯 Démarrage du Serveur

### Commandes:

```bash
# 1. Installation des dépendances (déjà fait ✅)
npm install

# 2. Lancer le serveur de développement
npm run dev

# 3. Build pour production
npm run build

# 4. Lancer preview production
npm run preview

# 5. Lancer production localement
npm start
```

### Output attendu:

```
⚠️  BLOCKCHAIN_PRIVATE_KEY non défini - Mode simulation
✅ ChainCacao Server running on port 3000
```

### Accès:

- **Web UI**: http://localhost:3000
- **API Base**: http://localhost:3000/api

---

## 📡 API Endpoints

### Authentification

```
POST /api/auth/login
Body: { identifier: "email ou ID", password: "password" }
Response: { token: "JWT_TOKEN", user: {...} }

GET /api/auth/me (avec Authorization header)
Response: { id, email, role, name, color }
```

### Gestion des Lots

```
GET /api/cacao/all
Response: [{ id, quantity, origin, gps, status, history, ... }]

GET /api/cacao/trace/:id
Response: { lot avec historique complet }

POST /api/cacao/add
Body: { quantity, origin, gps, photos[] }
Response: { nouvau lot créé + enregistré blockchain }

POST /api/cacao/transition/:id
Body: { status, label, nextRole }
Response: { lot avec nouveau status + blockchain update }
```

### Blockchain (NOUVEAU)

```
POST /api/blockchain/record-lot
Body: { lotId, quantity, origin, gps }
Response: { success, transactionHash, blockNumber }

POST /api/blockchain/update-status/:lotId
Body: { newStatus, label }
Response: { success, transactionHash }

GET /api/blockchain/verify/:lotId
Response: { lotId, integrity, hashChain, blockchainStatus }

GET /api/blockchain/status
Response: { blockchainConnected, network, mode, features }
```

### Statistiques & Notifications

```
GET /api/dashboard/init
Response: { stats, notifications, lots, users }

GET /api/notifications
Response: [ notifications[] ]

POST /api/notifications/read
Response: { success: true }
```

---

## 📱 Comment Connecter une App Mobile

### 1️⃣ Architecture Client-Serveur

```
[Mobile App] --HTTP/HTTPS--> [ChainCacao Backend] --RPC--> [Polygon Blockchain]
 - React Native        Port 3000 (local) or       Testnet
 - Flutter             Production URL
 - Native iOS/Android
```

### 2️⃣ Backend URL Configuration

**En développement (local):**

```
const API_URL = "http://192.168.x.x:3000/api"  // IP de votre machine
const API_URL = "http://localhost:3000/api"     // Si app sur même réseau
```

**En production:**

```
const API_URL = "https://your-domain.com/api"   // Après déploiement
```

### 3️⃣ Exemple de connexion (React Native)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.100:3000/api",
  timeout: 5000,
});

// Ajouter le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
async function login(email, password) {
  const response = await api.post("/auth/login", {
    identifier: email,
    password,
  });
  localStorage.setItem("token", response.data.token);
  return response.data.user;
}

// Ajouter un lot
async function addLot(quantity, origin, gps, photos) {
  return api.post("/cacao/add", { quantity, origin, gps, photos });
}
```

### 4️⃣ Exemple de connexion (Flutter)

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class CacaoAPI {
  final String baseUrl = 'http://192.168.1.100:3000/api';
  String? token;

  Future<void> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'identifier': email,
        'password': password,
      }),
    );

    if (response.statusCode == 200) {
      token = jsonDecode(response.body)['token'];
    }
  }

  Future<void> addLot(int quantity, String origin, String gps) async {
    final response = await http.post(
      Uri.parse('$baseUrl/cacao/add'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'quantity': quantity,
        'origin': origin,
        'gps': gps,
        'photos': [],
      }),
    );

    if (response.statusCode == 201) {
      print('Lot créé: ${response.body}');
    }
  }
}
```

### 5️⃣ CORS (déjà configuré)

Le backend accepte les requêtes mobiles:

```javascript
app.use(cors()); // ✅ Activé
```

---

## 🔐 Déployer le Smart Contract

### Step 1: Préparer votre portefeuille

1. **Créer un portefeuille Ethereum** (MetaMask)
   - Installer MetaMask extension
   - Créer un nouveau portefeuille
   - Sauvegarder la seed phrase

2. **Ajouter le réseau Polygon Mumbai**
   - Settings → Networks → Add Network
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://rpc-mumbai.maticvigil.com`
   - Chain ID: `80001`
   - Currency: `MATIC`

3. **Obtenir des MATIC de test**
   - Visiter: https://faucet.polygon.technology/
   - Remplir avec votre adresse
   - Recevoir 0.5 MATIC (gratuit)

### Step 2: Déployer le Smart Contract

Option 1: **Remix IDE** (simple, pas de code)

```
1. Aller à: https://remix.ethereum.org
2. Créer nouveau fichier: CacaoTrace.sol
3. Copier le contenu du fichier CacaoTrace.sol
4. Compiler (Ctrl+S)
5. Deploy sur Mumbai testnet
6. Copier l'adresse du contract
```

Option 2: **Hardhat** (production)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
# Configurer hardhat.config.js avec Polygon Mumbai
npx hardhat run scripts/deploy.js --network mumbai
```

### Step 3: Configurer votre .env.local

Après déploiement:

```env
POLYGON_RPC_URL=https://rpc-mumbai.maticvigil.com
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=0x...deployed_contract_address...
```

### Step 4: Vérifier le déploiement

```bash
# Vérifier l'endpoint blockchain
curl http://localhost:3000/api/blockchain/status

# Response:
{
  "blockchainConnected": true,
  "network": "Polygon Mumbai Testnet",
  "mode": "Production",
  "features": {
    "Enregistrement immuable": "✅",
    "Hash vérification": "✅",
    "Historique blockchain": "✅"
  }
}
```

---

## 🔗 Ressources Utiles

- **Polygon Testnet Faucet**: https://faucet.polygon.technology/
- **PolygonScan**: https://mumbai.polygonscan.com/ (explorer)
- **Ethers.js Docs**: https://docs.ethers.org/
- **Remix IDE**: https://remix.ethereum.org

---

## ✅ Checklist de Déploiement Production

- [ ] Déployer Smart Contract sur Polygon Mumbai
- [ ] Configurer .env.local avec CONTRACT_ADDRESS et PRIVATE_KEY
- [ ] Tester les endpoints blockchain localement
- [ ] Build le frontend: `npm run build`
- [ ] Déployer sur Vercel/Netlify
- [ ] Mettre à jour API_URL en production
- [ ] Tester avec mobile app en production

---

## 📞 Support

**Erreur courante 1**: "BLOCKCHAIN_PRIVATE_KEY non défini"

- ✅ Normal! Mode simulation actif
- Remplir .env.local pour mode blockchain réel

**Erreur courante 2**: Mobile ne peut pas accéder au serveur local

- Utiliser IP locale: `http://192.168.x.x:3000`
- Pas de `localhost` depuis le téléphone!

**Erreur courante 3**: CORS error

- ✅ Déjà configuré (cors middleware actif)

---

**Créé avec ❤️ pour le Hackathon - ChainCacao 2026**
