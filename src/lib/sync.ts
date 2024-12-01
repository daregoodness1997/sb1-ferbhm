import { db } from './db';

export const syncStatus = {
  online: navigator.onLine,
  syncing: false,
};

const API_URL = 'https://api.example.com'; // Replace with actual API endpoint

export const syncWithServer = async () => {
  if (!navigator.onLine || syncStatus.syncing) return;
  
  syncStatus.syncing = true;
  
  try {
    const database = await db;
    const tx = await database.transaction('transactions', 'readonly');
    const index = tx.store.index('by-status');
    const pendingTransactions = await index.getAll('pending');
    
    // Batch sync pending transactions
    for (const transaction of pendingTransactions) {
      try {
        const response = await fetch(`${API_URL}/sync`, {
          method: 'POST',
          body: JSON.stringify(transaction),
        });
        
        if (response.ok) {
          const updateTx = await database.transaction('transactions', 'readwrite');
          const record = await updateTx.store.get(transaction.id);
          if (record) {
            record.syncStatus = 'synced';
            await updateTx.store.put(record);
          }
        }
      } catch (error) {
        console.error('Sync failed for transaction:', transaction.id, error);
      }
    }
  } finally {
    syncStatus.syncing = false;
  }
};

window.addEventListener('online', () => {
  syncStatus.online = true;
  syncWithServer();
});

window.addEventListener('offline', () => {
  syncStatus.online = false;
});