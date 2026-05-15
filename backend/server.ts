import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { requireRole } from "./src/middleware/roleCheck.ts";
import {
  initBlockchain,
  recordLotOnBlockchain,
  updateLotStatusOnBlockchain,
  generateBlockchainHash,
} from "./src/services/blockchain.ts";

dotenv.config();
await initBlockchain();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "chaincacao_secret_2026";

const ACTORS = [
  { id: "PROD-001", role: "Agriculteur", name: "Koffi Mensah", email: "koffi@farm.tg", password: "password123", color: "#4CAF50", phone: "+228 90 00 01", location: "Kpalimé", zone: "Plateaux" },
  { id: "COOP-011", role: "Coopérative", name: "Collectif Sud", email: "coop@cacao.tg", password: "password123", color: "#8D6E63", phone: "+228 91 00 02", location: "Atakpamé" },
  { id: "TRANS-77", role: "Transporteur", name: "Togo Logistique", email: "trans@cargo.tg", password: "password123", color: "#FF9800", phone: "+228 92 00 03", location: "Lomé" },
  { id: "FACTORY-42", role: "Transformateur", name: "Usine Chocolat Premium", email: "factory@choco.tg", password: "password123", color: "#795548", phone: "+228 93 00 04", location: "Port-Autonome" },
  { id: "EXPORT-55", role: "Exportateur", name: "ChainCacao Export", email: "export@cacao.tg", password: "password123", color: "#2196F3", phone: "+228 94 00 05", location: "Port-Autonome" },
  { id: "BUYER-88", role: "Acheteur", name: "Nestlé Togo", email: "buyer@nestle.tg", password: "password123", color: "#E91E63", phone: "+228 95 00 06", location: "Accra" },
  { id: "MIN-99", role: "Ministère", name: "Ministère Commerce", email: "ministry@gov.tg", password: "password123", color: "#009688", phone: "+228 96 00 07", location: "Lomé" },
  { id: "ADMIN-00", role: "Admin", name: "Admin ChainCacao", email: "admin@chaincacao.tg", password: "password123", color: "#000000", phone: "+228 97 00 08", location: "Lomé" },
];

let LOTS = [
  { id: "LOT-8821", producerId: "PROD-001", producerName: "Koffi Mensah", quantity: 2500, origin: "Kpalimé, Togo", gps: "6.8234° N, 0.6234° E", timestamp: new Date(Date.now() - 172800000).toISOString(), status: 1, receivedBy: null, certifiedBy: null, transformedBy: null, exportedBy: null, photos: ["https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400"], history: [{ status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 172800000).toISOString(), actor: "Koffi Mensah", hash: "0xabc...def1" }, { status: 1, label: "Reçu par Coopérative", date: new Date(Date.now() - 86400000).toISOString(), actor: "Collectif Sud", hash: "0xdef...ghi2" }] },
  { id: "LOT-9012", producerId: "PROD-001", producerName: "Koffi Mensah", quantity: 3400, origin: "Centrale, Togo", gps: "8.1234° N, 1.2345° E", timestamp: new Date(Date.now() - 86400000).toISOString(), status: 0, receivedBy: null, certifiedBy: null, transformedBy: null, exportedBy: null, photos: ["https://images.unsplash.com/photo-1559440666-8806282362b7?w=400"], history: [{ status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 86400000).toISOString(), actor: "Koffi Mensah", hash: "0xcf...k1l2" }] },
];

export const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

function verifyToken(req: any, res: any, next: any) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token manquant" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch (error) { res.status(403).json({ message: "Token invalide" }); }
}

// AUTH ROUTES
app.post("/api/auth/login", (req, res) => {
  const { email, identifier, password } = req.body;
  const cleanEmail = String(email || identifier || "").trim();
  if (!cleanEmail || !password) return res.status(400).json({ message: "Email et mot de passe requis" });
  const user = ACTORS.find(u => u.email === cleanEmail && u.password === password);
  if (!user) return res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color } });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, name, role } = req.body;
  if (ACTORS.find(u => u.email === email)) return res.status(409).json({ message: "Email déjà enregistré" });
  const newUser = { id: `USER-${Date.now()}`, email, password, name, role: role || "Utilisateur", color: "#" + Math.floor(Math.random() * 16777215).toString(16), phone: "", location: "", zone: "" };
  ACTORS.push(newUser);
  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: newUser });
});

