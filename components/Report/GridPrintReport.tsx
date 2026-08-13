import React, { forwardRef } from 'react';

interface GridPrintReportCompany {
  name?:   string;
  logo?:   string | null;
  cnpj?:   string;
  codigo?: string | number;
}

interface GridPrintReportColumn {
  field:   string;
  label:   string;
  width?:  string;
  align?:  'left' | 'center' | 'right';
  render?: (row: any) => React.ReactNode;
}

interface GridPrintReportProps {
  title?:    string;
  company?:  GridPrintReportCompany;
  user?:     string | null;
  filters?:  string | null;
  columns?:  GridPrintReportColumn[];
  data?:     any[];
  path?:     string;
}

const GridPrintReport = forwardRef<HTMLDivElement, GridPrintReportProps>(({
    title = 'Relatório',
    company = { name: 'SAV - Sistema Águia Vólus', logo: null, cnpj: '', codigo: '' },
    user = null,
    filters = null,
    columns = [],
    data = [],
    path = ''
}, ref) => {
    
    const loggedUser = user || (() => {
        const name = localStorage.getItem('sav_user_name');
        return name || 'Valteir Costa';
    })();
    
    // Obter empresa logada do localStorage (sav_selected_company)
    const loggedCompany = (() => {
        try {
            const empData = localStorage.getItem('sav_selected_company');
            if (empData) {
                const parsed = JSON.parse(empData);
                return {
                    name: parsed.razao_social || parsed.nome || parsed.nome_fantasia || company.name,
                    cnpj: parsed.cnpj || company.cnpj,
                    codigo: parsed.id || parsed.id_sav_adm_empresa || parsed.codigo || company.codigo,
                    logo: company.logo
                };
            }
        } catch(_e: unknown) {}
        return company;
    })();
    
    // Formatar data/hora atual
    const now = new Date();
    const emitidoEm = now.toLocaleDateString('pt-BR') + ' às ' + now.toLocaleTimeString('pt-BR');

    return (
        <div style={{ display: 'none' }}>
            <div ref={ref}>
                <div className="print-report-container bg-white text-black font-sans leading-tight">
                    <style>
                        {`
                           @media print {
                               @page { 
                                   size: A4 portrait; 
                                   margin: 15mm 15mm 15mm 15mm !important; /* Margem física forçada */
                               }
                               html, body { 
                                   -webkit-print-color-adjust: exact !important; 
                                   print-color-adjust: exact !important; 
                                   margin: 0 !important;
                                   padding: 0 !important;
                               }
                               body {
                                   counter-reset: page 0; /* Reset para 0 para que o primeiro increment resulte em 1 */
                               }
                               table { 
                                   width: 100% !important; 
                                   border-collapse: collapse !important;
                                   page-break-inside: auto; 
                               }
                               thead { 
                                   display: table-header-group !important;
                               }
                               tfoot { 
                                   display: table-footer-group !important; 
                               }
                               tr { 
                                   page-break-inside: avoid !important; 
                                   page-break-after: auto !important; 
                               }
                               
                               .print-report-container {
                                   width: 100% !important;
                                   margin: 0 !important;
                                   padding: 0 !important;
                               }
                               
                               /* Pagination hacking for Chrome */
                               .page-number::after {
                                   counter-increment: page;
                                   content: counter(page);
                               }
                               
                               .total-pages::after {
                                   /* Fallback: counter(pages) raramente funciona no Chrome fora do @page { content } */
                                   /* Usaremos o valor injetado via JS se counter(pages) falhar */
                                   content: counter(pages);
                               }
                               
                               /* Se counter(pages) for 0, podemos tentar ocultar ou mostrar o estimado */
                               .total-pages:empty::after, [data-total="0"] .total-pages::after {
                                   content: "${Math.max(1, Math.ceil(data.length / (data.length > 20 ? 28 : 20)))}";
                               }
                           }
                           
                           .print-table th { background-color: #f8fafc !important; }
                           .print-row:nth-child(even) { background-color: #f8fafc !important; }
                           .print-card {
                               border: 1px solid #e2e8f0;
                               border-radius: 8px;
                               padding: 12px;
                               margin-bottom: 12px;
                               background-color: white;
                               page-break-inside: avoid;
                           }
                        `}
                    </style>

                    {/* Tabela de Dados com Cabeçalho Repetitivo */}
                    <div className="flex-1 w-full relative">
                        <table className="text-left text-[10px] text-slate-700 print-table border-collapse">
                            <thead>
                                <tr>
                                    <th colSpan={columns.length} className="bg-white !bg-white p-0 border-0 pt-2 pb-2">
                                        
                                        {/* Card 1: Header */}
                                        <div className="print-card flex items-center font-normal">
                                            <div className="w-1/4 text-left pr-4">
                                                {loggedCompany.logo ? (
                                                    <img src={loggedCompany.logo} alt="Logo" className="max-h-14 object-contain" />
                                                ) : (
                                                    <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">{loggedCompany.name}</h2>
                                                )}
                                            </div>
                                            
                                            <div className="w-2/4 flex flex-col items-center justify-center border-x border-slate-200 px-4 py-2">
                                                <h1 className="text-sm font-bold text-slate-800 uppercase text-center mb-1">{title}</h1>
                                                {loggedCompany.cnpj && (
                                                    <div className="text-[10px] text-slate-800 font-bold mb-0.5">
                                                        CNPJ: {loggedCompany.cnpj}
                                                    </div>
                                                )}
                                                <div className="text-[10px] text-slate-800 font-bold truncate w-full text-center">
                                                    {loggedCompany.codigo ? `${String(loggedCompany.codigo).padStart(4, '0')} — ` : ''}{loggedCompany.name}
                                                </div>
                                            </div>

                                            <div className="w-1/4 text-right text-[10px] text-slate-600 flex flex-col items-end pl-4 justify-center">
                                                <span className="mb-0.5">Emitido por: <strong className="text-slate-800">{loggedUser}</strong></span>
                                                <span className="mb-1">{emitidoEm}</span>
                                                <span className="font-medium text-slate-500" data-total={data.length}>
                                                    Pág. <span className="page-number"></span> de <span className="total-pages"></span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rota do Relatório / Breadcrumb */}
                                        {path && (
                                            <div className="text-[9px] text-slate-400 mb-1 px-1 font-normal text-left italic">
                                                {path}
                                            </div>
                                        )}

                                        {/* Card 2: Filtros */}
                                        {filters && (
                                            <div className="print-card flex gap-2 items-center font-normal text-left text-[11px] text-slate-700 py-2">
                                                <strong className="text-slate-800 whitespace-nowrap uppercase text-[10px]">Filtros aplicados:</strong> 
                                                <span className="truncate">{filters}</span>
                                            </div>
                                        )}
                                    </th>
                                </tr>
                                
                                {/* Card 3 interno (Colunas) */}
                                <tr>
                                    {columns.map((col, idx) => {
                                        const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                                        return (
                                            <th 
                                                key={idx} 
                                                className={`border border-slate-200 py-2 px-3 font-bold text-slate-800 text-[10px] uppercase tracking-wider bg-slate-50 shadow-sm ${alignClass} 
                                                ${idx === 0 ? 'rounded-tl-lg' : ''} 
                                                ${idx === columns.length - 1 ? 'rounded-tr-lg' : ''}`}
                                            >
                                                {col.label}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border border-t-0 border-slate-200">
                                {data.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="print-row border-b border-slate-100">
                                        {columns.map((col, colIdx) => {
                                            const alignClass = col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                                            return (
                                                <td key={colIdx} className={`py-1.5 px-2 ${alignClass}`}>
                                                    {typeof col.render === 'function' ? col.render(row) : (row[col.field] ?? '-')}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length} className="py-6 text-center text-slate-500 italic bg-slate-50">
                                            Nenhum registro encontrado para impressão.
                                        </td>
                                    </tr>
                                )}
                                {data.length > 0 && (
                                    <tr>
                                        <td colSpan={columns.length} className="py-3 px-2 text-right font-bold text-slate-800 border-t-2 border-slate-300 bg-white">
                                            Total de Registros: {data.length}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
});

GridPrintReport.displayName = 'GridPrintReport';

export default GridPrintReport;
