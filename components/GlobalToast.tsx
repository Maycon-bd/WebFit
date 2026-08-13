import React from 'react';
// @ts-ignore
import { useToast } from '../context/ToastContext';
import { AlertCircle, CheckCircle2, Info, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    isExiting?: boolean;
}

const GlobalToast: React.FC = () => {
    const { toasts, removeToast } = useToast() as {
        toasts: Toast[];
        removeToast: (id: string) => void;
    };

    if (!toasts || toasts.length === 0) return null;

    return (
        <>
            {/* Tag style encapsulando as animações premium solicitadas */}
            <style>{`
                @keyframes toastIn {
                    0% {
                        transform: translateX(120%) scale(0.9);
                        opacity: 0;
                    }
                    50% {
                        transform: translateX(-15px) scale(1.03);
                        opacity: 0.95;
                    }
                    65% {
                        transform: translateX(8px) scale(1.0);
                    }
                    80% {
                        transform: translateX(-4px);
                    }
                    95% {
                        transform: translateX(1px);
                    }
                    100% {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes toastOut {
                    0% {
                        transform: translateX(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(120%) scale(0.95);
                        opacity: 0;
                    }
                }

                .animate-toast-in {
                    animation: toastIn 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                .animate-toast-out {
                    animation: toastOut 0.35s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
                }
            `}</style>

            <div className="fixed top-4 right-4 z-[999999] flex flex-col gap-3">
                {toasts.map((toast) => {
                    const isError = toast.type === 'error';
                    const isSuccess = toast.type === 'success';
                    const isWarning = toast.type === 'warning';

                    let Icon = Info;
                    let colorClass = 'text-blue-500';
                    let borderClass = 'border-l-4 border-blue-500';

                    if (isError) {
                        Icon = XCircle;
                        colorClass = 'text-red-500';
                        borderClass = 'border-l-4 border-red-500';
                    } else if (isSuccess) {
                        Icon = CheckCircle2;
                        colorClass = 'text-corp-green';
                        borderClass = 'border-l-4 border-corp-green';
                    } else if (isWarning) {
                        Icon = AlertCircle;
                        colorClass = 'text-orange-500';
                        borderClass = 'border-l-4 border-orange-500';
                    }

                    const animClass = toast.isExiting ? 'animate-toast-out' : 'animate-toast-in';

                    return (
                        <div
                            key={toast.id}
                            className={`bg-white p-4 rounded-xl shadow-2xl flex items-start gap-4 max-w-sm w-[90vw] md:w-full transform transition-all duration-300 ${borderClass} ${animClass}`}
                        >
                            <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                                <Icon size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-corp-dark font-sans break-words">
                                    {typeof toast.message === 'string' ? toast.message : JSON.stringify(toast.message)}
                                </p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 p-1 text-slate-400 hover:bg-slate-100 rounded-lg hover:text-slate-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default GlobalToast;