app.get("/api/auth/me", verifyToken, (req, res) => {
  const user = ACTORS.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, color: user.color });
});

// PUBLIC LOT ROUTES
app.get("/api/cacao", (req, res) => res.json(LOTS));

app.get("/api/cacao/trace/:id", (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  res.json(lot);
});

// AGRICULTEUR ROUTES - Add lots
app.post("/api/cacao/add", verifyToken, requireRole("Agriculteur"), async (req, res) => {
  const { quantity, origin, gps, photos } = req.body;
  const producer = ACTORS.find(a => a.id === req.user.id);
  if (!producer) return res.status(404).json({ message: "Producteur non trouvé" });
  const newLot = { 
    id: `LOT-${Date.now()}`, 
    producerId: producer.id, 
    producerName: producer.name, 
    quantity, 
    origin, 
    gps, 
    timestamp: new Date().toISOString(), 
    status: 0, 
    receivedBy: null,
    certifiedBy: null,
    transformedBy: null,
    exportedBy: null,
    photos: photos || [], 
    history: [{ status: 0, label: "Récolte Enregistrée", date: new Date().toISOString(), actor: producer.name, hash: await generateBlockchainHash(`${producer.id}-${origin}-${quantity}`) }] 
  };
  LOTS.push(newLot);
  await recordLotOnBlockchain(newLot.id, origin, "Récolte");
  res.status(201).json(newLot);
});

app.get("/api/cacao/my-lots", verifyToken, requireRole("Agriculteur"), (req, res) => {
  const userLots = LOTS.filter(l => l.producerId === req.user.id);
  res.json(userLots);
});

// COOPÉRATIVE ROUTES - Receive and certify lots
app.post("/api/cacao/receive/:id", verifyToken, requireRole("Coopérative"), async (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  if (lot.status !== 0) return res.status(400).json({ message: "Seuls les lots en récolte peuvent être reçus" });
  
  const actor = ACTORS.find(a => a.id === req.user.id);
  lot.status = 1;
  lot.receivedBy = actor.id;
  lot.history.push({ 
    status: 1, 
    label: "Reçu par Coopérative", 
    date: new Date().toISOString(), 
    actor: actor.name, 
    hash: await generateBlockchainHash(`${lot.id}-received-${Date.now()}`) 
  });
  await updateLotStatusOnBlockchain(lot.id, "Reçu");
  res.json(lot);
});

app.post("/api/cacao/certify/:id", verifyToken, requireRole("Coopérative"), async (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  if (lot.status !== 1) return res.status(400).json({ message: "Le lot doit d'abord être reçu" });
  
  const actor = ACTORS.find(a => a.id === req.user.id);
  lot.status = 2;
  lot.certifiedBy = actor.id;
  lot.history.push({ 
    status: 2, 
    label: "Certifié - Qualité Validée", 
    date: new Date().toISOString(), 
    actor: actor.name, 
    hash: await generateBlockchainHash(`${lot.id}-certified-${Date.now()}`) 
  });
  await updateLotStatusOnBlockchain(lot.id, "Certifié");
  res.json(lot);
});

app.get("/api/cacao/received-lots", verifyToken, requireRole("Coopérative"), (req, res) => {
  const receivedLots = LOTS.filter(l => l.status >= 1 && l.status <= 2);
  res.json(receivedLots);
});

// TRANSPORTEUR ROUTES - Update transport status
app.post("/api/cacao/transport/:id", verifyToken, requireRole("Transporteur"), async (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  if (lot.status < 2) return res.status(400).json({ message: "Le lot doit d'abord être certifié" });
  
  const actor = ACTORS.find(a => a.id === req.user.id);
  lot.status = 3;
  lot.history.push({ 
    status: 3, 
    label: "En Transport", 
    date: new Date().toISOString(), 
    actor: actor.name, 
    hash: await generateBlockchainHash(`${lot.id}-transport-${Date.now()}`) 
  });
  await updateLotStatusOnBlockchain(lot.id, "En Transport");
  res.json(lot);
});

app.get("/api/cacao/transport-lots", verifyToken, requireRole("Transporteur"), (req, res) => {
  const transportLots = LOTS.filter(l => l.status >= 2 && l.status < 4);
  res.json(transportLots);
});

