import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Settings, ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Loader2, GripVertical } from 'lucide-react';
import ActionMenu from './ActionMenu';
import * as formatters from '../utils/formatters';
import { TableColumnFilter } from './shared/TableColumnFilter';

/**
 * Interface para definição de colunas da MestreGrid.
 */
export interface MestreColumn<T> {
    key: keyof T | string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    /**
     * Limite máximo de largura (CSS max-width), útil para colunas que são a
     * única sem `width` explícita e por isso absorvem todo o espaço restante.
     * Aceita qualquer valor CSS válido: '12rem', '200px', '20%'.
     * Quando definido, o texto que ultrapassar o limite exibe "…" (truncate).
     */
    maxWidth?: string;
    sortable?: boolean;
    format?: 'cnpj' | 'cpf' | 'phone' | 'currency' | 'percent' | 'date' | 'status' | 'boolean' | 'cep' | 'document' | 'number';
    render?: (val: any, item: T) => React.ReactNode;
}

interface MestreGridProps<T> {
    columns: MestreColumn<T>[];
    data: T[];
    isLoading: boolean;
    totalCount?: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit?: (id: any) => void;
    onView?: (id: any) => void;
    onDelete?: (id: any) => void;
    onPrint?: (id: any) => void;
    /** Ações extras exibidas no ActionMenu de cada linha, abaixo das ações padrão. */
    extraActions?: Array<{
        label: string;
        icon: React.ComponentType<{ size?: number; className?: string }>;
        onClick: (id: any) => void;
        variant?: 'default' | 'danger';
    }>;
    emptyMessage?: string;
    /** Tipo de ações a exibir: menu (popup com engrenagem) ou buttons (botões inline) */
    actionType?: 'menu' | 'buttons';
    /** Ativa estilo zebra (linhas alternadas) conforme Design System SAV — branco mais escuro (bg-slate-50) nas ímpares */
    zebra?: boolean;
    /** Ativa linhas verticais separando cada coluna (borderedColumns) */
    borderedColumns?: boolean;
    /**
     * Token de reset: quando incrementado, restaura larguras e ordem das colunas
     * para o padrão. Use para resetar customizações ao pesquisar novamente.
     */
    resetToken?: number;
    /** ID da linha selecionada (clique esquerdo). Highlight visual + base para actions. */
    selectedId?: any;
    /** Callback ao clicar (botão esquerdo) em uma linha para selecioná-la. */
    onRowSelect?: (id: any) => void;
    persistentSort?: {
        key: string | null;
        setKey: (v: string | null) => void;
        dir: 'asc' | 'desc';
        setDir: (v: 'asc' | 'desc') => void;
    };
    persistenceKey?: string;
    selectionMode?: 'single' | 'multiple';
    selectedIds?: any[];
    onSelectionChange?: (ids: any[]) => void;
    singleCheckbox?: boolean;
    enableColumnFilters?: boolean;
    autoHeight?: boolean;
}

/**
 * Tabela Genérica (MestreGrid)
 * Unifica ordenação, paginação, ActionMenu e formatação de células.
 */
