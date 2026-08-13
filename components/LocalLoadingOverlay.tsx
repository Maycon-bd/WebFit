// SAV — LocalLoadingOverlay
// Overlay local de loading — cobre apenas o container pai (requer position:relative no parent)

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LocalLoadingOverlayProps {
    message?: string;
}

const LocalLoadingOverlay: React.FC<LocalLoadingOverlayProps> = ({ message = 'Carregando...' }) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        setElapsedSeconds(0);
        const timer = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) =>
        `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    return (
        <div className="fixed inset-0 left-0 lg:left-[280px] bg-slate-900/40 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center transition-all duration-300">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-[90%] transform transition-all duration-500 animate-in fade-in zoom-in-95">

                {/* Ícone Animado */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-corp-teal/20 rounded-full blur-xl animate-pulse w-24 h-24 -m-4" />
                    <div className="w-16 h-16 bg-corp-teal/10 rounded-full flex items-center justify-center relative z-10">
                        <Loader2 size={32} className="text-corp-teal animate-spin" />
                    </div>
                </div>

                {/* Textos e Cronômetro */}
                <div className="text-center space-y-2 w-full">
                    <h3 className="text-lg font-bold text-corp-dark font-sans">
                        Processando
                        <span className="text-corp-teal ml-2 text-sm font-mono tracking-wider font-semibold">
                            {formatTime(elapsedSeconds)}
                        </span>
                    </h3>
                    <p className="text-sm font-medium text-slate-500 font-sans animate-pulse">
                        {message}
                    </p>
                </div>

                {/* Barra de progresso indeterminada */}
                <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-corp-teal rounded-full w-1/2 animate-[progress_1.5s_ease-in-out_infinite] origin-left" />
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0%   { transform: translateX(-100%); }
                    50%  { transform: translateX(50%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
};

export default LocalLoadingOverlay;
