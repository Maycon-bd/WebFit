import React, { useState, useEffect } from 'react';
import { Plus, Upload, Printer, Loader2 } from 'lucide-react';
// @ts-ignore
import { useCompany } from '../context/CompanyContext';
import ModalExportar from './ModalExportar';

/**
 * Componente Master de Layout para telas de CRUD.
 * Padroniza o cabeçalho, botões de ação e a alternância entre Grid e Formulário.
 */

// Exportar para consumidores (Adm, Cpr, Faz etc.)
export interface MasterCrudPermissions {
    podeCriar?: boolean;
    podeImprimir?: boolean;
    podeExportar?: boolean;
    [key: string]: unknown;
}

interface MasterCrudState {
    hasData: boolean;
    isLoading: boolean;
    isExportModalOpen: boolean;
    setIsExportModalOpen: (v: boolean) => void;
    handleExport: () => void;
    data: any[];
    [key: string]: unknown;
}

interface ExportConfig {
    title?: string;
    columnGroups: { label: string; keys: string[] }[];
    availableColumns: { key: string; label: string }[];
    filenamePrefix?: string;
}

interface PrintConfig {
    handlePrint?: () => void;
    [key: string]: unknown;
}

interface MasterCrudPageProps {
    title: string;
    subtitle?: React.ReactNode;
    icon?: React.ComponentType<{ size?: number | string }>;
    viewMode: 'list' | 'form';
    onNew?: () => void;
    onPrint?: () => void;
    onExport?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    loadingMessage?: string;
    hasData?: boolean;
    searchSlot?: React.ReactNode;
    gridSlot?: React.ReactNode;
    formSlot?: React.ReactNode;
    extraSlot?: React.ReactNode;
    // Estas 4 props DEVEM ter default = null para não quebrar consumers existentes
    customHeaderActions?: React.ReactNode;
    crud?: MasterCrudState | null;
    exportConfig?: ExportConfig | null;
    printConfig?: PrintConfig | null;
    permissions?: MasterCrudPermissions;
}

const MasterCrudPage: React.FC<MasterCrudPageProps> = ({
    title,
    subtitle,
    icon: Icon,
    viewMode,
    onNew,
    onPrint,
    onExport,
    onRefresh,
    isLoading,
    loadingMessage,
    hasData,
    searchSlot,
    gridSlot,
    formSlot,
    extraSlot,
    customHeaderActions = null,
    crud = null,
    exportConfig = null,
    printConfig = null,
    permissions,
}) => {
    const podeCriar = permissions?.podeCriar ?? true;
    const podeImprimir = permissions?.podeImprimir ?? true;
    const podeExportar = permissions?.podeExportar ?? true;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectedCompany } = useCompany();

    // ─── Timer para o Loading ──────────────────────────────────────────
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

    const formatTime = (totalSeconds: number) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // Se estivermos em modo formulário, renderizamos apenas o formulário sem o cabeçalho mestre da grid
    if (viewMode === 'form') {
        return (
            <div className="animate-fade-in">
                {formSlot}
                {extraSlot}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 h-full animate-fade-in">
            {/* Cabeçalho da Página (Botões de Ação) — sempre visível, nunca coberto pelo overlay */}
            <header className="relative z-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-3xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl border border-slate-100 bg-white shadow-xs flex items-center justify-center text-corp-teal shrink-0">
                        {Icon && <Icon size={24} />}
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-slate-800 tracking-tight">{title}</h1>
                        <div className="text-xs font-medium text-slate-400">{subtitle}</div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                    {customHeaderActions}
                    {podeExportar && (onExport || (crud && exportConfig)) && (
                        <button
                            onClick={onExport || (crud as MasterCrudState).handleExport}
                            disabled={!(hasData ?? crud?.hasData) || (isLoading ?? crud?.isLoading)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all duration-75 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <Upload size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Exportar</span>
                        </button>
                    )}

                    {podeImprimir && (onPrint || (crud && printConfig)) && (
                        <button
                            onClick={onPrint || printConfig?.handlePrint}
                            disabled={!(hasData ?? crud?.hasData) || (isLoading ?? crud?.isLoading)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all duration-75 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            <Printer size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Imprimir</span>
                        </button>
                    )}

                    {podeCriar && onNew && (
                        <button
                            onClick={onNew}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-corp-green text-white font-bold text-sm hover:bg-corp-green-hover transition-all duration-75 shadow-lg hover:shadow-corp-green/20 group"
                        >
                            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                            Novo
                        </button>
                    )}
                </div>
            </header>

            {/* Filtros + Grid — overlay de loading cobre ambos, header fica sempre livre */}
            <div className="flex flex-col gap-6 flex-1 min-h-0 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center cursor-not-allowed rounded-2xl overflow-hidden transition-all duration-300">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-[90%] transform transition-all duration-500 animate-in fade-in zoom-in-95">

                            {/* Ícone Animado */}
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 bg-corp-teal/20 rounded-full blur-xl animate-pulse w-24 h-24 -m-4"></div>
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
                                    {loadingMessage || 'Carregando registros...'}
                                </p>
                            </div>

                            {/* Barra de progresso indeterminada verde */}
                            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-corp-teal rounded-full w-1/2 animate-[progress_1.5s_ease-in-out_infinite] origin-left"></div>
                            </div>
                        </div>
                        <style>{`
                            @keyframes progress {
                                0% { transform: translateX(-100%); }
                                50% { transform: translateX(50%); }
                                100% { transform: translateX(200%); }
                            }
                        `}</style>
                    </div>
                )}

                {/* Painel de Pesquisa */}
                {searchSlot && (
                    <div className="w-full">
                        {searchSlot}
                    </div>
                )}

                {/* Área da Grid */}
                <div className="flex-1 min-h-0 flex flex-col">
                    {gridSlot}
                </div>
            </div>

            {/* Extras (modais, etc.) */}
            {extraSlot}

            {/* Modal de Exportação Automático */}
            {crud && exportConfig && (
                <ModalExportar
                    isOpen={crud.isExportModalOpen}
                    onClose={() => crud.setIsExportModalOpen(false)}
                    title={exportConfig.title || `Exportar ${title}`}
                    data={crud.data}
                    columnGroups={exportConfig.columnGroups}
                    availableColumns={exportConfig.availableColumns}
                    filenamePrefix={exportConfig.filenamePrefix || title.toLowerCase().replace(/\s+/g, '_')}
                />
            )}
        </div>
    );
};

export default MasterCrudPage;
