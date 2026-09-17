import { useSyncExternalStore } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getStorageError, subscribeStorage } from '../../lib/storage';
export function StorageNotice() {
  const error = useSyncExternalStore(subscribeStorage, getStorageError, () => null);
  return error ? <div className="storage-notice" role="alert"><AlertTriangle size={18} /><span>{error}</span></div> : null;
}