export function MestreGrid<T extends { id: any }>(props: MestreGridProps<T>) {
    const {
        columns,
        data,
        isLoading,
        totalCount,
        currentPage,
        pageSize,
        onPageChange,
        onEdit,
        onView,
        onDelete,
        onPrint,
        extraActions,
        emptyMessage = "Nenhum registro encontrado.",
        actionType = 'menu',
        zebra = false,
        borderedColumns = false,
        resetToken = 0,
        selectedId,
        onRowSelect,
        persistentSort,
        persistenceKey,
        selectionMode = 'single',
        selectedIds = [],
        onSelectionChange,
        singleCheckbox = false,
        enableColumnFilters = true,
        autoHeight = false
    } = props;
    const [openMenuId, setOpenMenuId] = useState<any>(null);
    const [sortKey, setSortKey] = useState<string | null>(persistentSort?.key ?? null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>(persistentSort?.dir ?? 'asc');
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    // --- Customização de colunas: largura (resize) e ordem (reorder) ---
    const defaultOrder = useMemo(() => columns.map(c => String(c.key)), [columns]);
    const widthToPx = useCallback((w?: string): number => {
        if (!w) return 0; // Return 0 to fallback to string calculation
        const m = w.match(/^w-(\d+(?:\.\d+)?)$/);
        if (m) return parseFloat(m[1]) * 4; // Tailwind: 1 unidade = 4px
        return 140;
    }, []);

    const getMinColumnWidth = useCallback((col: MestreColumn<T>) => {
        // text-xs (12px), estimate ~7.5px per char on average
        // padding px-3 (24px) + Grip Icon (~16px) 
        let min = (col.label.length * 7.5) + 24 + 16;
        if (enableColumnFilters) min += 28; // Filter Icon
        if (col.sortable) min += 16; // Sort Icon
        return Math.ceil(min);
    }, [enableColumnFilters]);

    const defaultWidths = useMemo(() => {
        const w: Record<string, number> = {};
        columns.forEach(c => { 
            const explicitW = widthToPx(c.width);
            const minW = getMinColumnWidth(c);
            w[String(c.key)] = explicitW > 0 ? explicitW : minW; 
        });
        return w;
    }, [columns, widthToPx, getMinColumnWidth]);

    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        if (persistenceKey) {
            const saved = localStorage.getItem(`mestre_grid_order_${persistenceKey}`);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const keys = columns.map(c => String(c.key));
                        const valid = parsed.filter(k => keys.includes(k));
                        const missing = keys.filter(k => !parsed.includes(k));
                        return [...valid, ...missing];
                    }
                } catch (e) {
                    // Ignore
                }
            }
        }
        return columns.map(c => String(c.key));
    });

    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
        if (persistenceKey) {
            const saved = localStorage.getItem(`mestre_grid_widths_${persistenceKey}`);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    // Ignore
                }
            }
        }
        const w: Record<string, number> = {};
        columns.forEach(c => {
            const explicitW = widthToPx(c.width);
            const minW = getMinColumnWidth(c);
            w[String(c.key)] = explicitW > 0 ? explicitW : minW;
        });
        return w;
    });

    const [dragKey, setDragKey] = useState<string | null>(null);
    const [dragOverKey, setDragOverKey] = useState<string | null>(null);
    // Distingue arraste de clique: evita disparar ordenação ao soltar um drag
    const didDragRef = useRef(false);
    const dragTimeoutRef = useRef<any>(null);
    const lastClickRef = useRef<{ time: number, colKey: string | null }>({ time: 0, colKey: null });

    const setDidDrag = useCallback((val: boolean, autoResetMs?: number) => {
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
        didDragRef.current = val;
        if (val && autoResetMs) {
            dragTimeoutRef.current = setTimeout(() => {
                didDragRef.current = false;
            }, autoResetMs);
        }
    }, []);

    // Save to localStorage when order/widths change
    useEffect(() => {
        if (persistenceKey && columnOrder.length > 0) {
            localStorage.setItem(`mestre_grid_order_${persistenceKey}`, JSON.stringify(columnOrder));
        }
    }, [columnOrder, persistenceKey]);

    useEffect(() => {
        if (persistenceKey && Object.keys(columnWidths).length > 0) {
            localStorage.setItem(`mestre_grid_widths_${persistenceKey}`, JSON.stringify(columnWidths));
        }
    }, [columnWidths, persistenceKey]);

    // Reset para padrão quando resetToken muda OU quando o conjunto de colunas muda
    useEffect(() => {
        if (resetToken > 0) {
            if (persistenceKey) {
                localStorage.removeItem(`mestre_grid_order_${persistenceKey}`);
                localStorage.removeItem(`mestre_grid_widths_${persistenceKey}`);
            }
            setColumnOrder(defaultOrder);
            setColumnWidths(defaultWidths);
        } else {
            setColumnOrder(prev => {
                const keys = defaultOrder;
                const valid = prev.filter(k => keys.includes(k));
                const missing = keys.filter(k => !prev.includes(k));
                return [...valid, ...missing];
            });
            setColumnWidths(prev => persistenceKey ? { ...defaultWidths, ...prev } : defaultWidths);
        }
    }, [defaultOrder, defaultWidths, resetToken, persistenceKey]);

    const orderedColumns = useMemo(() => {
        const map = new Map(columns.map(c => [String(c.key), c]));
        return columnOrder.map(k => map.get(k)).filter(Boolean) as MestreColumn<T>[];
    }, [columns, columnOrder]);

    const doAutoResize = useCallback((th: HTMLElement, key: string) => {
        const spanEl = th.querySelector('span.text-ellipsis') as HTMLElement;
        let maxW = spanEl ? spanEl.scrollWidth + 64 : 60; // 64px para garantir sobra

        const tr = th.closest('tr');
        if (tr) {
            const colIndex = Array.from(tr.children).indexOf(th);
            const table = th.closest('table');
            if (table) {
                const tbody = table.querySelector('tbody');
                if (tbody) {
                    // Div fantasma para medir o tamanho real (intrínseco) do HTML
                    // Evita o bug de crescimento contínuo (feedback loop) causado por elementos block/flex dentro da td.
                    const measureDiv = document.createElement('div');
                    measureDiv.className = 'text-xs font-medium inline-block whitespace-nowrap absolute invisible';
                    document.body.appendChild(measureDiv);

                    const rows = tbody.querySelectorAll('tr');
                    rows.forEach(row => {
                        const td = row.children[colIndex] as HTMLElement;
                        if (td) {
                            measureDiv.innerHTML = td.innerHTML;
                            const tdWidth = measureDiv.scrollWidth + 24; // 24px = padding da td (px-3)
                            if (tdWidth > maxW) {
                                maxW = tdWidth;
                            }
                        }
                    });

                    document.body.removeChild(measureDiv);
                }
            }
        }

        const finalW = Math.min(Math.round(maxW), 800);
        setColumnWidths(prev => ({ ...prev, [key]: finalW }));
    }, []);

    const handleResizeStart = useCallback((e: React.MouseEvent, col: MestreColumn<T>) => {
        e.preventDefault();
        e.stopPropagation();
        const th = (e.currentTarget as HTMLElement).closest('th') as HTMLElement;
        if (!th) return;

        const key = String(col.key);
        const now = Date.now();
        if (lastClickRef.current.colKey === key && now - lastClickRef.current.time < 300) {
            doAutoResize(th, key);
            lastClickRef.current = { time: 0, colKey: null };

            // Impede a ordenação acidental caso a coluna encolha/aumente e o mouseup caia no th
            setDidDrag(true, 300);
            return;
        }
        lastClickRef.current = { time: now, colKey: key };

        const startX = e.clientX;
        const startWidth = th.getBoundingClientRect().width;

        // Limite mínimo baseado no conteúdo do cabeçalho
        const spanEl = th.querySelector('span.text-ellipsis') as HTMLElement;
        const minWText = spanEl ? spanEl.scrollWidth + 64 : 40;
        const minAllowed = getMinColumnWidth(col);
        const minW = Math.max(minWText, minAllowed, 40);

        const onMove = (ev: MouseEvent) => {
            setDidDrag(true);
            const newW = Math.max(minW, Math.round(startWidth + (ev.clientX - startX)));
            setColumnWidths(prev => ({ ...prev, [key]: newW }));
        };
        const onUp = () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            setDidDrag(true, 150);
        };
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, [doAutoResize]);

    const handleReorder = useCallback((from: string, to: string) => {
        if (!from || !to || from === to) return;
        setColumnOrder(prev => {
            const next = [...prev];
            const fromIdx = next.indexOf(from);
            const toIdx = next.indexOf(to);
            if (fromIdx === -1 || toIdx === -1) return prev;
            const [moved] = next.splice(fromIdx, 1);
            next.splice(toIdx, 0, moved);
            return next;
        });
    }, []);

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

    // Fechar menu ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sincroniza ordenação externa (ex: resetFilters)
    useEffect(() => {
        if (persistentSort) {
            setSortKey(persistentSort.key);
            setSortDir(persistentSort.dir);
        }
    }, [persistentSort?.key, persistentSort?.dir]);

    // Ações do Menu
    const openMenu = useCallback((id: any) => {
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }
        const btn = buttonRefs.current[id];
        if (btn) {
            const rect = btn.getBoundingClientRect();
            setMenuPosition({
                top: rect.top - 8,
                left: rect.left - 160,
            });
        }
        setOpenMenuId(id);
    }, [openMenuId]);

    // Ordenação Local (Fall-back caso o backend não suporte)
    const handleSort = (key: string) => {
        if (didDragRef.current) { setDidDrag(false); return; }

        let newKey: string | null = key;
        let newDir: 'asc' | 'desc' = 'asc';

        if (sortKey === key) {
            if (sortDir === 'asc') {
                newDir = 'desc';
            } else {
                newKey = null; // Terceiro estado: desativa a ordenação
            }
        }

        setSortKey(newKey);
        setSortDir(newDir);

        if (persistentSort) {
            persistentSort.setKey(newKey);
            persistentSort.setDir(newDir);
        }
    };

    const [columnFilters, setColumnFiltersRaw] = useState<Record<string, string[]>>({});

    useEffect(() => {
        setColumnFiltersRaw({});
    }, [data]);

    // Wrapper: quando filtro de coluna muda, SEMPRE reseta para página 1
    const setColumnFilters = useCallback((updater: Record<string, string[]> | ((prev: Record<string, string[]>) => Record<string, string[]>)) => {
        setColumnFiltersRaw(updater);
        onPageChange(1);
    }, [onPageChange]);

    const getUniqueValues = useCallback((key: string) => {
        const uniqueSet = new Set<string>();
        data.forEach((item: any) => {
            const val = item[key];
            const formatted = val === null || val === undefined ? '' : String(val);
            uniqueSet.add(formatted);
        });
        return Array.from(uniqueSet).sort();
    }, [data]);

    const filteredData = useMemo(() => {
        if (!enableColumnFilters) return data;
        const filterKeys = Object.keys(columnFilters);
        if (filterKeys.length === 0) return data;

        return data.filter(item => {
            return filterKeys.every(key => {
                const selectedVals = columnFilters[key];
                if (!selectedVals || selectedVals.length === 0) return true;
                const val = (item as any)[key];
                const formattedVal = val === null || val === undefined ? '' : String(val);
                return selectedVals.includes(formattedVal);
            });
        });
    }, [data, columnFilters, enableColumnFilters]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a: any, b: any) => {
            const valA = (a as any)[sortKey];
            const valB = (b as any)[sortKey];
            if (valA === valB) return 0;
            const res = (valA || '') < (valB || '') ? -1 : 1;
            return sortDir === 'asc' ? res : -res;
        });
    }, [filteredData, sortKey, sortDir]);

    // Paginação
    const activeFiltersQtd = Object.values(columnFilters).filter(arr => arr.length > 0).length;
    const isFilteringLocally = enableColumnFilters && activeFiltersQtd > 0;

    const totalPages = Math.max(1, Math.ceil((isFilteringLocally ? sortedData.length : (totalCount || data.length)) / pageSize));
    // Garante que a página atual nunca ultrapasse o total de páginas
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    // Determinar os dados da página atual
    const paginatedData = useMemo(() => {
        // Se a API não fizer a paginação no backend (retornar todos os itens e data.length > pageSize),
        // ou se totalCount for inferido do data.length, aplicamos paginação local no array.
        const isLocalPagination = isFilteringLocally || !totalCount || data.length > pageSize;

        if (isLocalPagination) {
            const startIndex = (safePage - 1) * pageSize;
            return sortedData.slice(startIndex, startIndex + pageSize);
        }

        return sortedData;
    }, [sortedData, safePage, pageSize, totalCount, data.length, isFilteringLocally]);

    // Coluna de Ações (engrenagem/ActionMenu) só aparece se houver handlers
    const hasActions = !!(onEdit || onView || onDelete || onPrint || extraActions?.length);

    // Renderizador de Célula
    const renderCell = (item: T, col: MestreColumn<T>) => {
        const val = (item as any)[col.key];

        if (col.render) return col.render(val, item);

        if (col.format && typeof col.format === 'string' && (formatters as any)[`format${col.format.charAt(0).toUpperCase() + col.format.slice(1)}`]) {
            const formatter = (formatters as any)[`format${col.format.charAt(0).toUpperCase() + col.format.slice(1)}`];

            // Tratamentos específicos de estilo baseados no tipo
            if (col.format === 'status') {
                let badgeClass = 'bg-rose-100 text-rose-700';
                if (val === 'S' || val === 'Active') {
                    badgeClass = 'bg-emerald-100 text-emerald-700';
                } else if (val === 'B' || val === 'Blocked') {
                    badgeClass = 'bg-amber-100 text-amber-700';
                }
                return (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${badgeClass}`}>
                        {formatter(val).toUpperCase()}
                    </span>
                );
            }

            if (col.format === 'boolean') {
                return (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${val === 'S' || val === true
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-slate-100 text-slate-500'
                        }`}>
                        {formatter(val).toUpperCase()}
                    </span>
                );
            }

            return <span>{formatter(val)}</span>;
        }

        return <span>{val ?? '—'}</span>;
    };

    if (!data || data.length === 0) {
        return (
            <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-slate-400 ${autoHeight ? 'min-h-24 px-6 py-5' : 'flex-1 min-h-[300px] p-12'}`}>
                <p className="font-medium text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden ${autoHeight ? 'flex-none' : 'flex-1 min-h-0'}`}>
            <div className={`${autoHeight ? 'overflow-x-auto' : 'flex-1 overflow-auto min-h-0'} rounded-t-3xl`}>
                {/*
                 * table-fixed: colunas COM width explícita (w-20, w-28…) ficam exatamente
                 * naquele tamanho; colunas SEM width dividem o espaço restante entre si.
                 * Sem table-fixed (table-auto + w-full), o browser redistribui o espaço
                 * excedente para TODAS as colunas, deixando campos curtos (ID, Data, Status)
                 * muito mais largos do que o necessário.
                 */}
                <table className="w-full table-fixed text-left text-xs">
                    <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md text-slate-500 text-[10px] uppercase tracking-wider font-bold z-10 border-b border-slate-200">
                        <tr>
                            {selectionMode === 'multiple' && (
                                <th className="px-3 py-1.5 w-10 min-w-[2.5rem] text-center sticky left-0 bg-slate-50/80 backdrop-blur-md border-r border-slate-200 z-20">
                                    {!singleCheckbox && (
                                        <input
                                            type="checkbox"
                                            checked={paginatedData.length > 0 && paginatedData.every(item => selectedIds?.includes(item.id))}
                                            onChange={(e) => {
                                                if (!onSelectionChange) return;
                                                if (e.target.checked) {
                                                    const pageIds = paginatedData.map(item => item.id);
                                                    const newSelection = Array.from(new Set([...(selectedIds || []), ...pageIds]));
                                                    onSelectionChange(newSelection);
                                                } else {
                                                    const pageIds = paginatedData.map(item => item.id);
                                                    const newSelection = (selectedIds || []).filter(id => !pageIds.includes(id));
                                                    onSelectionChange(newSelection);
                                                }
                                            }}
                                            className="rounded border-slate-300 text-corp-teal focus:ring-corp-teal cursor-pointer h-4.5 w-4.5 accent-teal-600"
                                        />
                                    )}
                                </th>
                            )}
                            {onRowSelect && selectionMode !== 'multiple' && (
                                <th className="px-1 py-1.5 w-8 min-w-[2rem] text-center sticky left-0 bg-slate-50/80 backdrop-blur-md border-r border-slate-200 z-20"></th>
                            )}
                            {orderedColumns.map((col, colIdx) => {
                                const key = String(col.key);
                                const explicitW = widthToPx(col.width);
                                const minAllowed = explicitW > 0 ? Math.min(explicitW, 36) : getMinColumnWidth(col);
                                const w = Math.max(columnWidths[key] ?? explicitW, minAllowed);
                                const isDragOver = dragOverKey === key;
                                return (
                                    <th
                                        key={colIdx}
                                        draggable
                                        onDragStart={(e) => {
                                            e.dataTransfer.effectAllowed = 'move';
                                            setDragKey(key);
                                            setDidDrag(true);
                                        }}
                                        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverKey(key); }}
                                        onDragLeave={() => setDragOverKey(null)}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            setDragOverKey(null);
                                            if (dragKey) handleReorder(dragKey, key);
                                        }}
                                        onDragEnd={() => {
                                            setDragKey(null);
                                            setDragOverKey(null);
                                            setDidDrag(true, 150);
                                        }}
                                        onClick={() => col.sortable && handleSort(key)}
                                        style={{ width: `${w}px`, minWidth: `${w}px`, maxWidth: col.maxWidth || undefined }}
                                        className={`relative px-3 py-1.5 whitespace-nowrap overflow-hidden text-ellipsis select-none ${borderedColumns ? 'border-r border-slate-100' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''} ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors group' : 'cursor-default'} ${dragKey === key ? 'opacity-50' : ''} ${isDragOver ? 'bg-corp-teal/10 ring-1 ring-inset ring-corp-teal/40' : ''}`}
                                    >
                                        <div className="flex items-center w-full">
                                            <div className={`flex-1 flex items-center gap-1.5 overflow-hidden text-ellipsis ${col.align === 'center' ? 'justify-center' : col.align === 'right' ? 'justify-end' : ''}`}>
                                                <GripVertical size={11} className="text-slate-300 shrink-0 opacity-60" />
                                                <span className="overflow-hidden text-ellipsis">{col.label}</span>
                                                {col.sortable && (
                                                    <div className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0">
                                                        {sortKey === key ? (
                                                            sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                                        ) : <ChevronsUpDown size={12} />}
                                                    </div>
                                                )}
                                            </div>
                                            {enableColumnFilters && (
                                                <div onClick={(e) => e.stopPropagation()} className="shrink-0 flex items-center pr-3">
                                                    <TableColumnFilter
                                                        fieldType={
                                                            col.format === 'date' ? 'date' :
                                                                col.format === 'number' || col.format === 'currency' || col.format === 'percent' ? 'number' : 'text'
                                                        }
                                                        colKey={key}
                                                        sortKey={sortKey}
                                                        sortDir={sortDir}
                                                        onSort={(dir) => handleSort(key)}
                                                        options={getUniqueValues(key)}
                                                        selectedValues={columnFilters[key] || []}
                                                        onChange={(v) => setColumnFilters(p => ({ ...p, [key]: v }))}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            onMouseDown={(e) => handleResizeStart(e, col)}
                                            onClick={(e) => e.stopPropagation()}
                                            title="Arraste para redimensionar, duplo clique para auto-ajustar"
                                            className="absolute top-0 right-0 h-full w-3 cursor-col-resize z-20 flex flex-col justify-center items-center group/resizer"
                                        >
                                            <div className="h-[40%] w-[1px] bg-slate-300 group-hover/resizer:bg-corp-teal group-hover/resizer:w-[2px] transition-all rounded-full" />
                                        </div>
                                    </th>
                                );
                            })}
                            {hasActions && (
                                <th className="px-3 py-1.5 w-20 whitespace-nowrap text-center sticky right-0 bg-slate-50/80 backdrop-blur-md border-l border-slate-200">Ações</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600 font-medium">
                        {paginatedData.map((item, index) => {
                            const isOdd = zebra && index % 2 !== 0;
                            const isRowSelected = selectedId !== undefined && selectedId !== null && String(selectedId) === String(item.id);
                            const isRowChecked = selectionMode === 'multiple' && Array.isArray(selectedIds) && selectedIds.includes(item.id);
                            const isHighlighted = isRowSelected || isRowChecked;
                            const rowBg = isHighlighted
                                ? '!bg-corp-teal/10 font-bold text-slate-900'
                                : isOdd
                                    ? 'bg-slate-50 hover:bg-corp-teal/5'
                                    : 'bg-white hover:bg-corp-teal/5';
                            return (
                                <tr
                                    key={String(item.id)}
                                    onClick={(e) => {
                                        const target = e.target as HTMLElement;
                                        if (
                                            target.tagName === 'INPUT' ||
                                            target.tagName === 'TEXTAREA' ||
                                            target.tagName === 'SELECT' ||
                                            target.tagName === 'BUTTON' ||
                                            target.closest('button')
                                        ) {
                                            return;
                                        }
                                        if (onRowSelect) {
                                            onRowSelect(item.id);
                                        }
                                    }}
                                    className={`group border-b border-slate-200 transition-colors duration-75 cursor-pointer ${rowBg}`}
                                >
                                    {selectionMode === 'multiple' && (
                                        <td className={`px-3 py-2 w-10 min-w-[2.5rem] text-center sticky left-0 transition-colors duration-75 ${isRowChecked ? '!bg-corp-teal/20 border-l-4 border-corp-teal' : (isHighlighted ? '!bg-corp-teal/10' : (isOdd ? 'bg-slate-50' : 'bg-white'))} z-10`} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={isRowChecked}
                                                onChange={(e) => {
                                                    if (!onSelectionChange) return;
                                                    if (e.target.checked) {
                                                        onSelectionChange([...selectedIds, item.id]);
                                                    } else {
                                                        onSelectionChange(selectedIds.filter(id => id !== item.id));
                                                    }
                                                }}
                                                className="rounded border-slate-300 text-corp-teal focus:ring-corp-teal cursor-pointer h-4.5 w-4.5 accent-teal-600"
                                            />
                                        </td>
                                    )}
                                    {onRowSelect && selectionMode !== 'multiple' && (
                                        <td className={`px-1 py-2 w-8 min-w-[2rem] text-center sticky left-0 ${rowBg} ${isHighlighted ? '!bg-corp-teal/40 border-r-2 border-corp-teal' : 'group-hover:bg-corp-teal/5 border-r border-slate-100'} z-10`}>
                                            <span className={`flex items-center justify-center transition-all duration-100 ${isHighlighted ? 'text-corp-teal' : 'text-transparent group-hover:text-slate-300'}`}>
                                                <ChevronRight size={18} strokeWidth={3} />
                                            </span>
                                        </td>
                                    )}
                                    {orderedColumns.map((col, colIdx) => {
                                        const key = String(col.key);
                                        const explicitW = widthToPx(col.width);
                                        const minAllowed = explicitW > 0 ? Math.min(explicitW, 36) : getMinColumnWidth(col);
                                        const w = Math.max(columnWidths[key] ?? explicitW, minAllowed);
                                        return (
                                            <td
                                                key={colIdx}
                                                style={{ width: `${w}px`, minWidth: `${w}px`, maxWidth: col.maxWidth || undefined }}
                                                className={`px-3 py-2.5 whitespace-nowrap overflow-hidden text-ellipsis ${borderedColumns ? 'border-r border-slate-100' : ''} ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : ''}`}
                                            >
                                                {renderCell(item, col)}
                                            </td>
                                        );
                                    })}
                                    {hasActions && (
                                        <td className={`px-3 py-2 text-center sticky right-0 ${rowBg} ${isHighlighted ? '' : 'group-hover:bg-corp-teal/5'} border-l border-slate-100`}>
                                            <button
                                                ref={(el) => { buttonRefs.current[String(item.id)] = el; }}
                                                onClick={(e) => { e.stopPropagation(); openMenu(item.id); }}
                                                className={`p-1 rounded-lg transition-all duration-75 ${openMenuId === item.id ? 'bg-corp-teal text-white' : 'text-slate-400 hover:text-corp-teal hover:bg-corp-teal/10'}`}
                                            >
                                                <Settings size={16} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                                                );
                        })}
                                            </tbody>
                                        </table>
            </div>

            {/* Rodapé de Paginação */ }
                            <footer className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total: <span className="text-slate-900">{totalCount || data.length}</span> registros
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onPageChange(safePage - 1)}
                                        disabled={safePage === 1}
                                        className="p-2 rounded-xl border border-slate-200 bg-white hover:text-corp-teal hover:border-corp-teal transition-all duration-75 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-700 shadow-sm">
                                        Página <span className="text-corp-teal">{safePage}</span> de {totalPages}
                                    </div>

                                    <button
                                        onClick={() => onPageChange(safePage + 1)}
                                        disabled={safePage === totalPages}
                                        className="p-2 rounded-xl border border-slate-200 bg-white hover:text-corp-teal hover:border-corp-teal transition-all duration-75 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </footer>

                            {/* Menu de Ações (Portal) */ }
                            <ActionMenu
                                isOpen={openMenuId !== null}
                                menuRef={menuRef}
                                position={menuPosition}
                                onClose={() => setOpenMenuId(null)}
                                onEdit={onEdit ? () => onEdit(openMenuId) : undefined}
                                onView={() => onView && onView(openMenuId)}
                                onDelete={() => onDelete && onDelete(openMenuId)}
                                onPrint={() => onPrint && onPrint(openMenuId)}
                                extraActions={extraActions?.map((a) => ({
                                    label: a.label,
                                    icon: a.icon,
                                    variant: a.variant,
                                    onClick: () => a.onClick(openMenuId),
                                }))}
                            />
        </div>
                    );
}

                    export default MestreGrid;
