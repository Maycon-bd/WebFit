import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Criar uma interface para as props
 * Tipar o componente com React.FC<Props>
 * Verificar se há valores que podem ser null
 */


/**
 * ModalConfirmacao - Design System Vólus
 * Padrão para confirmar exclusões ou ações destrutivas no SAV WEB.
 */


interface ModalConfirmacaoProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
    disableConfirm?: boolean;
    children?: React.ReactNode;
}

const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
    isOpen,
    title = 'Confirmar Exclusão',
    message = 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.',
    onConfirm,
    onCancel,
    confirmText = 'Excluir',
    cancelText = 'Cancelar',
    isDestructive = true,
    disableConfirm = false,
    children
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    e.stopPropagation();
                    onCancel();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!disableConfirm) {
                        onConfirm();
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('keydown', handleKeyDown);
            };
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onCancel, onConfirm, disableConfirm]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 lg:left-[280px] z-[100000] flex items-center justify-center font-sans overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 transition-opacity animate-fade-in"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 m-4">
                <button
                    onClick={onCancel}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center mt-2">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 shadow-sm border ${isDestructive ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-orange-50 border-orange-100 text-orange-500'}`}>
                        <AlertTriangle size={36} strokeWidth={1.5} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                        {title}
                    </h3>

                    <p className="text-sm font-medium text-slate-500 mb-6 max-w-[260px] leading-relaxed">
                        {message}
                    </p>

                    {children && (
                        <div className="w-full mb-6 text-left">
                            {children}
                        </div>
                    )}

                    <div className="flex gap-3 w-full">
                        {cancelText && (
                            <button
                                onClick={onCancel}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer active:scale-95"
                            >
                                {cancelText}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                onConfirm();
                            }}
                            disabled={disableConfirm}
                            className={`px-4 py-3 font-bold text-sm rounded-xl text-white shadow-xl transition-transform active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${cancelText ? 'flex-1' : 'w-full'} ${isDestructive ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-corp-teal hover:bg-teal-600 shadow-teal-500/20'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default ModalConfirmacao;