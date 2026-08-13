import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
    Menu, 
    Bell, 
    Clock, 
    ChevronRight, 
    Building2,
    LayoutDashboard
} from 'lucide-react';
// @ts-ignore
import { useCompany } from '../context/CompanyContext';
// @ts-ignore
import * as formatters from '../utils/formatters';

import { permissionCatalogModules as menuModules } from '../catalog/permissionCatalog';

interface GlobalHeaderProps {
  onMobileMenuOpen: () => void;
}

interface Breadcrumb {
  label: string;
  path:  string;
  icon?: React.ReactNode;
}

// Mapeamento dinâmico gerado a partir das definições dos módulos do Sidebar
const routeMap: Record<string, { moduleLabel: string; screenLabel: string }> = {};

menuModules.forEach(mod => {
    Object.values(mod.funcionalidades).forEach(func => {
        if (func.route) {
            routeMap[func.route] = {
                moduleLabel: mod.label,
                screenLabel: func.label
            };
        }
    });
});

// Aliases ou rotas secundárias que não possuem funcionalidade direta no menu
const fallbackRouteMap: Record<string, { moduleLabel: string; screenLabel: string }> = {
    '/contabilidade/tipo-imposto': { moduleLabel: 'Contabilidade', screenLabel: 'Tipo de Imposto' },
    '/contabilidade/tabela-impostos': { moduleLabel: 'Contabilidade', screenLabel: 'Tabela de Impostos' },
    '/cpr/pagamento-conveniada': { moduleLabel: 'Conveniadas', screenLabel: 'Pagamento' },
    '/conv/pagamento-conveniada': { moduleLabel: 'Conveniadas', screenLabel: 'Pagamento' },
};

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onMobileMenuOpen }) => {
    const location = useLocation();
    const { selectedCompany } = useCompany() as { selectedCompany: any };
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getBreadcrumbs = (): Breadcrumb[] => {
        const path = location.pathname;
        const crumbs: Breadcrumb[] = [{ label: 'Principal', path: '/', icon: <LayoutDashboard size={14} /> }];

        if (path === '/') return crumbs;

        const info = routeMap[path] || fallbackRouteMap[path];

        if (info) {
            crumbs.push({ label: info.moduleLabel, path: '#' });
            crumbs.push({ label: info.screenLabel, path: path });
        } else {
            // Fallback por prefixo de rota se a rota não estiver mapeada no menu
            if (path.startsWith('/adm/') || path.startsWith('/administrativo/')) {
                crumbs.push({ label: 'Administrativo', path: '#' });
            } else if (path.startsWith('/cpr/')) {
                crumbs.push({ label: 'Compras', path: '#' });
            } else if (path.startsWith('/bco/')) {
                crumbs.push({ label: 'Bancário', path: '#' });
            } else if (path.startsWith('/fin/')) {
                crumbs.push({ label: 'Financeiro', path: '#' });
            } else if (path.startsWith('/conv/')) {
                crumbs.push({ label: 'Conveniadas', path: '#' });
            } else if (path.startsWith('/fom/')) {
                crumbs.push({ label: 'Fomento', path: '#' });
            } else if (path.startsWith('/fat-plano/')) {
                crumbs.push({ label: 'Faturamento de Plano', path: '#' });
            } else if (path.startsWith('/fat-nf/')) {
                crumbs.push({ label: 'Faturamento de NF\'s', path: '#' });
            } else if (path.startsWith('/rec-cliente/')) {
                crumbs.push({ label: 'Recebimento de Clientes', path: '#' });
            } else if (path.startsWith('/boleto/')) {
                crumbs.push({ label: 'Boleto', path: '#' });
            } else if (path.startsWith('/comissao/')) {
                crumbs.push({ label: 'Comissão', path: '#' });
            } else if (path.startsWith('/contabilidade/')) {
                crumbs.push({ label: 'Contabilidade', path: '#' });
            }
        }

        return crumbs;
    };

    return (
        <header className="h-[80px] bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-30 shadow-sm shrink-0 sticky top-0 transition-all">
            {/* Lado Esquerdo: Menu Mobile e Breadcrumbs */}
            <div className="flex items-center gap-4 min-w-0">
                <button 
                    className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors" 
                    onClick={onMobileMenuOpen}
                >
                    <Menu size={22} />
                </button>

                <nav className="hidden sm:flex items-center gap-2 overflow-hidden">
                    {getBreadcrumbs().map((crumb, idx, arr) => (
                        <React.Fragment key={idx}>
                            <div className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-all ${idx === arr.length - 1 ? 'text-slate-900 font-bold bg-slate-100' : 'text-slate-400 font-medium hover:text-slate-600'}`}>
                                {crumb.icon && <span className="opacity-70">{crumb.icon}</span>}
                                <span className="text-[13px] whitespace-nowrap">{crumb.label}</span>
                            </div>
                            {idx < arr.length - 1 && <ChevronRight size={14} className="text-slate-300 shrink-0" />}
                        </React.Fragment>
                    ))}
                </nav>
            </div>

            {/* Lado Direito: Empresa, Hora e Notificações */}
            <div className="flex items-center gap-3 lg:gap-6">
                
                {/* Relógio Digital Elegante */}
                <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 shadow-inner">
                    <Clock size={16} className="text-corp-teal" />
                    <span className="text-[13px] font-mono font-bold tracking-wider whitespace-nowrap">
                        {currentTime.toLocaleDateString('pt-BR')} — {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                </div>

                {/* Card da Empresa Global - Design Compacto e Premium */}
                {selectedCompany && (
                    <div className="flex items-center gap-3 bg-white p-2 pl-3 pr-4 rounded-[1.25rem] border border-slate-200 shadow-sm hover:border-corp-teal/30 transition-all group hover:shadow-md cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-corp-teal/5 flex items-center justify-center text-corp-teal shrink-0 group-hover:bg-corp-teal group-hover:text-white transition-all duration-300 shadow-sm">
                            <Building2 size={18} />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[12px] font-bold text-slate-700 truncate leading-tight transition-colors group-hover:text-corp-teal flex items-center gap-1.5">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 group-hover:bg-corp-teal/10 text-[10px] font-mono font-bold text-slate-500 group-hover:text-corp-teal shrink-0 transition-colors">
                                    {String(selectedCompany.id || '').padStart(4, '0')}
                                </span>
                                {selectedCompany.nome || selectedCompany.razao_social}
                            </span>
                            <span className="text-[10px] font-bold text-corp-teal font-mono tracking-wider opacity-80 uppercase">
                                {selectedCompany.cnpj ? formatters.formatCnpj(selectedCompany.cnpj) : 'CNPJ Pendente'}
                            </span>
                        </div>
                    </div>
                )}

                {/* Notificações */}
                <button className="relative p-2.5 text-slate-400 hover:text-corp-teal hover:bg-corp-teal/5 rounded-xl transition-all group">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-corp-green border-2 border-white rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default GlobalHeader;
