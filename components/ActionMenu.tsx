import React from 'react';
import ReactDOM from 'react-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';

export interface ExtraAction {
  label:    string;
  icon:     React.ComponentType<{ size?: number; className?: string }>;
  onClick:  () => void;
  variant?: 'default' | 'danger';
}

interface MenuPosition {
  top:  number;
  left: number;
}

interface ActionMenuProps {
  isOpen:        boolean;
  menuRef:       React.RefObject<HTMLDivElement>;
  position:      MenuPosition;
  onClose:       () => void;
  onEdit?:       () => void;
  onView?:       () => void;
  onDelete?:     () => void;
  onPrint?:      () => void;

  extraActions?: ExtraAction[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    isOpen,
    menuRef,
    position,
    onClose,
    onEdit,
    onView,
    onDelete,

    extraActions = [],
}) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div
            ref={menuRef}
            style={{ position: 'fixed', top: position.top, left: position.left, transform: 'translateY(-100%)' }}
            className="w-52 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/60 py-1.5 z-[9999] flex flex-col items-stretch"
        >
            <div className="px-3 pb-1 pt-0.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Opções</span>
            </div>

            {onEdit && (
                <button
                    onClick={() => { onClose(); onEdit(); }}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-left"
                >
                    <Pencil size={15} />
                    <span>Editar</span>
                </button>
            )}

            {onView && (
                <button
                    onClick={() => { onClose(); onView(); }}
                    className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors text-left"
                >
                    <Eye size={15} />
                    <span>Visualizar</span>
                </button>
            )}



            {/* Ações extras injetadas pelo consumer */}
            {extraActions.length > 0 && (
                <>
                    <div className="my-1 border-t border-slate-100" />
                    {extraActions.map((action, i) => {
                        const isDanger = action.variant === 'danger';
                        const Icon = action.icon;
                        return (
                            <button
                                key={i}
                                onClick={() => { onClose(); action.onClick(); }}
                                className={`flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors text-left ${
                                    isDanger
                                        ? 'text-rose-600 hover:bg-rose-50'
                                        : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                                }`}
                            >
                                <Icon size={15} />
                                <span>{action.label}</span>
                            </button>
                        );
                    })}
                </>
            )}

            {onDelete && (
                <>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                        onClick={() => { onClose(); onDelete(); }}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                        <Trash2 size={15} />
                        <span>Excluir</span>
                    </button>
                </>
            )}
        </div>,
        document.body
    );
};

export default ActionMenu;
