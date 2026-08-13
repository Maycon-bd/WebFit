import React, { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';
import { Loader2, X } from 'lucide-react';

const GlobalLoader: React.FC = () => {
    const { isLoading, loadingMessage, cancelOptions, hideLoading } = useLoading();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (isLoading) {
            setElapsedSeconds(0);
            timer = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            setElapsedSeconds(0);
        }
        return () => {
          if (timer) clearInterval(timer);
        };
    }, [isLoading]);

    const handleCancel = async () => {
        if (cancelOptions.onCancel) {
            cancelOptions.onCancel();
        }
        await hideLoading();
    };

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 left-0 lg:left-[280px] z-[9999] flex flex-col items-center justify-center bg-corp-dark/80 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-[90%] transform transition-all duration-500 animate-in fade-in zoom-in-95">

                {/* Ícone Animado (Moderno) */}
                <div className="relative flex items-center justify-center">
                    {/* Anéis externos pulsantes */}
                    <div className="absolute inset-0 bg-corp-green/20 rounded-full blur-xl animate-pulse w-24 h-24 -m-4"></div>
                    <div className="w-16 h-16 bg-corp-green/10 rounded-full flex items-center justify-center relative z-10">
                        <Loader2 size={32} className="text-corp-green animate-spin" />
                    </div>
                </div>

                {/* Textos e Cronômetro */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-corp-dark font-sans">
                        Aguarde
                        <span className="text-corp-green ml-2 text-sm font-mono tracking-wider font-semibold transition-all">
                            {formatTime(elapsedSeconds)}
                        </span>
                    </h3>
                    <p className="text-sm font-medium text-slate-500 font-sans animate-pulse px-2">
                        {loadingMessage}
                    </p>
                </div>

                {/* Barra de progresso indeterminada */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-corp-green rounded-full w-1/2 animate-[progress_1.5s_ease-in-out_infinite] origin-left"></div>
                </div>

                {/* Botão de Cancelar */}
                {cancelOptions.showCancel && (
                    <div className="pt-2 w-full border-t border-slate-100 mt-2">
                        <button
                            onClick={handleCancel}
                            className="w-full py-2.5 px-4 flex justify-center items-center gap-2 rounded-xl text-slate-500 bg-slate-50 hover:bg-red-50 hover:text-red-500 hover:border-red-100 border border-transparent font-semibold font-sans text-[13px] transition-all"
                        >
                            <X size={16} strokeWidth={2.5} />
                            Cancelar Operação
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(50%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
};

export default GlobalLoader;
