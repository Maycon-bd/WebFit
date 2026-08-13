import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Filter, Search, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp10, CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import { createPortal } from 'react-dom';

export type ColumnFieldType = 'text' | 'number' | 'date';

export interface TableColumnFilterProps {
  /** Todos os valores únicos (já como strings) para esta coluna */
  options: string[];
  /** Quais valores estão filtrados (vazio = todos) */
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  /** Tipo do campo para exibir as opções de ordenação corretas */
  fieldType?: ColumnFieldType;
  /** Chave do sort ativo no momento */
  sortKey?: string | null;
  /** Chave desta coluna */
  colKey?: string;
  /** Direção do sort ativo */
  sortDir?: 'asc' | 'desc';
  /** Callback para acionar a ordenação */
  onSort?: (dir: 'asc' | 'desc') => void;
}

type SortOption = { label: string; dir: 'asc' | 'desc'; icon: React.ReactNode };

const getSortOptions = (fieldType: ColumnFieldType): SortOption[] => {
  if (fieldType === 'number') {
    return [
      { label: 'Classificar do Menor para o Maior', dir: 'asc',  icon: <ArrowDown01 size={13} /> },
      { label: 'Classificar do Maior para o Menor', dir: 'desc', icon: <ArrowUp10  size={13} /> },
    ];
  }
  if (fieldType === 'date') {
    return [
      { label: 'Classificar do Mais Antigo para o Mais Novo', dir: 'asc',  icon: <CalendarArrowDown size={13} /> },
      { label: 'Classificar do Mais Novo para o Mais Antigo', dir: 'desc', icon: <CalendarArrowUp  size={13} /> },
    ];
  }
  // text (default)
  return [
    { label: 'Classificar de A a Z', dir: 'asc',  icon: <ArrowDownAZ size={13} /> },
    { label: 'Classificar de Z a A', dir: 'desc', icon: <ArrowUpAZ  size={13} /> },
  ];
};

export const TableColumnFilter: React.FC<TableColumnFilterProps> = ({
  options,
  selectedValues,
  onChange,
  fieldType = 'text',
  sortKey,
  colKey,
  sortDir,
  onSort,
}) => {
  const [isOpen, setIsOpen]               = useState(false);
  const [searchText, setSearchText]       = useState('');
  const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());

  const buttonRef   = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Sincroniza estado local quando o dropdown abre
  useEffect(() => {
    if (!isOpen) return;
    setLocalSelected(selectedValues.length === 0 ? new Set(options) : new Set(selectedValues));
    setSearchText('');

    if (buttonRef.current) {
      const rect         = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 340;
      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth) left = window.innerWidth - dropdownWidth - 12;
      setPosition({ top: rect.bottom + 4, left });
    }
  }, [isOpen]);

  // Fecha ao clicar fora ou pressionar Esc
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current  && !buttonRef.current.contains(e.target as Node)
      ) setIsOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown',  onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown',  onEsc);
    };
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const q = searchText.toLowerCase().trim();
    return q ? options.filter(o => String(o).toLowerCase().includes(q)) : options;
  }, [options, searchText]);

  const isAllSelected = localSelected.size === options.length;

  const handleToggleAll  = () => setLocalSelected(isAllSelected ? new Set() : new Set(options));
  const handleToggleItem = (val: string) => {
    const s = new Set(localSelected);
    s.has(val) ? s.delete(val) : s.add(val);
    setLocalSelected(s);
  };

  const handleApply = () => {
    onChange(localSelected.size === options.length || localSelected.size === 0 ? [] : Array.from(localSelected));
    setIsOpen(false);
  };

  const handleClear = () => { onChange([]); setIsOpen(false); };

  const handleSort = (dir: 'asc' | 'desc') => {
    onSort?.(dir);
    // não fecha o popup — só aplica o sort e continua
  };

  const hasActiveFilter = selectedValues.length > 0 && selectedValues.length < options.length;
  const activeSortDir   = sortKey && colKey && sortKey === colKey ? sortDir : undefined;
  const sortOptions     = getSortOptions(fieldType);

  return (
    <>
      {/* ── Botão ──────────────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(o => !o); }}
        className={`p-0.5 rounded transition-colors flex-shrink-0 ${
          hasActiveFilter || activeSortDir
            ? 'text-corp-teal bg-corp-teal/10'
            : 'text-slate-300 hover:bg-slate-200 hover:text-slate-500'
        }`}
        title="Ordenar / Filtrar coluna"
      >
        <Filter size={10} className={hasActiveFilter ? 'fill-corp-teal' : ''} />
      </button>

      {/* ── Popup (Portal) ─────────────────────────────────────────── */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{ top: position.top, left: position.left }}
          className="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col w-[340px] text-[11px] text-slate-700 animate-fade-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ordenação */}
          {onSort && (
            <div className="border-b border-slate-100">
              {sortOptions.map((opt) => {
                const isActive = activeSortDir === opt.dir;
                return (
                  <button
                    key={opt.dir}
                    onClick={() => handleSort(opt.dir)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 transition-colors text-left font-normal ${
                      isActive
                        ? 'bg-corp-teal/10 text-corp-teal'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className={isActive ? 'text-corp-teal' : 'text-slate-400'}>{opt.icon}</span>
                    <span className="font-normal">{opt.label}</span>
                  </button>
                );
              })}
              {hasActiveFilter && (
                <button
                  onClick={handleClear}
                  className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 text-slate-400 border-t border-slate-100 text-left"
                >
                  <Filter size={12} />
                  <span>Limpar Filtro</span>
                </button>
              )}
            </div>
          )}

          {/* Busca */}
          <div className="p-2 relative">
            <Search size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-corp-teal focus:ring-1 focus:ring-corp-teal/30 text-[11px]"
            />
          </div>

          {/* Lista de opções */}
          <div className="max-h-52 overflow-auto px-1 pb-1">
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer rounded-lg">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleAll}
                className="w-3 h-3 rounded border-slate-300 accent-corp-teal"
              />
              <span>(Selecionar Tudo)</span>
            </label>

            {filteredOptions.length === 0 ? (
              <div className="p-3 text-slate-400 text-center italic">Nenhum resultado</div>
            ) : filteredOptions.map((opt, idx) => (
              <label key={idx} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 cursor-pointer rounded-lg">
                <input
                  type="checkbox"
                  checked={localSelected.has(opt)}
                  onChange={() => handleToggleItem(opt)}
                  className="w-3 h-3 rounded border-slate-300 accent-corp-teal"
                />
                <span className="truncate" title={opt === '' ? '(Vazio)' : opt}>
                  {opt === '' ? '(Vazio)' : opt}
                </span>
              </label>
            ))}
          </div>

          {/* Rodapé */}
          <div className="p-2 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-1 bg-corp-teal text-white hover:bg-corp-teal/90 rounded-lg transition-colors shadow-sm"
            >
              OK
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
