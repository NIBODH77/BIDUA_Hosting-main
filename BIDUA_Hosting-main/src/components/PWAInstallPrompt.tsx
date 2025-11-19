import { useState, useEffect } from 'react';
import { X, Download, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    setIsStandalone(isInStandaloneMode);

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Don't show prompt if already installed or dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isInStandaloneMode || isDismissed) {
      return;
    }

    // Listen for the beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds for better UX
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show prompt after 30 seconds if not installed
    if (iOS && !isInStandaloneMode) {
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 30000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android/Chrome installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed
  if (isStandalone || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slideUp">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl shadow-2xl border border-cyan-500/30 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 p-4 border-b border-cyan-500/30">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                <Download className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Install BIDUA Hosting</h3>
                <p className="text-cyan-300 text-xs">Quick access anytime!</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          {isIOS ? (
            // iOS Instructions
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">
                Install this app on your iPhone:
              </p>
              <ol className="text-sm text-slate-400 space-y-2 ml-4 list-decimal">
                <li>
                  Tap the <Share className="h-4 w-4 inline mx-1 text-cyan-400" /> share button
                </li>
                <li>Scroll down and tap "Add to Home Screen"</li>
                <li>Tap "Add" in the top right corner</li>
              </ol>
              <button
                onClick={handleDismiss}
                className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition text-sm font-medium border border-cyan-500/30"
              >
                Got it!
              </button>
            </div>
          ) : (
            // Android/Chrome Installation
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">
                Get quick access and offline support by installing our app!
              </p>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Offline Access</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                  <span>Faster Loading</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:from-cyan-400 hover:to-teal-400 transition text-sm font-medium shadow-lg shadow-cyan-500/30"
                >
                  Install Now
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition text-sm font-medium"
                >
                  Later
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
