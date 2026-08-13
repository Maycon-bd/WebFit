import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Download, FileText } from 'lucide-react';
import { loadReport, getReportStatusKey, hasReportData } from '../services/reportStorage';

interface ReportConfig {
  type:    string;
  data:    any;
  filtros?: string;
  label?:  string;
}

// Nomes legíveis para exibir na barra do viewer.
const reportLabels: Record<string, string> = {    
    'Fomento':             'Fomento',
    'Conveniadas':         'Conveniadas',
};

/**
 * Visualizador de Relatórios PDF
 *
 * Fluxo:
 *   localStorage → parse → 500ms → pdf().toBlob() → blobUrl → <iframe>
 */
const RelatorioViewer: React.FC = () => {
    const [config, setConfig]           = useState<ReportConfig | null>(null);
    const [error, setError]             = useState<string | null>(null);
    const [isPreparing, setIsPreparing] = useState<boolean>(true);   // lendo localStorage
    const [isGenerating, setIsGenerating] = useState<boolean>(false); // gerando blob
    const [blobUrl, setBlobUrl]         = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reportId = urlParams.get('id');

        if (!reportId) {
            setError('Nenhum ID de relatório fornecido na URL.');
            setIsPreparing(false);
            return;
        }

        const statusKey = getReportStatusKey(reportId);

        const doLoad = () => {
            loadReport(reportId)
                .then(parsed => {
                    if (!parsed) { setError('Nenhum dado de relatório encontrado.'); setIsPreparing(false); return; }
                    const cfg = parsed as ReportConfig;
                    if (!hasReportData(cfg.data)) {
                        setError('Não há dados para imprimir.');
                        setIsPreparing(false);
                        return;
                    }
                    setConfig(cfg);
                    document.title = `Imprimir — ${cfg.label ?? cfg.type}`;
                })
                .catch(e => {
                    setError('Erro ao carregar ou processar os dados do relatório.');
                    setIsPreparing(false);
                    console.error(e);
                });
        };

        const status = localStorage.getItem(statusKey);

        if (status === 'ready') {
            doLoad();
            return;
        }

        if (status?.startsWith('error:')) {
            setError(status.slice(6) || 'Erro ao gerar o relatório.');
            setIsPreparing(false);
            return;
        }

        // Aguarda o sinal via evento storage (gerado pela aba que está preparando os dados)
        const handler = (e: StorageEvent) => {
            if (e.key !== statusKey) return;
            if (e.newValue === 'ready') {
                doLoad();
            } else if (e.newValue?.startsWith('error:')) {
                setError(e.newValue.slice(6) || 'Erro ao gerar o relatório.');
                setIsPreparing(false);
            }
        };

        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, []);

    // Após carregar a config, aguarda 500ms e gera o blob assincronamente
    useEffect(() => {
        if (!config) return;

        let cancelled = false;
        let objectUrl: string | null = null;

        const generate = async () => {
            // Pequeno delay para a UI respirar antes da geração
            await new Promise(r => setTimeout(r, 500));
            if (cancelled) return;

            setIsPreparing(false);
            setIsGenerating(true);

            try {
                const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });
                
                worker.onmessage = (e) => {
                    if (cancelled) { worker.terminate(); return; }
                    if (e.data.success) {
                        objectUrl = URL.createObjectURL(e.data.blob);
                        setBlobUrl(objectUrl);
                        setIsGenerating(false);
                    } else {
                        setError(e.data.error || 'Erro ao gerar o PDF. Tente novamente ou reduza o número de registros.');
                        console.error('[RelatorioViewer] Erro no Worker de PDF:', e.data.error);
                        setIsGenerating(false);
                    }
                    worker.terminate();
                };

                worker.onerror = (err) => {
                    if (cancelled) { worker.terminate(); return; }
                    setError('Erro crítico ao executar o Worker de PDF.');
                    console.error('[RelatorioViewer] Erro não tratado no Worker:', err);
                    setIsGenerating(false);
                    worker.terminate();
                };

                worker.postMessage({ 
                    type: config.type, 
                    data: config.data, 
                    filtros: config.filtros,
                    lsData: {
                        sav_company_cnpj: localStorage.getItem('sav_company_cnpj'),
                        sav_company_name: localStorage.getItem('sav_company_name'),
                        sav_user_name: localStorage.getItem('sav_user_name'),
                        sav_user_id: localStorage.getItem('sav_user_id'),
                        sav_company_id: localStorage.getItem('sav_company_id')
                    }
                });
            } catch (e) {
                if (!cancelled) {
                    setError('Falha ao iniciar o processo em background (Web Worker).');
                    console.error('[RelatorioViewer] Erro ao instanciar Worker:', e);
                    setIsGenerating(false);
                }
            }
        };

        generate();

        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [config]);

    // ── Estados de erro ───────────────────────────────────────────────────────
    if (error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900 p-10 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-3">Falha na Visualização</h2>
                <p className="max-w-md text-slate-200 text-sm leading-relaxed">{error}</p>
                <button
                    onClick={() => window.close()}
                    className="mt-6 px-6 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors font-semibold border border-white/5"
                >
                    Fechar Aba
                </button>
            </div>
        );
    }

    // ── Carregando config do localStorage ─────────────────────────────────────
    if (isPreparing) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1e293b] text-white gap-4">
                <Loader2 size={48} className="animate-spin text-teal-400" />
                <h2 className="text-lg font-bold tracking-tight animate-pulse">Carregando dados...</h2>
            </div>
        );
    }

    // ── Gerando PDF (toBlob assíncrono) ───────────────────────────────────────
    if (isGenerating) {
        const totalTitulos = config?.data?.grupos
            ? (config.data.grupos as any[]).reduce((s: number, g: any) => {
                // a_pagar_pagas: g.linhas direto
                if (Array.isArray(g.linhas)) return s + g.linhas.length;
                // pagamento_financeiro: g.grupos[].linhas
                if (Array.isArray(g.grupos)) return s + (g.grupos as any[]).reduce((ss: number, tg: any) => ss + (tg.linhas?.length || 0), 0);
                return s;
              }, 0)
            : (Array.isArray(config?.data?.rows) ? config.data.rows.length : 0);
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-[#1e293b] text-white gap-4">
                <div className="relative">
                    <FileText size={48} className="text-teal-400/30" />
                    <Loader2 size={24} className="animate-spin text-teal-400 absolute -bottom-1 -right-1" />
                </div>
                <h2 className="text-lg font-bold tracking-tight">Gerando PDF...</h2>
                <p className="text-sm text-slate-400">
                    {config?.label ?? reportLabels[config?.type ?? ''] ?? config?.type}
                    {totalTitulos > 0 ? ` · ${totalTitulos.toLocaleString('pt-BR')} registros` : ''}
                </p>
                {totalTitulos > 1000 && (
                    <p className="text-xs text-amber-400/80 max-w-sm text-center">
                        Relatório grande — a geração pode levar alguns minutos. Aguarde sem fechar esta aba.
                    </p>
                )}
            </div>
        );
    }

    // ── PDF pronto — exibe iframe + barra de ações ────────────────────────────
    return (
        <div className="h-screen w-full bg-slate-800 flex flex-col overflow-hidden">

            {/* Barra superior */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shadow-2xl z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
                            Motor de Impressão SAV
                        </span>
                        <span className="text-sm font-bold text-slate-100">
                            {config?.label ?? reportLabels[config?.type ?? ''] ?? config?.type} — <span className="text-teal-400">PDF Pronto</span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Registros</span>
                        <span className="text-sm font-mono text-slate-300">{config?.data?.length || 0}</span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-700 mx-1" />
                    {blobUrl && (
                        <a
                            href={blobUrl}
                            download={`${config?.label ?? reportLabels[config?.type ?? ''] ?? config?.type ?? 'relatorio'}.pdf`}
                            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-teal-400 transition-colors uppercase tracking-widest"
                        >
                            <Download size={14} /> Download
                        </a>
                    )}
                    <button
                        onClick={() => window.close()}
                        className="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest"
                    >
                        Fechar
                    </button>
                </div>
            </div>

            {/* iframe com o PDF nativo do browser */}
            <div className="flex-1 relative">
                {blobUrl && (
                    <iframe
                        src={blobUrl}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Relatório PDF"
                    />
                )}
            </div>
        </div>
    );
};

export default RelatorioViewer;
