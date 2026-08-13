import './worker-polyfills';
import React from 'react';
import { pdf } from '@react-pdf/renderer';

// @ts-ignore
import RelatorioFomento from '../pages/Fom/Relatorio/RelatorioFomentoPDF';
import RelatorioConveniadas from '../pages/Cnv/Relatorio/RelatorioConveniadasPDF';
import RelatorioConveniadasAparPagasPDF from '../pages/Cnv/Relatorio/RelatorioConveniadasAparPagasPDF';
import RelatorioConveniadasPagamentoFinanceiroPDF from '../pages/Cnv/Relatorio/RelatorioConveniadasPagamentoFinanceiroPDF';

// Novos Relatórios Migrados
import DanfePDF from '../pages/Cpr/ConfrontoNFe/components/DanfePDF';
import DanfeNFSePDF from '../pages/Cpr/ConfrontoNFSe/components/DanfeNFSePDF';
import DactePDF from '../pages/Cpr/ConfrontoCTe/components/DactePDF';

type ReportComponent = React.ComponentType<{ data: any; filtros?: string }>;
type ReportRegistry  = Record<string, ReportComponent>;

const reports: ReportRegistry = {    
    'Fomento':              RelatorioFomento as ReportComponent,
    'Conveniadas':          RelatorioConveniadas as unknown as ReportComponent,
    'ConveniadasAparPagas':              RelatorioConveniadasAparPagasPDF as unknown as ReportComponent,
    'ConveniadasPagamentoFinanceiro':    RelatorioConveniadasPagamentoFinanceiroPDF as unknown as ReportComponent,
    'Danfe':                DanfePDF as unknown as ReportComponent,
    'DanfeNFSe':            DanfeNFSePDF as unknown as ReportComponent,
    'Dacte':                DactePDF as unknown as ReportComponent,
};

self.onmessage = async (e: MessageEvent) => {
    try {
        const { type, data, filtros, lsData } = e.data;
        
        // Popula o localStorage mockado com os dados da main thread
        if (lsData) {
            for (const [k, v] of Object.entries(lsData)) {
                if (v !== null && v !== undefined) {
                    (globalThis as any).localStorage.setItem(k, String(v));
                }
            }
        }

        const SpecificReport = reports[type];
        
        if (!SpecificReport) {
            self.postMessage({ success: false, error: `O tipo de relatório "${type}" ainda não foi migrado para o novo visualizador.` });
            return;
        }

        const element = React.createElement(SpecificReport, { data, filtros });
        const blob = await pdf(element as any).toBlob();
        
        self.postMessage({ success: true, blob });
    } catch (err: any) {
        console.error('[WebWorker PDF]', err);
        self.postMessage({ success: false, error: 'Erro ao gerar o PDF. Tente novamente ou reduza o número de registros. Detalhes: ' + err.message });
    }
};
