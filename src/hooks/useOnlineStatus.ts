import { useState, useEffect } from 'react';
import { syncStatus } from '../lib/sync';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(syncStatus.syncing);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Watch sync status
    const syncCheck = setInterval(() => {
      setIsSyncing(syncStatus.syncing);
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncCheck);
    };
  }, []);

  return { isOnline, isSyncing };
}