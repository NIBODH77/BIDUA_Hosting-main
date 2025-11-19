import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function BackendStatusBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const checkBackendStatus = async () => {
    try {
      setIsChecking(true);
      // Try to ping a lightweight endpoint
      await fetch('http://localhost:8000/api/v1/health', { 
        method: 'GET',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check on mount
    checkBackendStatus();

    // Check every 10 seconds
    const interval = setInterval(checkBackendStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isOnline) {
    return null; // Don't show banner when backend is online
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Backend Server Offline</p>
            <p className="text-sm text-white/90">
              Some features may not work. Please check if the backend is running on port 8000.
            </p>
          </div>
        </div>
        <button
          onClick={checkBackendStatus}
          disabled={isChecking}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {isChecking ? 'Checking...' : 'Retry'}
          </span>
        </button>
      </div>
    </div>
  );
}
