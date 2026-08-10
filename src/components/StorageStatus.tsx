import React, { useEffect, useState } from 'react';
import { storageErrorEvent, type StorageErrorDetail } from '../services/storage';

const StorageStatus: React.FC = () => {
  const [error, setError] = useState<StorageErrorDetail | null>(null);

  useEffect(() => {
    const handleError = (event: Event) => {
      setError((event as CustomEvent<StorageErrorDetail>).detail);
    };
    window.addEventListener(storageErrorEvent, handleError);
    return () => window.removeEventListener(storageErrorEvent, handleError);
  }, []);

  if (!error) return null;

  return (
    <div className="storage-warning" role="alert">
      <span>Não foi possível {error.operation === 'write' ? 'salvar' : 'restaurar'} os dados locais.</span>
      <button type="button" onClick={() => setError(null)} aria-label="Fechar aviso">×</button>
    </div>
  );
};

export default StorageStatus;
