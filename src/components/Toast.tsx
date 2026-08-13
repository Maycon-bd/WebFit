import React, { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const TOAST_EVENT = 'webfit:toast';

function inferToastType(message: string): ToastType {
  if (/sucesso|sucesso|registrad|atualizad|copiad|ativad|exportad|gerad|emitid|agendad|enviad|cri(ad|ad)|alterad/i.test(message)) return 'success';
  if (/obrigatóri|informe|selecione|preencha|por favor|maior que zero/i.test(message)) return 'warning';
  return 'info';
}

export function notifyToast(message: string, type: ToastType = 'info', duration = 4200) {
  window.dispatchEvent(new CustomEvent<Pick<ToastMessage, 'message' | 'type' | 'duration'>>(TOAST_EVENT, {
    detail: { message, type, duration },
  }));
}

const Toast: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, toast.duration);
    return () => window.clearTimeout(timer);
  }, [onClose, toast.duration]);

  const icons: Record<ToastType, string> = {
    success: '✓',
    error: '!',
    warning: '⚠',
    info: 'i',
  };

  return (
    <div className={`toast toast-${toast.type}`} role={toast.type === 'error' ? 'alert' : 'status'}>
      <span className="toast-icon" aria-hidden="true">{icons[toast.type]}</span>
      <p>{toast.message}</p>
      <button type="button" className="toast-close" onClick={onClose} aria-label="Fechar aviso">×</button>
      <span className="toast-progress" aria-hidden="true" style={{ animationDuration: `${toast.duration}ms` }} />
    </div>
  );
};

const ToastHost: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<Pick<ToastMessage, 'message' | 'type' | 'duration'>>).detail;
      setToasts((current) => [...current, { ...detail, id: Date.now() + Math.random() }].slice(-4));
    };
    window.addEventListener(TOAST_EVENT, handleToast);
    const nativeAlert = window.alert;
    window.alert = (message?: unknown) => {
      const text = String(message ?? '');
      notifyToast(text, inferToastType(text));
    };
    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
      window.alert = nativeAlert;
    };
  }, []);

  const removeToast = (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id));

  return (
    <div className="toast-region" aria-label="Avisos" aria-live="polite">
      {toasts.map((toast) => <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />)}
    </div>
  );
};

export default ToastHost;
