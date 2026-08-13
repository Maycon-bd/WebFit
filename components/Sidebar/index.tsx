import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ChevronDown,
    LogOut,
    Menu,
    X,
    Building2,
    Loader2,
    Settings,
} from 'lucide-react';


// @ts-ignore
import { authService } from '../../services/authService';
// @ts-ignore
import { apiService } from '../../services/apiService';
// @ts-ignore
import { useCompany } from '../../context/CompanyContext';
// @ts-ignore
import { useLoading } from '../../context/LoadingContext';
// @ts-ignore
import { useAuth } from '../../context/AuthContext';
// @ts-ignore
import { usePermissions } from '../../context/PermissionContext';

import { permissionCatalogModules as menuModules, funcionalidades } from '../../catalog/permissionCatalog';
import SidebarModule from './SidebarModule';

export { funcionalidades };

interface SidebarProps {
    isOpen: boolean;
    setMobileOpen: (v: boolean) => void;
    width: number;
    setWidth: (v: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setMobileOpen, width, setWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedCompany, setSelectedCompany, availableCompanies, setAvailableCompanies, isLoading: isContextLoading, setIsLoading: setIsContextLoading } = useCompany() as any;
    const { showLoading, hideLoading } = useLoading() as any;
    const { user } = useAuth() as any;
    const userName = user?.name || 'Usuário';
    const { podeAcessarComponente, permissionsLoaded, permMap } = usePermissions() as any;

    const [isResizing, setIsResizing] = useState(false);

    const companiesLoadedRef = useRef(false);

    // Visibilidade NEGADA POR PADRAO (arq_front_menu_permissoes.md §4)
    const itemVisivel = (slug: string) => {
        const f = funcionalidades[slug];
        if (!f) return false;                 // nao catalogado = invisivel
        if (f.publico) return true;           // placeholder/area livre
        if (!permissionsLoaded) return false; // carregando = nada aparece

        // A Tag_Web é rei! Regra única: se existir no json do banco, habilita.

        // 1. Busca a ação de "Visualizar / Acesso" e checa a tag_web dela
        const acaoVisualizar = f.acoes?.find((a: any) => a.nome.toLowerCase().includes('visualizar') || a.nome.toLowerCase().includes('acesso'));
        if (acaoVisualizar && acaoVisualizar.tag_web && podeAcessarComponente(acaoVisualizar.tag_web)) {
            return true;
        }

        const idAcaoVisualizar = acaoVisualizar?.tag ?? acaoVisualizar?.id;
        if (idAcaoVisualizar != null && podeAcessarComponente(idAcaoVisualizar)) {
            return true;
        }

        // 2. Fallback seguro: Checa a tag_web do módulo raiz caso não tenha ação detalhada
        if (f.tag_web && podeAcessarComponente(f.tag_web)) {
            return true;
        }

        if (f.componente != null && podeAcessarComponente(f.componente)) {
            return true;
        }

        return false;
    };

    const moduloVisivel = (module: typeof menuModules[0]) => {
        const slugs = module.subsections.flatMap(sub => sub.items);
        return slugs.some(itemVisivel);
    };

