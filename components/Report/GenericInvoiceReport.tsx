import React, { forwardRef } from 'react';
import A4PrintContainer from './A4PrintContainer';

/**
 * GenericInvoiceReport
 * Modelo de relatório portado da Proposta Comercial.
 * Pode ser injetado em qualquer tela e impresso usando o 'react-to-print'.
 */

interface CompanyAddress {
  street: string; 
  number: string; 
  neighborhood: string;
  city: string; 
  state: string; 
  zip_code: string;
}

interface InvoiceCompany {
  company_name:         string;
  document:             string;
  state_registration?:  string;
  phone?:               string;
  email?:               string;
  logo_url?:            string | null;
  address?:             CompanyAddress;
}

interface InvoiceItem {
  isEmpty?:    boolean;
  isSpecial?:  boolean;
  text?:       string;
  name?:       string;
  sku?:        string;
  quantity?:   number;
  unit_price?: number;
  total?:      number;
}

interface InvoicePayment {
  description:       string;
  installments:      number;
  installment_value: number;
  total:             number;
}

interface GenericInvoiceReportProps {
  title?:        string;
  company?:      InvoiceCompany;
  client?:       any | null;
  items?:        InvoiceItem[];
  specialLines?: Record<string, string>;
  payments?:     InvoicePayment[];
  conditions?:   Record<string, unknown>;
  footerNote?:   string;
  totalAmount?:  number;
  freightPrice?: number;
  salesperson?:  string;
}

