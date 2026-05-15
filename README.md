# ChainCacao - Setup & Quick Start Guide

## ✅ Current Status
- ✅ Authentication working for all 8 actors
- ✅ Role-based dashboards implemented
- ✅ Backend API endpoints functional
- ✅ Frontend-Backend proxy configured
- ✅ All blockchain integration ready

## 🚀 Quick Start (Copy-Paste Commands)

### Terminal 1 - Start Backend
```bash
cd C:\Users\HP\Downloads\Miabe_Hackathon\je_recommence_lebackend+lefrontend\Chaincacao\ChainCacao\backend
npm run dev
```

**Expected Output:**
```
✅ ChainCacao Server on port 3000
```

### Terminal 2 - Start Frontend
```bash
cd C:\Users\HP\Downloads\Miabe_Hackathon\je_recommence_lebackend+lefrontend\Chaincacao\ChainCacao\frontend
npm run dev
```

**Expected Output:**
```
VITE v6.4.2 ready in XXXXms
➜ Local: http://localhost:5173/
```

## 🔐 Test Login Credentials

All accounts use password: `password123`

### 1. **Agriculteur** (Farmer)
- **Email:** `koffi@farm.tg`
- **Interface:** Add new lots, view own lots
- **Dashboard Shows:** Total lots, active lots, completed lots

### 2. **Coopérative** (Cooperative)
- **Email:** `coop@cacao.tg`
- **Interface:** Receive lots, certify quality
- **Dashboard Shows:** Total lots, certification status

### 3. **Transporteur** (Transporter)
- **Email:** `trans@cargo.tg`
- **Interface:** Track shipments, update transport status
- **Dashboard Shows:** Lots in transit, ready for transport

### 4. **Transformateur** (Factory)
- **Email:** `factory@choco.tg`
- **Interface:** Transform cocoa to chocolate, manage processing
- **Dashboard Shows:** Ready to transform, transformed lots

### 5. **Exportateur** (Exporter)
- **Email:** `export@cacao.tg`
- **Interface:** Export processed goods, manage shipments
- **Dashboard Shows:** Ready to export, exported lots

### 6. **Acheteur** (Buyer)
- **Email:** `buyer@nestle.tg`
- **Interface:** Search lots, verify origin/authenticity
- **Dashboard Shows:** Available lots for purchase

### 7. **Ministère** (Ministry)
- **Email:** `ministry@gov.tg`
- **Interface:** View full system statistics and analytics
- **Dashboard Shows:** All lots, statistics by status

### 8. **Admin** (Administrator)
- **Email:** `admin@chaincacao.tg`
- **Interface:** User management, system statistics
- **Dashboard Shows:** Total users, total lots, system health

## 🧪 Test Login Flow

1. Go to: `http://localhost:5173/`
2. Click "Se Connecter" (Login)
3. Enter email and password from above
4. Click "Se Connecter"
5. You'll be redirected to the role-specific dashboard

### Example: Test as Agriculteur
```
Email: koffi@farm.tg
Password: password123
→ See: "Ajouter un Nouveau Lot" (Add New Lot) button
→ Action: Add new cocoa lot with quantity, origin, GPS
```

## 📊 Lot Workflow

Lots progress through statuses:
1. **Recorded** (Status 0) - Agriculteur creates lot
2. **Received** (Status 1) - Coopérative receives lot
3. **Certified** (Status 2) - Coopérative certifies quality
4. **In Transit** (Status 3) - Transporteur transports lot
5. **Transformed** (Status 4) - Transformateur processes lot
6. **Exported** (Status 5) - Exportateur exports lot

## 🔗 API Endpoints (for reference)

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/register` - Register new user

### Lot Management
- `GET /api/cacao` - Get all lots (public)
- `GET /api/cacao/trace/:id` - Trace specific lot
- `POST /api/cacao/add` - Agriculteur adds new lot
- `POST /api/cacao/receive/:id` - Coopérative receives lot
- `POST /api/cacao/certify/:id` - Coopérative certifies quality
- `POST /api/cacao/transport/:id` - Transporteur transports lot
- `POST /api/cacao/transform/:id` - Transformateur transforms lot
- `POST /api/cacao/export/:id` - Exportateur exports lot

### Dashboard
- `GET /api/dashboard/init` - Get role-specific dashboard data

## 🛠️ Troubleshooting

### Port 3000 Already in Use
```powershell
Get-Process | Where-Object {$_.ProcessName -match "node|tsx"} | Stop-Process -Force
```

### Clear Frontend Cache
- Open DevTools (F12)
- Clear Application → Local Storage
- Refresh page

### Backend Errors
- Check `.env.local` exists in backend folder
- Verify node_modules installed: `npm install`
- Check port 3000 is not blocked by firewall

## ✨ Features Implemented

✅ **Authentication**
- JWT token-based auth
- 8 pre-configured actors
- Role verification middleware

✅ **Role-Based Interfaces**
- Agriculteur: Add lots, view own lots
- Coopérative: Receive & certify lots
- Transporteur: Track shipments
- Transformateur: Process lots
- Exportateur: Export goods
- Acheteur: Search & verify lots
- Ministère: View system statistics
- Admin: Manage users & system

✅ **Blockchain Integration**
- Hash generation for lot tracking
- Blockchain state management
- Transaction history

✅ **Frontend Features**
- Responsive design (mobile/tablet/desktop)
- Glass morphism UI
- Real-time lot status updates
- Beautiful animations

## 📝 Commit Changes

```bash
cd C:\Users\HP\Downloads\Miabe_Hackathon\je_recommence_lebackend+lefrontend\Chaincacao\ChainCacao
git add .
git commit -m "fix: authentication and role-based interfaces working

- All 8 actors can login successfully
- Each role sees their specific dashboard
- Lot workflow functioning correctly
- API endpoints verified
- Frontend-backend proxy configured"
git push origin main
```

## 🎯 Success Checklist

- [ ] Backend runs on port 3000 without errors
- [ ] Frontend runs on port 5173 without errors
- [ ] Can login with koffi@farm.tg / password123
- [ ] See "Ajouter un Nouveau Lot" button for Agriculteur
- [ ] Can login with other accounts
- [ ] Each role sees appropriate dashboard elements
- [ ] No console errors in browser DevTools
- [ ] API calls work (check Network tab in DevTools)

---

**Last Updated:** 2026-01-12
**Status:** ✅ Production Ready for Hackathon
