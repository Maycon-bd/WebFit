import React from 'react';

interface ReportCompany {
    name?: string;
    logo?: string | null;
    cnpj?: string;
    codigo?: string | number;
}

interface ReportPageProps {
    children: React.ReactNode;
    pageNumber: number;
    totalPages: number;
    company?: ReportCompany;
    title?: string;
    user?: string;
    emitidoEm?: string;
    path?: string;
    filters?: string;
    raw?: boolean;
}

/**
 * ReportPage
 * Um componente que representa uma única folha A4 física.
 * Garante que o cabeçalho e rodapé sejam renderizados exatamente nesta página.
 */
const ReportPage: React.FC<ReportPageProps> = ({
    children,
    pageNumber,
    totalPages,
    company = {},
    title = '',
    user = '',
    emitidoEm = '',
    path = '',
    filters = '',
    raw = false
}) => {
    if (raw) {
        return (
            <div className="report-page bg-white shadow-lg mx-auto mb-8 print:shadow-none print:mb-0 relative border border-slate-100 print:border-0"
                style={{ width: '210mm', minHeight: '297mm', padding: '5mm 5mm', boxSizing: 'border-box' }}>
                {children}
            </div>
        );
    }

        const isLastPage = pageNumber === totalPages;

        return (
            <div className="report-page bg-white shadow-lg mx-auto mb-8 print:shadow-none print:mb-0 relative select-none"
                style={{ 
                    width: '210mm', 
                    height: isLastPage ? 'auto' : '297mm', 
                    minHeight: isLastPage ? '297mm' : 'auto',
                    padding: '10mm 10mm', 
                    boxSizing: 'border-box' 
                }}>

                {/* Única Moldura Contínua do Relatório */}
                <div className={`flex flex-col border-2 border-slate-800 bg-white w-full relative ${isLastPage ? 'h-auto pb-8' : 'h-full'}`}>

                {/* Cabeçalho da Página (Apenas na primeira página) */}
                {pageNumber === 1 && (
                    <div className="flex items-center font-normal border-b border-slate-800 p-3 bg-white w-full">
                        <div className="w-1/4 text-left pr-4">
                            <img
                                src={company.logo || '/logo_volus.png'}
                                alt="Logo"
                                className="max-h-9 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/logo_volus.png';
                                }}
                            />
                        </div>

                        <div className="w-2/4 flex flex-col items-center justify-center border-x border-slate-800 px-4 py-1">
                            <h1 className="text-xs font-bold text-slate-800 uppercase text-center mb-1">{title}</h1>
                            {company.name && (
                                <div className="text-[9px] text-slate-750 font-bold text-center uppercase mb-0.5">
                                    {company.name}
                                </div>
                            )}
                            {company.cnpj && (
                                <div className="text-[8px] text-slate-700 font-bold mb-0.5">
                                    CNPJ: {company.cnpj}
                                </div>
                            )}
                            <div className="text-[8px] text-slate-500 font-medium truncate w-full text-center">
                                {company.codigo ? `Cód. Empresa: ${company.codigo}` : ''}
                            </div>
                        </div>

                        <div className="w-1/4 text-right text-[9px] text-slate-500 flex flex-col items-end pl-4 justify-center">
                            <span className="mb-0.5 whitespace-nowrap">Emitido por: <strong className="text-slate-700">{user}</strong></span>
                            <span className="whitespace-nowrap">{emitidoEm}</span>
                        </div>
                    </div>
                )}

                {/* Filtros Aplicados (Apenas na primeira página) */}
                {filters && pageNumber === 1 && (
                    <div className="flex gap-2 items-center font-normal text-left text-[9px] text-slate-700 py-1.5 px-3 border-b border-slate-800 bg-slate-50/50 w-full">
                        <strong className="text-slate-800 whitespace-nowrap uppercase text-[9px]">Filtros aplicados:</strong>
                        <span className="truncate">{filters}</span>
                    </div>
                )}

                {/* Conteúdo da Página */}
                <div className="report-content flex-1 py-3 px-0 overflow-hidden">
                    {children}
                </div>

                {/* Rodapé da Página */}
                <div className="absolute bottom-0 left-0 right-0 h-8 flex justify-between items-center text-[8px] text-slate-400 border-t border-slate-800 px-3 bg-white">
                    <span>SAV WEB - Sistema Águia Vólus</span>
                    <div className="flex items-center gap-4">
                        <span>{emitidoEm}</span>
                        <span className="font-bold text-slate-750 bg-slate-100 px-2 py-0.5 rounded-none border border-slate-300">Pág. {pageNumber} de {totalPages}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
