import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'chaincacao_secret_2026';

// --- MOCK DATA & ACTORS ---
let ACTORS = [
  { id: "PROD-001", role: "Agriculteur", name: "Koffi Mensah", email: "koffi@farm.tg", password: "password123", color: "#4CAF50", phone: "+228 90 00 01", location: "Kpalimé", zone: "Plateaux" },
  { id: "COOP-011", role: "Coopérative", name: "Collectif Sud", email: "coop@cacao.tg", password: "password123", color: "#8D6E63", phone: "+228 91 00 02", location: "Atakpamé" },
  { id: "TRANS-77", role: "Transporteur", name: "Togo Logistique", email: "trans@cargo.tg", password: "password123", color: "#FF9800", phone: "+228 92 00 03" },
  { id: "EXP-500", role: "Exportateur", name: "Togo Export", email: "export@cargo.tg", password: "password123", color: "#DAA520", phone: "+228 93 00 04" },
  { id: "BUY-EU-01", role: "Acheteur EU", name: "BioChoc Europe", email: "buyer@biochoc.eu", password: "password123", color: "#2196F3", phone: "+32 2 00 01", location: "Anvers, Belgique" },
  { id: "MIN-AGRIC-01", role: "Ministère", name: "Direction Agriculture", email: "contact@agriculture.gouv.tg", password: "password123", color: "#1a3a3a", phone: "+228 22 21 00" },
  { id: "ADMIN-01", role: "Administrateur", name: "Super Administrateur", email: "admin@chaincacao.tg", password: "admin", color: "#333333" }
];

// Lot Status: 0: Récolté, 1: Certifié, 2: En Transit, 3: Reçu par Exportateur, 4: Reçu par Acheteur EU
let lotHistory = [
  {
    id: "LOT-8821",
    producerId: "PROD-001",
    producerName: "Koffi Mensah",
    quantity: 1250,
    origin: "Plateaux, Togo",
    gps: "6.9103° N, 0.6385° E",
    timestamp: new Date(Date.now() - 604800000).toISOString(),
    status: 4, 
    photos: ["https://images.unsplash.com/photo-1542662565-7e4b66bae529?w=400"],
    history: [
      { status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 604800000).toISOString(), actor: "Koffi Mensah", hash: "0x7f...a1b2" },
      { status: 1, label: "Certifié par Coopérative", date: new Date(Date.now() - 518400000).toISOString(), actor: "Collectif Sud", hash: "0x8f...c3d4" },
      { status: 2, label: "En Transit Logistique", date: new Date(Date.now() - 432000000).toISOString(), actor: "Togo Logistique", hash: "0x9f...e5f6" },
      { status: 3, label: "Reçu par l'Exportateur", date: new Date(Date.now() - 345600000).toISOString(), actor: "Togo Export", hash: "0xaf...g7h8" },
      { status: 4, label: "Livraison Confirmée EU", date: new Date(Date.now() - 259200000).toISOString(), actor: "BioChoc Europe", hash: "0xbf...i9j0" }
    ]
  },
  {
    id: "LOT-9012",
    producerId: "PROD-001",
    producerName: "Koffi Mensah",
    quantity: 3400,
    origin: "Centrale, Togo",
    gps: "8.1234° N, 1.2345° E",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: 0,
    photos: ["https://images.unsplash.com/photo-1559440666-8806282362b7?w=400"],
    history: [
      { status: 0, label: "Récolte Enregistrée", date: new Date(Date.now() - 86400000).toISOString(), actor: "Koffi Mensah", hash: "0xcf...k1l2" }
    ]
  }
];