const GenericInvoiceReport = forwardRef<HTMLDivElement, GenericInvoiceReportProps>(({
    title = 'RELATÓRIO COMERCIAL',
    company = {
        company_name: 'Minha Empresa',
        document: '00.000.000/0000-00',
        state_registration: 'ISENTO',
        phone: '0800 000 0000',
        email: 'contato@minhaempresa.com.br',
        address: {
            street: 'Rua Exemplo',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zip_code: '00000-000'
        }
    },
    client = null,
    items = [],
    specialLines = {},
    payments = [],
    conditions = {},
    footerNote = '',
    totalAmount = 0,
    freightPrice = 0,
    salesperson = ''
}, ref) => {
    
    const issueDate = new Date();
    
    // Fallback date formatter since date-fns might not be installed
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).format(date);
    };

    const formatCurrency = (val: number | undefined) => new Intl.NumberFormat('pt-BR', {
        style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2
    }).format(val || 0);

    const formatDocument = (doc: string) => {
        if (!doc) return '-';
        const cleaned = doc.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cleaned.length === 14) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        return doc;
    };

    // Build rows ensuring 10 rows structure roughly
    const buildRows = (): InvoiceItem[] => {
        const result: InvoiceItem[] = [];
        let itemIndex = 0;

        for (let i = 0; i < Math.max(10, items.length); i++) {
            if (i === 4 && specialLines.line5) {
                result.push({ isSpecial: true, text: specialLines.line5 });
            } else if (i === 5 && specialLines.line6) {
                result.push({ isSpecial: true, text: specialLines.line6 });
            } else if (itemIndex < items.length) {
                result.push(items[itemIndex]);
                itemIndex++;
            } else {
                result.push({ isEmpty: true });
            }
        }
        return result;
    };

    const rows = buildRows();

    return (
        <A4PrintContainer className="text-[10px]" ref={ref}>
            <div className="flex-1 flex flex-col justify-between h-full bg-white text-black">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="w-1/3 pt-1">
                        {company.logo_url && (
                            <img src={company.logo_url} alt="Logo" className="h-14 object-contain" />
                        )}
                        {!company.logo_url && <h1 className="text-xl font-bold tracking-tighter text-black">{company.company_name}</h1>}
                    </div>
                    
                    <div className="w-2/3 text-right">
                        <h2 className="text-[13px] font-bold mb-1 uppercase text-black">{title}</h2>
                        <p className="font-bold text-[11px] text-black">{company.company_name}</p>
                        <p className="text-[11px] text-black">
                            CNPJ.: {company.document} 
                            &nbsp;&nbsp; 
                            INSCRIÇÃO.: {company.state_registration}
                        </p>
                        <div className="mt-2 text-[10px] italic flex justify-end gap-1 text-black">
                            <span className="font-bold">DATA / HORA:</span>
                            <span>{formatDate(issueDate)}</span>
                        </div>
                    </div>
                </div>

                {/* Client Info */}
                {client && (
                    <div className="mb-4 border border-slate-400">
                        <div className="flex border-b border-slate-400 bg-[#f2f2f2]">
                            <div className="w-2/3 border-r border-slate-400 flex items-center p-[6px_8px]">
                                <span className="text-[10px] whitespace-nowrap">Razão Social.......: </span> 
                                <span className="text-[10px] ml-1 truncate">{client.name}</span>
                            </div>
                            <div className="w-1/3 flex items-center p-[6px_8px]">
                                <span className="text-[10px] whitespace-nowrap">{client.type === 'pf' ? 'CPF' : 'CNPJ'}.............: </span> 
                                <span className="text-[10px] ml-1">{formatDocument(client.document)}</span>
                            </div>
                        </div>
                        <div className="flex bg-[#f2f2f2]">
                            <div className="w-2/3 border-r border-slate-400 flex items-center p-[6px_8px]">
                                <span className="text-[10px] whitespace-nowrap">Contato.............: </span> 
                                <span className="text-[10px] ml-1 truncate">{client.contact_name || '-'}</span>
                            </div>
                            <div className="w-1/3 flex items-center p-[6px_8px]">
                                <span className="text-[10px] whitespace-nowrap">Email.............: </span> 
                                <span className="text-[10px] ml-1 truncate">{client.email || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Items Table */}
                <div className="mb-4">
                    <table className="w-full border-collapse border border-slate-400 text-[10px]">
                        <thead>
                            <tr className="bg-[#d9d9d9]">
                                <th className="border border-slate-400 p-1 w-8 text-center font-bold text-black h-6"></th>
                                <th className="border border-slate-400 p-1 text-center font-bold text-black h-6">ITEM / DESCRIÇÃO</th>
                                <th className="border border-slate-400 p-1 w-10 text-center font-bold text-black h-6">QT</th>
                                <th className="border border-slate-400 p-1 w-24 text-center font-bold text-black h-6">UNIT (R$)</th>
                                <th className="border border-slate-400 p-1 w-24 text-center font-bold text-black h-6">TOTAL (R$)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((item, index) => (
                            <tr key={index} style={{ height: '20px' }}>
                                <td className="border border-slate-400 text-center font-bold bg-[#f2f2f2] p-[4px_2px]">
                                    {(index + 1).toString().padStart(2, '0')}
                                </td>
                                <td className="border border-slate-400 p-[4px_8px]">
                                    {item.isEmpty ? '' : item.isSpecial ? (
                                        <span className={'text-center block font-bold text-[11px] text-red-600'}>
                                            {item.text}
                                        </span>
                                    ) : (
                                        <>
                                            <span className="font-medium text-black">{item.name}</span>
                                            {item.sku && <span className="text-slate-600 ml-2">({item.sku})</span>}
                                        </>
                                    )}
                                </td>
                                <td className="border border-slate-400 text-center p-[4px_2px]">
                                    {(item.isEmpty || item.isSpecial) ? '' : String(item.quantity).padStart(2, '0')}
                                </td>
                                <td className="border border-slate-400 text-right p-[4px_8px]">
                                    {(item.isEmpty || item.isSpecial) ? '' : formatCurrency(item.unit_price)}
                                </td>
                                <td className="border border-slate-400 text-right p-[4px_8px]">
                                    {(item.isEmpty || item.isSpecial) ? '' : formatCurrency(item.total)}
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-[#f2f2f2]">
                                <td colSpan={3} className="border border-slate-400 text-center p-[4px_8px]">
                                    {footerNote}
                                </td>
                                <td className="border border-slate-400 text-right font-bold p-[4px_8px] text-black uppercase">
                                    FRETE Opcional
                                </td>
                                <td className="border border-slate-400 text-right font-bold text-black p-[4px_8px]">
                                    R$ {formatCurrency(freightPrice)}
                                </td>
                            </tr>
                            <tr className="bg-[#e4e4e4]">
                                <td colSpan={4} className="border border-slate-400 text-right font-bold p-[4px_8px] text-black uppercase text-[11px]">
                                    TOTAL GERAL
                                </td>
                                <td className="border border-slate-400 text-right font-black text-black p-[4px_8px] text-[11px]">
                                    R$ {formatCurrency(totalAmount)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Payments */}
                {payments.length > 0 && (
                    <div className="mb-4">
                        <div className="text-center font-bold mb-1 text-[11px] uppercase text-black">
                            CONDIÇÕES DE PAGAMENTO (RESUMO)
                        </div>
                        <div className="border border-slate-400">
                            <table className="w-full text-[10px]">
                                <tbody>
                                    {payments.map((opt, index) => (
                                        <tr key={index} className={`border-b border-slate-300 ${index % 2 === 0 ? 'bg-[#f2f2f2]' : ''}`}>
                                            <td className="p-1 px-2 w-1/2 uppercase border-r border-slate-300 h-6 align-middle">{opt.description}</td>
                                            <td className="p-1 px-2 h-6 align-middle">
                                                {opt.installments > 1 ? (
                                                    <div className="flex justify-end items-center gap-1">
                                                        <span className="w-8 text-right">{opt.installments}X</span>
                                                        <span className="w-20 text-right">R$ {formatCurrency(opt.installment_value)}</span>
                                                        <span className="font-bold w-20 text-right text-black">R$ {formatCurrency(opt.total)}</span>
                                                    </div>
                                                ) : (
                                                    <div className="font-bold text-right text-black">R$ {formatCurrency(opt.total)}</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Footer Fix */}
                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <div>
                            <p className="font-bold text-[10px] text-black">{salesperson}</p>
                            <p className="text-[9px] underline text-blue-700">{company.email}</p>
                        </div>
                        <div className="text-right">
                            {/* Assinatura ou espaço de data de expiração se quiser */}
                        </div>
                    </div>

                    <div className="border border-slate-400 bg-[#f2f2f2] p-3 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-[10px] mb-0.5 text-black">ESCRITÓRIO COMERCIAL</h3>
                            <p className="text-[9px] text-slate-700 leading-snug">
                                {company.address?.street ? `${company.address.street}, ${company.address.number}` : ''}
                            </p>
                            <p className="text-[9px] text-slate-700 leading-snug">
                                {company.address?.neighborhood ? `${company.address.neighborhood} - ${company.address.city}/${company.address.state} - CEP ${company.address.zip_code}` : ''}
                            </p>
                        </div>

                        <div className="text-right flex flex-col items-end">
                            <h2 className="text-[11px] font-bold leading-none text-black">TELEFONE CENTRAL</h2>
                            <h1 className="text-xl font-black leading-none tracking-tight text-black">{company.phone}</h1>
                        </div>
                    </div>
                </div>
            </div>
        </A4PrintContainer>
    );
});

GenericInvoiceReport.displayName = 'GenericInvoiceReport';

export default GenericInvoiceReport;
