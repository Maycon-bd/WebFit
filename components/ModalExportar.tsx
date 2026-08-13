import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, FileSpreadsheet, File, CheckSquare, Square, Loader2, CheckCircle2 } from 'lucide-react';
import { useExportar } from '../hooks/useExportar';
import { useToast } from '../context/ToastContext';

interface ModalExportarProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any[];
    columnGroups: { label: string; keys: string[] }[];
    availableColumns: { key: string; label: string }[];
    filenamePrefix: string;
}

const FORMATS = [
    { id: 'txt', label: 'TXT', icon: FileText, color: 'text-slate-500', bg: 'bg-slate-50' },
    { id: 'csv', label: 'CSV', icon: File, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'xlsx', label: 'Excel', icon: FileSpreadsheet, color: 'text-green-600', bg: 'bg-green-50' }
];

/**
 * Modal de Exportação Genérico (ModalExportar)
 * Permite selecionar colunas, grupos e formatos para exportação de dados.
 */
const ModalExportar = ({ 
    isOpen, 
    onClose, 
    title, 
    data, 
    columnGroups, 
    availableColumns, 
    filenamePrefix 
}: ModalExportarProps) => {
    const { showToast } = useToast();
    const { exportTxt, exportCsv, exportXlsx, isExporting, setIsExporting } = useExportar();
    
    const [selectedFormat, setSelectedFormat] = useState('xlsx');
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
    const [exportDone, setExportDone] = useState(false);

    // Inicializar colunas selecionadas
    useEffect(() => {
        if (isOpen) {
            setSelectedColumns(availableColumns.slice(0, 10).map(c => c.key));
            setExportDone(false);
        }
    }, [isOpen, availableColumns]);

    const toggleColumn = (key: string) => {
        setSelectedColumns(prev => 
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const toggleGroup = (keys: string[]) => {
        const allSelected = keys.every(k => selectedColumns.includes(k));
        if (allSelected) {
            setSelectedColumns(prev => prev.filter(k => !keys.includes(k)));
        } else {
            setSelectedColumns(prev => [...new Set([...prev, ...keys])]);
        }
    };

    const handleExport = async () => {
        if (selectedColumns.length === 0) {
            showToast('Selecione pelo menos uma coluna.', 'warning');
            return;
        }

        setIsExporting(true);
        try {
            const cols = availableColumns.filter(c => selectedColumns.includes(c.key));
            
            if (selectedFormat === 'txt') exportTxt(data, cols, filenamePrefix);
            else if (selectedFormat === 'csv') exportCsv(data, cols, filenamePrefix);
            else if (selectedFormat === 'xlsx') exportXlsx(data, cols, filenamePrefix);

            setExportDone(true);
            setTimeout(() => {
                setExportDone(false);
                onClose();
            }, 1500);
        } catch (err) {
            showToast('Erro ao exportar dados.', 'error');
        } finally {
            setIsExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 lg:left-[280px] z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 animate-fade-in" onClick={onClose} />
            
            <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-corp-teal flex items-center justify-center shadow-lg shadow-corp-teal/20">
                            <Upload size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{data.length} registros para processar</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
                    {/* Formatos */}
                    <section>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">1. Escolha o Formato</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {FORMATS.map(f => {
                                const Icon = f.icon;
                                const isActive = selectedFormat === f.id;
                                return (
                                    <button
                                        key={f.id}
                                        onClick={() => setSelectedFormat(f.id)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${isActive ? 'bg-white border-corp-teal shadow-md shadow-corp-teal/10 scale-[1.02]' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`p-2 rounded-xl ${f.bg} ${f.color} border border-white`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-xs font-bold ${isActive ? 'text-corp-teal' : 'text-slate-500'}`}>{f.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Colunas */}
                    <section>
                        <div className="flex items-center justify-between mb-4 ml-1">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">2. Selecione as Colunas</h3>
                            <button onClick={() => setSelectedColumns(availableColumns.map(c => c.key))} className="text-[10px] font-bold text-corp-teal hover:underline">MARCAR TODAS</button>
                        </div>
                        
                        <div className="space-y-4">
                            {columnGroups.map(group => {
                                const groupCols = availableColumns.filter(c => group.keys.includes(c.key));
                                const allSelected = groupCols.every(c => selectedColumns.includes(c.key));
                                return (
                                    <div key={group.label} className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                                        <button 
                                            onClick={() => toggleGroup(group.keys)}
                                            className="w-full px-4 py-2 bg-slate-100/50 flex items-center justify-between text-left hover:bg-slate-100/80 transition-colors"
                                        >
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{group.label}</span>
                                            {allSelected ? <CheckSquare size={14} className="text-corp-teal" /> : <Square size={14} className="text-slate-300" />}
                                        </button>
                                        <div className="p-3 grid grid-cols-2 gap-1.5">
                                            {groupCols.map(col => {
                                                const isChecked = selectedColumns.includes(col.key);
                                                return (
                                                    <button
                                                        key={col.key}
                                                        onClick={() => toggleColumn(col.key)}
                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${isChecked ? 'text-corp-teal bg-white border-white shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
                                                    >
                                                        {isChecked ? <CheckSquare size={12} /> : <Square size={12} />}
                                                        <span className="truncate">{col.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="px-8 py-6 border-t border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <div className="text-[11px] font-bold text-slate-400 flex flex-col">
                        <span>{selectedColumns.length} colunas</span>
                        <span>selecionadas</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 font-bold text-xs hover:bg-slate-50 transition-colors">CANCELAR</button>
                        <button
                            onClick={handleExport}
                            disabled={isExporting || exportDone || selectedColumns.length === 0}
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-lg active:scale-95 ${exportDone ? 'bg-emerald-500' : 'bg-corp-teal hover:bg-corp-teal-hover shadow-corp-teal/20 disabled:opacity-50'}`}
                        >
                            {isExporting ? <Loader2 size={16} className="animate-spin" /> : exportDone ? <CheckCircle2 size={16} /> : <Upload size={16} />}
                            {isExporting ? 'EXPORTANDO...' : exportDone ? 'CONCLUÍDO!' : 'EXPORTAR'}
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ModalExportar;