// TRANSFORMATEUR ROUTES - Transform lots
app.post("/api/cacao/transform/:id", verifyToken, requireRole("Transformateur"), async (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  if (lot.status !== 3) return res.status(400).json({ message: "Le lot doit être en transport" });
  
  const actor = ACTORS.find(a => a.id === req.user.id);
  lot.status = 4;
  lot.transformedBy = actor.id;
  lot.history.push({ 
    status: 4, 
    label: "Transformé en Chocolat", 
    date: new Date().toISOString(), 
    actor: actor.name, 
    hash: await generateBlockchainHash(`${lot.id}-transform-${Date.now()}`) 
  });
  await updateLotStatusOnBlockchain(lot.id, "Transformé");
  res.json(lot);
});

app.get("/api/cacao/transform-lots", verifyToken, requireRole("Transformateur"), (req, res) => {
  const transformLots = LOTS.filter(l => l.status >= 3 && l.status < 5);
  res.json(transformLots);
});

// EXPORTATEUR ROUTES - Export lots
app.post("/api/cacao/export/:id", verifyToken, requireRole("Exportateur"), async (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  if (lot.status !== 4) return res.status(400).json({ message: "Le lot doit d'abord être transformé" });
  
  const actor = ACTORS.find(a => a.id === req.user.id);
  lot.status = 5;
  lot.exportedBy = actor.id;
  lot.history.push({ 
    status: 5, 
    label: "Exporté", 
    date: new Date().toISOString(), 
    actor: actor.name, 
    hash: await generateBlockchainHash(`${lot.id}-export-${Date.now()}`) 
  });
  await updateLotStatusOnBlockchain(lot.id, "Exporté");
  res.json(lot);
});

app.get("/api/cacao/export-lots", verifyToken, requireRole("Exportateur"), (req, res) => {
  const exportLots = LOTS.filter(l => l.status >= 4);
  res.json(exportLots);
});

// ACHETEUR ROUTES - Search and verify
app.get("/api/cacao/search", verifyToken, requireRole("Acheteur"), (req, res) => {
  const { origin } = req.query;
  let results = LOTS.filter(l => l.status >= 5);
  if (origin) {
    results = results.filter(l => l.origin.toLowerCase().includes(String(origin).toLowerCase()));
  }
  res.json(results);
});

app.get("/api/cacao/verify/:id", verifyToken, requireRole("Acheteur"), (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  res.json(lot);
});

// MINISTÈRE ROUTES - View statistics
app.get("/api/reports", verifyToken, requireRole("Ministère"), (req, res) => {
  const stats = {
    totalLots: LOTS.length,
    totalQuantity: LOTS.reduce((sum, l) => sum + l.quantity, 0),
    lotsByStatus: {
      recorded: LOTS.filter(l => l.status === 0).length,
      received: LOTS.filter(l => l.status === 1).length,
      certified: LOTS.filter(l => l.status === 2).length,
      inTransport: LOTS.filter(l => l.status === 3).length,
      transformed: LOTS.filter(l => l.status === 4).length,
      exported: LOTS.filter(l => l.status === 5).length,
    },
    actorStats: {
      farmers: ACTORS.filter(a => a.role === "Agriculteur").length,
      cooperatives: ACTORS.filter(a => a.role === "Coopérative").length,
      transporters: ACTORS.filter(a => a.role === "Transporteur").length,
      factories: ACTORS.filter(a => a.role === "Transformateur").length,
      exporters: ACTORS.filter(a => a.role === "Exportateur").length,
    },
    allLots: LOTS
  };
  res.json(stats);
});

// ADMIN ROUTES - Full control
app.get("/api/admin/users", verifyToken, requireRole("Admin"), (req, res) => {
  res.json(ACTORS);
});

app.post("/api/admin/users/create", verifyToken, requireRole("Admin"), (req, res) => {
  const { email, password, name, role } = req.body;
  if (ACTORS.find(u => u.email === email)) return res.status(409).json({ message: "Email déjà enregistré" });
  const newUser = { id: `USER-${Date.now()}`, email, password, name, role, color: "#" + Math.floor(Math.random() * 16777215).toString(16), phone: "", location: "", zone: "" };
  ACTORS.push(newUser);
  res.status(201).json(newUser);
});

