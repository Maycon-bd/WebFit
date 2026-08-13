import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { MenuModule } from './types';

interface SidebarModuleProps {
  module: MenuModule;
  width: number;
  isExpanded: boolean;
  onToggle: (key: string) => void;
  itemVisivel: (itemName: string) => boolean;
  setMobileOpen: (v: boolean) => void;
}

const SidebarModule: React.FC<SidebarModuleProps> = ({
  module,
  width,
  isExpanded,
  onToggle,
  itemVisivel,
  setMobileOpen,
}) => {
  const location = useLocation();
  const [expandedRelatorios, setExpandedRelatorios] = useState<Record<string, boolean>>({});

  const toggleRelatorio = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRelatorios(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const hasActiveChild = module.subsections.some(sub =>
    sub.items.some(item => module.funcionalidades[item]?.route === location.pathname)
  );

  return (
    <div className="mb-1">
      <div
        className={`group flex items-center ${width <= 80 ? 'justify-center' : 'gap-3 px-3'} py-2.5 rounded-xl border border-transparent cursor-pointer transition-all duration-200 ${hasActiveChild || isExpanded ? 'bg-white/5 text-white border-white/5' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}
        onClick={() => onToggle(module.id)}
        title={width <= 80 ? module.label : undefined}
      >
        <div className={`shrink-0 flex items-center justify-center ${hasActiveChild ? 'text-corp-green' : 'group-hover:text-corp-green transition-colors'}`}>
          {module.icon}
        </div>
        {width > 80 && <span className="flex-1 font-sans font-medium text-[13.5px] truncate">{module.label}</span>}
        {width > 180 && (isExpanded ? (<ChevronDown size={14} className="text-corp-green shrink-0" />) : (<ChevronRight size={14} className="text-white/30 shrink-0" />))}
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded && width > 80 ? 'max-h-[800px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className="relative ml-[22px] pl-4 border-l border-white/10 pb-2 space-y-3 mt-2">
          {module.subsections.map((sub, idx) => {
            const itensFiltrados = sub.items.filter(itemVisivel);
            if (itensFiltrados.length === 0) return null;
            return (
              <div key={idx} className="space-y-1">
                {idx > 0 && <div className="h-px bg-corp-green/25 my-2" />}
                {itensFiltrados.map((item, i) => {
                  const f = module.funcionalidades[item];
                  const route = f?.route;
                  const label = f?.label ?? item;
                  const isActive = route && (location.pathname === route || (route === '/administrativo/empresa' && location.pathname === '/'));
                  return route ? (
                    <Link
                      to={route}
                      key={i}
                      className={`block text-[13px] py-1.5 px-2 rounded-lg transition-all relative font-sans ${isActive ? 'text-white font-semibold bg-corp-green/20 text-corp-green' : 'text-slate-400 hover:text-white hover:translate-x-1'} cursor-pointer ${width < 160 ? 'text-center text-[10px]' : ''}`}
                      onClick={() => setMobileOpen(false)}
                      title={label}
                    >
                      {isActive && width > 180 && <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-[3px] h-4 bg-corp-green rounded-r-full shadow-[2px_0_10px_rgba(118,201,110,0.5)]"></div>}
                      {width > 160 ? (label === 'Pesquisa de Funções' ? 'Funções' : label) : label.substring(0, 3)}
                    </Link>
                  ) : (
                    <div
                      key={i}
                      className={`block text-[13px] py-1.5 px-2 rounded-lg transition-all relative font-sans text-slate-400 opacity-40 cursor-default ${width < 160 ? 'text-center text-[10px]' : ''}`}
                      title={`${label} (Desabilitado)`}
                    >
                      {width > 160 ? (label === 'Pesquisa de Funções' ? 'Funções' : label) : label.substring(0, 3)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarModule;
