import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from '@/components/security';
import { Navbar } from '@/components/layout/navbar';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { TrackPage } from '@/pages/TrackPage';
import { MobilePage } from '@/pages/MobilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-creme selection:bg-cacao-dore/30">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/mobile" element={<MobilePage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/track" 
              element={
                <>
                  <Navbar />
                  <TrackPage />
                </>
              } 
            />
          </Routes>
          
          {/* Global Footer Decoration */}
          <Routes>
            <Route path="/dashboard" element={
              <footer className="py-12 mt-20 border-t border-cacao-dore/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cacao-vert" />
                    <span className="text-xs font-bold uppercase tracking-widest text-cafe-moyen">ChainCacao Protocol v1.0.4</span>
                  </div>
                  <p className="text-xs font-medium text-cafe-clair">© 2026 Plateforme de Traçabilité Cacao Togo - Polygon Infrastructure</p>
                </div>
              </footer>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