app.get("/api/admin/stats", verifyToken, requireRole("Admin"), (req, res) => {
  res.json({
    totalUsers: ACTORS.length,
    totalLots: LOTS.length,
    totalQuantity: LOTS.reduce((sum, l) => sum + l.quantity, 0),
    actors: ACTORS,
    lots: LOTS
  });
});

// DASHBOARD - Role-specific dashboard
app.get("/api/dashboard/init", verifyToken, async (req, res) => {
  const user = ACTORS.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  let relevantLots: any[] = [];
  let stats: any = {};

  if (user.role === "Agriculteur") {
    relevantLots = LOTS.filter(l => l.producerId === req.user.id);
    stats = {
      totalLots: relevantLots.length,
      activeLots: relevantLots.filter(l => l.status < 5).length,
      completedLots: relevantLots.filter(l => l.status >= 5).length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Coopérative") {
    relevantLots = LOTS.filter(l => l.status >= 1 && l.status <= 2);
    stats = {
      totalLots: relevantLots.length,
      certifiedLots: relevantLots.filter(l => l.status === 2).length,
      pendingCertification: relevantLots.filter(l => l.status === 1).length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Transporteur") {
    relevantLots = LOTS.filter(l => l.status >= 2 && l.status < 4);
    stats = {
      totalLots: relevantLots.length,
      inTransport: relevantLots.filter(l => l.status === 3).length,
      readyForTransport: relevantLots.filter(l => l.status === 2).length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Transformateur") {
    relevantLots = LOTS.filter(l => l.status >= 3 && l.status < 5);
    stats = {
      totalLots: relevantLots.length,
      readyToTransform: relevantLots.filter(l => l.status === 3).length,
      transformed: relevantLots.filter(l => l.status === 4).length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Exportateur") {
    relevantLots = LOTS.filter(l => l.status >= 4);
    stats = {
      totalLots: relevantLots.length,
      readyToExport: relevantLots.filter(l => l.status === 4).length,
      exported: relevantLots.filter(l => l.status === 5).length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Acheteur") {
    relevantLots = LOTS.filter(l => l.status === 5);
    stats = {
      totalLots: relevantLots.length,
      availableLots: relevantLots.length,
      totalQuantity: relevantLots.reduce((sum, l) => sum + l.quantity, 0)
    };
  } else if (user.role === "Ministère") {
    relevantLots = LOTS;
    stats = {
      totalLots: LOTS.length,
      totalQuantity: LOTS.reduce((sum, l) => sum + l.quantity, 0),
      byStatus: {
        recorded: LOTS.filter(l => l.status === 0).length,
        received: LOTS.filter(l => l.status === 1).length,
        certified: LOTS.filter(l => l.status === 2).length,
        inTransport: LOTS.filter(l => l.status === 3).length,
        transformed: LOTS.filter(l => l.status === 4).length,
        exported: LOTS.filter(l => l.status === 5).length,
      }
    };
  } else if (user.role === "Admin") {
    relevantLots = LOTS;
    stats = {
      totalLots: LOTS.length,
      totalUsers: ACTORS.length,
      totalQuantity: LOTS.reduce((sum, l) => sum + l.quantity, 0)
    };
  }

  res.json({
    stats,
    lots: relevantLots,
    notifications: [],
    users: user.role === "Admin" ? ACTORS : undefined
  });
});

// TRANSITION (generic endpoint)
app.post("/api/cacao/transition/:id", verifyToken, async (req, res) => {
  const { newStatus } = req.body;
  const lot = LOTS.find(l => l.id === req.params.id);
  const actor = ACTORS.find(a => a.id === req.user.id);
  if (!lot || !actor) return res.status(404).json({ message: "Lot ou acteur non trouvé" });
  const statusLabels = ["Récolte", "Reçu", "Certifié", "En Transport", "Transformé", "Exporté"];
  const label = statusLabels[newStatus] || "État Inconnu";
  lot.status = newStatus;
  lot.history.push({ status: newStatus, label, date: new Date().toISOString(), actor: actor.name, hash: await generateBlockchainHash(`${lot.id}-${newStatus}-${Date.now()}`) });
  await updateLotStatusOnBlockchain(lot.id, label);
  res.json(lot);
});

app.get("/api/blockchain/hash", async (req, res) => {
  const data = req.query.data;
  const hash = await generateBlockchainHash(data || "");
  res.json({ data, hash });
});

app.listen(3000, () => console.log("✅ ChainCacao Server on port 3000"));