let NOTIFICATIONS = [
  { id: 1, toRole: "Agriculteur", message: "Votre lot LOT-8821 a atteint l'étape de Transformation.", date: new Date().toISOString(), read: false, type: 'info' },
  { id: 2, toRole: "Coopérative", message: "Nouveau lot en attente de certification par Koffi Mensah (LOT-9012)", date: new Date().toISOString(), read: false, type: 'warning' },
  { id: 3, toRole: "Ministère", message: "Alerte: Augmentation de production de 15% dans la zone Plateaux.", date: new Date().toISOString(), read: false, type: 'info' }
];

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(cors());

  // --- API ROUTES ---

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Non authentifié" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ message: "Session expirée" });
      req.user = user;
      next();
    });
  };

  app.post('/api/auth/login', (req, res) => {
    const { identifier, password } = req.body;
    const cleanId = String(identifier || '').trim();
    console.log(`Login attempt for: ${cleanId}`);
    const actor = ACTORS.find(a => (a.email === cleanId || a.id === cleanId) && a.password === password);

    if (actor) {
      console.log(`Login success for: ${actor.name} (${actor.role})`);
      const token = jwt.sign({ 
        id: actor.id, 
        email: actor.email, 
        role: actor.role, 
        name: actor.name,
        color: actor.color 
      }, JWT_SECRET);
      res.json({ token, user: { id: actor.id, email: actor.email, role: actor.role, name: actor.name, color: actor.color } });
    } else {
      console.log(`Login failed for: ${identifier}`);
      res.status(401).json({ message: "Identifiant ou mot de passe incorrect" });
    }
  });

  // Combined endpoint for dashboard fluidity
  app.get('/api/dashboard/init', authenticateToken, (req: any, res) => {
    const stats = {
      totalLots: lotHistory.length,
      totalQuantity: lotHistory.reduce((acc, lot) => acc + lot.quantity, 0),
      activeTransports: lotHistory.filter(l => l.status === 2).length,
      certifiedLots: lotHistory.filter(l => l.status >= 1).length,
      eudrComplianceScore: 98.5,
      regionalDistribution: [
        { region: "Plateaux", cases: 45 },
        { region: "Centrale", cases: 22 },
        { region: "Kara", cases: 12 }
      ]
    };
    const notifications = NOTIFICATIONS.filter(n => n.toRole === req.user.role);
    const lots = lotHistory;
    const usersData = req.user.role === 'Administrateur' ? ACTORS : null;
    
    res.json({ stats, notifications, lots, users: usersData });
  });

  // Admin: Get all users
  app.get('/api/admin/users', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'Administrateur') return res.sendStatus(403);
    res.json(ACTORS);
  });

  // Admin: Create user
  app.post('/api/admin/users/create', authenticateToken, (req: any, res) => {
    if (req.user.role !== 'Administrateur') return res.sendStatus(403);
    const { name, email, password, role, phone, location, zone } = req.body;
    
    if (ACTORS.find(a => a.email === email)) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const prefix = role.substring(0, 3).toUpperCase();
    const newUser = {
      id: `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`,
      name, email, password, role, phone, location, zone,
      color: '#2d5a27'
    };
    ACTORS.push(newUser);
    res.status(201).json(newUser);
  });

  app.get('/api/notifications', authenticateToken, (req: any, res) => {
    const userNotifications = NOTIFICATIONS.filter(n => n.toRole === req.user.role);
    res.json(userNotifications);
  });

  app.post('/api/notifications/read', authenticateToken, (req: any, res) => {
    NOTIFICATIONS = NOTIFICATIONS.map(n => n.toRole === req.user.role ? { ...n, read: true } : n);
    res.json({ success: true });
  });

  app.get('/api/auth/me', authenticateToken, (req: any, res) => {
    res.json(req.user);
  });

  app.get('/api/cacao/all', authenticateToken, (req, res) => {
    res.json(lotHistory);
  });

  app.get('/api/cacao/trace/:id', authenticateToken, (req, res) => {
    const lot = lotHistory.find(l => l.id === req.params.id);
    if (!lot) return res.status(404).json({ message: "Lot non trouvé" });
    res.json(lot);
  });

  app.post('/api/cacao/add', authenticateToken, (req: any, res) => {
    const { quantity, origin, gps, photos } = req.body;
    const newLot = {
      id: `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
      producerId: req.user.id,
      producerName: req.user.name,
      quantity,
      origin,
      gps,
      timestamp: new Date().toISOString(),
      status: 0,
      photos: photos || [],
      history: [
        { 
          status: 0, 
          label: "Récolte Enregistrée", 
          date: new Date().toISOString(), 
          actor: req.user.name, 
          hash: `0x${Math.random().toString(16).slice(2, 10)}...` 
        }
      ]
    };
    lotHistory.unshift(newLot);

    // Notify Cooperative
    NOTIFICATIONS.unshift({
      id: Date.now(),
      toRole: "Coopérative",
      message: `Nouveau lot récolté par ${req.user.name} (${newLot.id})`,
      date: new Date().toISOString(),
      read: false,
      type: 'info'
    });

    res.status(201).json(newLot);
  });

  app.post('/api/cacao/transition/:id', authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const { status, label, nextRole } = req.body;
    
    const lotIndex = lotHistory.findIndex(l => l.id === id);
    if (lotIndex === -1) return res.status(404).json({ message: "Lot non trouvé" });

    lotHistory[lotIndex].status = status;
    lotHistory[lotIndex].history.push({
      status,
      label,
      date: new Date().toISOString(),
      actor: req.user.name,
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "..."
    });

    if (nextRole) {
      NOTIFICATIONS.unshift({
        id: Date.now(),
        toRole: nextRole,
        message: `Action requise sur ${id} : ${label}`,
        date: new Date().toISOString(),
        read: false,
        type: 'info'
      });
    }

    res.json(lotHistory[lotIndex]);
  });

  app.get('/api/cacao/stats', authenticateToken, (req, res) => {
    res.json({
      totalLots: lotHistory.length,
      totalQuantity: lotHistory.reduce((acc, lot) => acc + lot.quantity, 0),
      activeTransports: lotHistory.filter(l => l.status === 2).length,
      certifiedLots: lotHistory.filter(l => l.status >= 1).length,
      eudrComplianceScore: 98.5,
      regionalDistribution: [
        { region: "Plateaux", cases: 45 },
        { region: "Centrale", cases: 22 },
        { region: "Kara", cases: 12 }
      ]
    });
  });

  // API 404 handler
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
  });

  // Global Error Handler
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Server Error:', err);
    if (req.path.startsWith('/api/')) {
      return res.status(500).json({ 
        message: "Une erreur interne est survenue sur le serveur",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    next(err);
  });

  // --- VITE / STATIC SERVING ---
  const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

  if (isProd && !process.env.VERCEL) {
    // Only serve static files via Express if NOT on Vercel (e.g. self-hosted node server)
    const distPath = path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else if (!isProd && !process.env.VERCEL) {
    // Local Dev / AIS
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.resolve(__dirname, '../frontend'),
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);

    // Serve transformed index.html for all non-API routes
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      const htmlPath = path.resolve(__dirname, '../frontend/index.html');
      
      if (!fs.existsSync(htmlPath)) {
        return res.status(404).send('Frontend balance non trouvée. Vérifiez le dossier /frontend');
      }

      try {
        let template = fs.readFileSync(htmlPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChainCacao Server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error('\n' + '='.repeat(50));
      console.error(` ERREUR : Le port ${PORT} est déjà utilisé !`);
      console.error('='.repeat(50));
      console.error(`Un autre serveur ChainCacao est probablement déjà lancé.`);
      console.error(`Vérifiez vos terminaux ou tuez le processus occupant le port ${PORT}.`);
      console.error(`Sur Windows : netstat -ano | findstr :${PORT}`);
      console.error('='.repeat(50) + '\n');
      process.exit(1);
    } else {
      console.error('Erreur serveur critique:', e);
    }
  });
}

startServer();

export default app;
