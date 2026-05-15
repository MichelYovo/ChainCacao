# 🎯 ChainCacao Hackathon - Guide RAPIDE

## ✅ MVP CHECKLIST

```
BEFORE HACKATHON:
☐ Login page works
☐ Dashboard shows stats
☐ Add lot form works
☐ Track page shows history
☐ Responsive on mobile
☐ Backend runs (port 3000)
☐ Frontend runs (port 5173)
☐ Git pushed to origin
☐ Mobile app compiled
☐ No console errors
```

## 🚀 3 MIN SETUP

```bash
# 1. Backend
cd backend && npm install && npm run dev &

# 2. Frontend (new terminal)
cd frontend && npm install && npm run dev &

# 3. Access
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## 📱 React Native Expo Setup (5 MIN)

```bash
# Inside mobile/ folder
npm install -g expo-cli

# Create app
npx create-expo-app .

# Install deps
npm install axios expo-secure-store @react-navigation/native

# Start
npm start

# Scan QR with Expo Go app
```

## 🔗 API Client for React Native

```typescript
// mobile/src/services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://192.168.1.100:3000/api", // Change to your IP
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Export for use
export const login = (email, password) =>
  api.post("/auth/login", { identifier: email, password });

export const getLots = () => api.get("/cacao/all");
export const addLot = (data) => api.post("/cacao/add", data);
```

## 📱 Simple Login Screen

```typescript
// mobile/App.tsx
import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { login } from './src/services/api';

export default function App() {
  const [email, setEmail] = useState('koffi@farm.tg');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log('Logged in:', response.data.user.name);
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <View style={{flex:1, justifyContent:'center', padding:20}}>
      <Text style={{fontSize:24, fontWeight:'bold', marginBottom:20}}>
        ChainCacao
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{borderWidth:1, padding:10, marginBottom:10}}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{borderWidth:1, padding:10, marginBottom:20}}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
```

## 🐛 FIXES IF NEEDED

**Backend not starting?**

```bash
cd backend
npm install  # missing packages
npm run dev
```

**Frontend not connecting to backend?**

```bash
# Check backend is running on port 3000
# In frontend: update API URL if needed
```

**Mobile not connecting?**

```bash
# Use your PC IP, not localhost
# Find IP: ipconfig | findstr "IPv4"
# Update in api.ts: http://192.168.x.x:3000/api
```

## 🔗 GIT PUSH

```bash
# At project root
git add .
git commit -m "feat: MVP with monorepo structure"
git push origin main
```

## 🏆 HACKATHON TIPS

1. **Keep it simple** - Focus on core features
2. **Test everything** - No broken features
3. **Mobile ready** - Responsive design
4. **Document code** - Add comments
5. **Demo scenario** - Prepare a use case

---

**You're ready! Deploy & win! 🎉**