    const MIN_WIDTH = 200;
    const MAX_WIDTH = 450;

    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const initial: Record<string, boolean> = {};
        menuModules.forEach(m => { initial[m.id] = false; });
        setExpandedItems(initial);
    }, []);

    const startResizing = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
                setWidth(newWidth);
            }
        }
    }, [isResizing, setWidth]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResizing);
        } else {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        }
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    useEffect(() => {
        const loadCompanies = async () => {
            if (companiesLoadedRef.current) return;
            companiesLoadedRef.current = true;
            setIsContextLoading(true);
            const userId = user?.id;
            let result;
            if (userId) {
                result = await apiService.getUserProfile(userId);
            } else {
                result = await apiService.getBranches();
            }

            if (result.success && result.data) {
                let companies = result.data;
                if (!Array.isArray(companies) && companies.empresas) {
                    companies = companies.empresas;
                } else if (Array.isArray(companies) && companies.length > 0 && companies[0].empresa) {
                    const uniqueCompanies = new Map();
                    companies.forEach((item: any) => {
                        if (item.empresa) {
                            const id = item.empresa.id || item.empresa.id_sav_adm_empresa || item.empresa.id_empresa || item.empresa.empresa_id;
                            if (id !== undefined) uniqueCompanies.set(id, item.empresa);
                        }
                    });
                    companies = Array.from(uniqueCompanies.values());
                } else if (Array.isArray(companies) && companies.length > 0 && companies[0].id_sav_adm_empresa && !companies[0].id) {
                    companies = companies.map((c: any) => ({
                        ...c,
                        id: c.id_sav_adm_empresa,
                        nome: c.nome_empresa || c.nome || c.razao_social || `Empresa ${c.id_sav_adm_empresa}`
                    }));
                }

                if (!Array.isArray(companies)) {
                    companies = [companies].filter(Boolean);
                }

                companies = companies.map((c: any) => {
                    let compId = c.id;
                    if (compId === undefined || compId === null) compId = c.id_sav_adm_empresa;
                    if (compId === undefined || compId === null) compId = c.id_empresa;
                    if (compId === undefined || compId === null) compId = c.empresa_id;
                    if (compId === undefined || compId === null) compId = '';

                    const compName = c.nome || c.razao_social || c.nome_empresa || c.nome_fantasia || `Empresa ${compId}`;
                    return {
                        ...c,
                        id: compId !== '' ? compId : c.id,
                        nome: compName,
                        displayId: compId !== '' ? String(compId).padStart(4, '0') : ''
                    };
                });

                setAvailableCompanies(companies);

                const saved = localStorage.getItem('sav_selected_company');
                let savedId: string | null = null;
                if (saved) {
                    try {
                        savedId = String(JSON.parse(saved)?.id ?? '');
                    } catch {
                        savedId = null;
                    }
                }
                const validSavedCompany = companies.find((company: any) => String(company.id) === savedId);
                setSelectedCompany(validSavedCompany || companies[0] || null);
            } else {
                setAvailableCompanies([]);
                setSelectedCompany(null);
            }
            setIsContextLoading(false);
        };
        loadCompanies();
    }, [setIsContextLoading, setSelectedCompany, setAvailableCompanies, user]);

    const toggleExpand = (key: string) => {
        setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleLogout = () => {
        authService.logout();
    };

    const getUserInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <>
            {isOpen && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />)}
            <aside style={{ width: isOpen ? '280px' : `${width}px` }} className={`fixed lg:sticky top-0 left-0 h-screen bg-corp-dark flex flex-col z-[99999] shadow-2xl lg:shadow-none ${!isResizing ? 'transition-all duration- 00 ease-in-out' : ''} ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div onMouseDown={startResizing} className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-corp-green/30 transition-colors z-[99999] hidden lg:block" />
                <div className={`flex items-center ${width <= 80 ? 'justify-center p-4' : 'justify-between p-6'} border-b border-white/10 shrink-0 text-clip overflow-hidden transition-all duration-300`}>
                    <div className={`flex items-center gap-3 ${width <= 80 ? 'hidden' : 'flex'}`}>
                        <img src="/logo_sav_70x70.png" alt="SAV" className="w-12 h-12 object-contain rounded shrink-0 shadow-lg" />
                        <div className={`flex flex-col transition-opacity duration-200 ${width < 180 ? 'opacity-0' : 'opacity-100'}`}>
                            <span className="font-sans font-bold text-white leading-none tracking-wide text-lg">SAV WEB</span>
                            <span className="text-[9px] text-white/40 font-mono leading-none mt-1.5 whitespace-nowrap overflow-visible">
                                {typeof __APP_VERSION__ !== 'undefined' && __APP_VERSION__ ? __APP_VERSION__ : "Versão Indisponível"}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setMobileOpen(false)} className="lg:hidden text-white/60 hover:text-white shrink-0"><X size={20} /></button>
                    <button onClick={() => setWidth(width <= 80 ? 280 : 80)} className={`hidden lg:flex text-white/60 hover:text-white shrink-0 transition-transform duration-300 p-2 rounded-lg hover:bg-white/10 ${width <= 80 ? 'rotate-180' : ''}`} title={width <= 80 ? "Expandir Menu" : "Minimizar Menu"}>
                        <Menu size={20} />
                    </button>
                </div>

                <div className={`py-4 shrink-0 transition-all duration-300 ${width <= 80 ? 'px-3' : 'px-5'}`}>
                    <div className="relative group w-full">
                        {width <= 80 ? (
                            <button className="w-full bg-[#343838] border border-white/10 text-slate-100 rounded-xl p-3 flex justify-center items-center outline-none hover:bg-white/5 transition-colors" title={selectedCompany ? selectedCompany.nome : "Selecionar Empresa"}>
                                {isContextLoading ? <Loader2 size={16} className="animate-spin text-corp-green" /> : <Building2 size={16} className="text-corp-green" />}
                            </button>
                        ) : (
                            <>
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-corp-green">
                                    {isContextLoading ? <Loader2 size={16} className="animate-spin" /> : <Building2 size={16} />}
                                </div>
                                <select
                                    className="w-full bg-[#343838] border border-white/10 text-slate-100 text-[11px] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-corp-green/30 focus:border-corp-green transition-all appearance-none font-sans font-medium cursor-pointer overflow-hidden whitespace-nowrap"
                                    value={selectedCompany ? selectedCompany.id : ''}
                                    onChange={(e) => {
                                        const company = availableCompanies.find((c: any) => String(c.id) === e.target.value);
                                        if (company) {
                                            showLoading(`Alterando empresa para ${company.nome}...`, 3000);
                                            setTimeout(async () => {
                                                setSelectedCompany(company);
                                                localStorage.setItem('sav_company_id', String(company.id || ''));
                                                localStorage.setItem('sav_company_name', company.nome || company.razao_social || '');
                                                if (company.departamento) {
                                                    localStorage.setItem('sav_dept_id', String(company.departamento.id || ''));
                                                    localStorage.setItem('sav_dept_nome', company.departamento.nome || '');
                                                }
                                                if (company.perfil) {
                                                    localStorage.setItem('sav_profile_id', String(company.perfil.id || ''));
                                                    localStorage.setItem('sav_profile_nome', company.perfil.nome || '');
                                                }
                                                await hideLoading();
                                            }, 500);
                                        }
                                    }}
                                >
                                    {availableCompanies.length === 0 && <option value="">Carregando...</option>}
                                    {availableCompanies.length > 0 && !selectedCompany && <option value="">Selecionar Empresa...</option>}
                                    {availableCompanies.map((company: any, index: number) => (
                                        <option key={`${company.id || 'new'}-${index}`} value={company.id}>{width > 220 ? `${company.displayId ? `${company.displayId} - ` : ''}${company.nome}` : company.displayId}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white/30">
                                    <ChevronDown size={14} />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar overflow-x-hidden">
                    {width > 80 && width < 180 && <div className="h-px bg-white/10 w-full mb-4"></div>}
                    {width >= 180 && <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] px-3 mb-2 mt-4 font-sans">Módulos</div>}
                    {[...menuModules].filter(moduloVisivel).sort((a, b) => (a.tag_web || '').localeCompare(b.tag_web || '')).map((module) => (
                        <SidebarModule
                            key={module.id}
                            module={module}
                            width={width}
                            isExpanded={expandedItems[module.id] || false}
                            onToggle={toggleExpand}
                            itemVisivel={itemVisivel}
                            setMobileOpen={setMobileOpen}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-white/10 bg-[#343838] shrink-0">
                    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 bg-corp-green text-white font-bold text-xs flex items-center justify-center rounded-lg shadow-md group-hover:scale-105 transition-transform font-sans shrink-0">
                            {getUserInitials(userName)}
                        </div>
                        {width > 160 && (
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-white truncate font-sans">{userName}</p>
                                <p className="text-[9px] text-white/40 uppercase font-bold tracking-wider">Administrador</p>
                            </div>
                        )}
                        {width > 220 && (
                            <div className="flex items-center gap-1 shrink-0">

                                <button className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" onClick={handleLogout} title="Sair do Sistema">
                                    <LogOut size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
                ${isResizing ? 'body { cursor: col-resize !important; user-select: none !important; }' : ''}
            `}</style>
        </>
    );
};

export default Sidebar;
