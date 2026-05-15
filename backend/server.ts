import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
  { id: "LOT-8821", producerId: "PROD-001", producerName: "Koffi Mensah", quantity: 2500, origin: "Kpalimé, Togo", gps: "6.8234° N, 0.6234° E", timestamp: new Date(Date.now() - 172800000).toISOString(), status: 3, photos: ["https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=400"], history: [{ status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 172800000).toISOString(), actor: "Koffi Mensah", hash: "0xabc...def1" }] },
  { id: "LOT-9012", producerId: "PROD-001", producerName: "Koffi Mensah", quantity: 3400, origin: "Centrale, Togo", gps: "8.1234° N, 1.2345° E", timestamp: new Date(Date.now() - 86400000).toISOString(), status: 0, photos: ["https://images.unsplash.com/photo-1559440666-8806282362b7?w=400"], history: [{ status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 86400000).toISOString(), actor: "Koffi Mensah", hash: "0xcf...k1l2" }] },
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

app.get("/api/cacao", (req, res) => res.json(LOTS));

app.post("/api/cacao/add", verifyToken, async (req, res) => {
  const { quantity, origin, gps, photos } = req.body;
  const producer = ACTORS.find(a => a.id === req.user.id);
  if (!producer) return res.status(404).json({ message: "Producteur non trouvé" });
  const newLot = { id: `LOT-${Date.now()}`, producerId: producer.id, producerName: producer.name, quantity, origin, gps, timestamp: new Date().toISOString(), status: 0, photos: photos || [], history: [{ status: 0, label: "Récolte Enregistrée", date: new Date().toISOString(), actor: producer.name, hash: await generateBlockchainHash(`${producer.id}-${origin}-${quantity}`) }] };
  LOTS.push(newLot);
  await recordLotOnBlockchain(newLot.id, origin, "Récolte");
  res.status(201).json(newLot);
});

app.get("/api/cacao/trace/:id", (req, res) => {
  const lot = LOTS.find(l => l.id === req.params.id);
  if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
  res.json(lot);
});

app.post("/api/cacao/transition/:id", verifyToken, async (req, res) => {
  const { newStatus } = req.body;
  const lot = LOTS.find(l => l.id === req.params.id);
  const actor = ACTORS.find(a => a.id === req.user.id);
  if (!lot || !actor) return res.status(404).json({ message: "Lot ou acteur non trouvé" });
  const statusLabels = ["Récolte", "Séchage", "Fermentation", "Transformation", "Expédition"];
  const label = statusLabels[newStatus] || "État Inconnu";
  lot.status = newStatus;
  lot.history.push({ status: newStatus, label, date: new Date().toISOString(), actor: actor.name, hash: await generateBlockchainHash(`${lot.id}-${newStatus}-${Date.now()}`) });
  await updateLotStatusOnBlockchain(lot.id, label);
  res.json(lot);
});

app.get("/api/dashboard", verifyToken, (req, res) => {
  const userLots = LOTS.filter(l => l.producerId === req.user.id);
  res.json({ totalLots: userLots.length, activeLots: userLots.filter(l => l.status < 4).length, completedLots: userLots.filter(l => l.status >= 4).length, totalQuantity: userLots.reduce((sum, l) => sum + l.quantity, 0) });
});

app.get("/api/blockchain/hash", async (req, res) => {
  const data = req.query.data;
  const hash = await generateBlockchainHash(data || "");
  res.json({ data, hash });
});

app.listen(3000, () => console.log("✅ ChainCacao Server on port 3000"));
