import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Smartphone, Download, Share, PlusSquare, ArrowLeft, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/navbar';

export const MobilePage: React.FC = () => {
  const navigate = useNavigate();
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if install prompt is already available
    if ((window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const handler = () => setCanInstall(true);
    window.addEventListener('pwa-install-available', handler);
    return () => window.removeEventListener('pwa-install-available', handler);
  }, []);

  const handleInstallClick = async () => {
    const promptEvent = (window as any).deferredPrompt;
    if (!promptEvent) return;

    // Show the install prompt
    promptEvent.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await promptEvent.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, so clear it
    (window as any).deferredPrompt = null;
    setCanInstall(false);
  };

  return (
    <>
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-12 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cacao-vert/5 rounded-full blur-[120px] -z-10" />
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cafe-moyen hover:text-cafe-profondeur transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft size={16} />
          Retour
        </button>

        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-cacao-vert rounded-3xl shadow-xl shadow-cacao-vert/20 flex items-center justify-center mx-auto"
          >
            <Smartphone size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-cafe-profondeur tracking-tight">
            Installer <span className="italic text-cacao-vert">ChainCacao</span>
          </h1>
          <p className="text-xl text-cafe-moyen max-w-2xl mx-auto">
            Transformez ce site en une véritable application mobile sur le téléphone de vos utilisateurs.
          </p>

          {canInstall && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-6"
            >
              <button
                onClick={handleInstallClick}
                className="px-12 py-6 bg-cafe-profondeur text-white rounded-[32px] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl shadow-cafe-profondeur/40 mx-auto group"
              >
                <Zap size={20} className="text-cacao-dore animate-pulse" />
                Installer Directement
                <Download size={20} className="group-hover:translate-y-1 transition-transform" />
              </button>
              <p className="text-xs text-cafe-clair font-bold uppercase tracking-widest mt-4">Disponible pour votre navigateur</p>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* iOS Guide */}
          <div className="bg-white p-8 rounded-[40px] border border-cacao-dore/10 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-cafe-profondeur">Sur iPhone (iOS)</h3>
            </div>
            <ol className="space-y-4">
              {[
                { icon: Smartphone, text: "Ouvrez ce lien dans le navigateur Safari." },
                { icon: Share, text: "Appuyez sur le bouton 'Partager' (le carré avec une flèche)." },
                { icon: PlusSquare, text: "Faites défiler et appuyez sur 'Sur l'écran d'accueil'." },
                { icon: Download, text: "L'application apparaîtra comme une App normale sur votre écran." }
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-cafe-profondeur text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">{i + 1}</div>
                  <p className="text-cafe-moyen font-medium">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Android Guide */}
          <div className="bg-white p-8 rounded-[40px] border border-cacao-dore/10 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <Smartphone size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-cafe-profondeur">Sur Android</h3>
            </div>
            <ol className="space-y-4">
              {[
                { icon: Smartphone, text: "Ouvrez ce lien dans Google Chrome." },
                { icon: Share, text: "Appuyez sur les 3 petits points en haut à droite." },
                { icon: Download, text: "Appuyez sur 'Installer l'application' ou 'Ajouter à l'écran d'accueil'." },
                { icon: DoubleCheck, text: "C'est prêt ! L'icône ChainCacao est sur votre bureau mobile." }
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-cacao-vert text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">{i + 1}</div>
                  <p className="text-cafe-moyen font-medium">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="bg-cafe-profondeur p-10 rounded-[40px] text-white text-center space-y-6">
           <h3 className="text-3xl font-display font-bold">Pourquoi faire cela ?</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                 <div className="text-cacao-dore font-black text-2xl">01</div>
                 <p className="text-cafe-clair text-sm">Fonctionne sans passer par les App Stores.</p>
              </div>
              <div className="space-y-2">
                 <div className="text-cacao-dore font-black text-2xl">02</div>
                 <p className="text-cafe-clair text-sm">Mode plein écran pour une meilleure expérience.</p>
              </div>
              <div className="space-y-2">
                 <div className="text-cacao-dore font-black text-2xl">03</div>
                 <p className="text-cafe-clair text-sm">Toujours à jour sans téléchargement manuel.</p>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

const DoubleCheck = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 13l3 3 7-7" />
    <path d="M2 12l3 3 4.5-4.5" />
  </svg>
);
