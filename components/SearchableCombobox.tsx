import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { focusNextField } from '../hooks/useEnterNavigation';
import { Loader2, X, ChevronDown, Search, AlertCircle, MapPin, List } from 'lucide-react';

/**
 * SearchableCombobox Premium — Componente profissional de auto-complete assíncrono.
 *
 * Novidades:
 * - AUTO_SHOW_THRESHOLD: quando todos os dados já estão em cache e a lista é pequena
 *   (≤ 150 itens), a filtragem é feita localmente sem nova requisição ao backend.
 * - Botão "Ver todos os registros": aparece no hint de digitação (minChars > 0) para
 *   carregar toda a lista sem precisar digitar.
 * - browseAllLoading: estado de loading dedicado ao "Ver todos".
 */

const AUTO_SHOW_THRESHOLD = 99;

interface SearchableComboboxProps<T = any> {
    label?: string;
    labelAction?: React.ReactNode;
    placeholder?: string;
    value?: T | null;
    onChange: (item: T | null) => void;
    onSearch: (searchText: string) => Promise<T[]>;
    renderItem?: (
        item: T,
        highlightText: (text: string, query: string) => React.ReactNode,
        query: string
    ) => React.ReactNode;
    getDisplayValue?: (item: T) => string;
    disabled?: boolean;
    minChars?: number;
    emptyMessage?: string;
    emptyHint?: string;
    icon?: React.ComponentType<{ size?: number; className?: string }> | null;
    error?: string;
    compact?: boolean;
    inputClassName?: string;
}

function SearchableCombobox<T extends { id?: string | number } = any>({
    label,
    labelAction,
    placeholder = 'Pesquisar...',
    value,
    onChange,
    onSearch,
    renderItem,
    getDisplayValue = (item: any) => {
        if (!item) return '';
        const text = item.nome || item.razao_social || item.descricao || '';
        return item.id ? (text ? `${item.id} - ${text}` : String(item.id)) : text;
    },
    disabled = false,
    minChars = 0,
    emptyMessage = 'Nenhum resultado encontrado',
    emptyHint = 'Tente buscar com outro termo',
    icon: CustomIcon = null,
    error,
    compact = false,
    inputClassName,
}: SearchableComboboxProps<T>): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<T[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [initialOptions, setInitialOptions] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [browseAllLoading, setBrowseAllLoading] = useState(false);
    const [hasFetchedAll, setHasFetchedAll] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [errorMessage, setErrorMessage] = useState('');
    const [isClosing, setIsClosing] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ─── Close with animation ───
    const closeDropdown = useCallback(() => {
        if (!isOpen) return;
        setIsClosing(true);

        // Sincroniza imediatamente para remover texto parcial antes da animação terminar
        if (value) {
            setQuery(getDisplayValue(value));
        } else {
            setQuery('');
        }

        setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
            setHighlightIndex(-1);
        }, 150);
    }, [isOpen, value, getDisplayValue]);

    // ─── Sync input text with selected value ───
    useEffect(() => {
        if (!isOpen) {
            if (value) {
                setQuery(getDisplayValue(value));
            } else {
                setQuery('');
            }
        }
    }, [value, isOpen, getDisplayValue]);

    // ─── Click outside handler ───
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                closeDropdown();
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [closeDropdown]);

    // ─── Scroll highlighted item into view ───
    useEffect(() => {
        if (highlightIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('[data-combobox-item]');
            if (items[highlightIndex]) {
                (items[highlightIndex] as HTMLElement).scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [highlightIndex]);

    // ─── Async fetch ───
    const fetchOptions = useCallback(async (searchText: string) => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const results = await onSearch(searchText);
            setOptions(results || []);

            // Se o texto de busca for estritamente numérico e houver exatamente 1 resultado correspondente, auto-selecionar!
            const numeric = /^\d+$/.test(searchText.trim());
            if (numeric && results && results.length === 1) {
                const matched = results[0];
                if (String(matched.id) === searchText.trim()) {
                    setQuery(getDisplayValue(matched));
                    onChange(matched);
                    setIsOpen(false);
                    setIsClosing(false);
                    setHighlightIndex(-1);
                    setIsLoading(false);
                    setBrowseAllLoading(false);
                    return;
                }
            }

            if (!searchText) {
                setHasFetchedAll(true);
                setInitialOptions(results || []); // cache para restaurar ao limpar query
            } else {
                setHasFetchedAll(false);
            }
        } catch (err) {
            console.error('SearchableCombobox fetch error:', err);
            setErrorMessage('Erro ao buscar. Tente novamente.');
            setOptions([]);
        } finally {
            setIsLoading(false);
            setBrowseAllLoading(false);
        }
    }, [onSearch, onChange, getDisplayValue]);

    // ─── "Ver todos" handler ───
    const handleBrowseAll = useCallback(() => {
        setBrowseAllLoading(true);
        setHasFetchedAll(false);
        fetchOptions('');
    }, [fetchOptions]);

    // ─── Open handler ───
    const handleOpen = useCallback(() => {
        if (disabled) return;
        setIsOpen(true);
        setIsClosing(false);
        setHighlightIndex(-1);
        if (minChars === 0 && !hasFetchedAll) {
            fetchOptions('');
        }
    }, [disabled, hasFetchedAll, fetchOptions, minChars]);

    // ─── Input change handler ───
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value.toUpperCase();
        setQuery(text);
        setErrorMessage('');
        if (!isOpen) {
            setIsOpen(true);
            setIsClosing(false);
        }

        if (text === '') {
            onChange(null);
            setHighlightIndex(-1);
            if (minChars === 0) {
                fetchOptions('');
            } else {
                setOptions([]);
                setHasFetchedAll(false);
            }
            return;
        }

        // Se já temos todos os dados em cache (≤ threshold), filtragem é local — não dispara nova busca
        // Desativado: Como a API tem limites de linhas (ex: 100), hasFetchedAll pode ser true mesmo
        // sem termos todos os dados. Isso impedia a busca de itens que não vieram na primeira página.
        // if (hasFetchedAll && options.length <= AUTO_SHOW_THRESHOLD) return;

        const numeric = /^\d+$/.test(text);
        const threshold = (minChars > 0 && numeric) ? 1 : minChars;
        if (text.length >= threshold) {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                fetchOptions(text);
            }, 300);
        }
    };

    // ─── Keyboard navigation ───
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                handleOpen();
            }
            // Enter com dropdown fechado: não interceptar → listener global avança o campo
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex(prev =>
                    prev < displayedOptions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex(prev =>
                    prev > 0 ? prev - 1 : displayedOptions.length - 1
                );
                break;
            case 'Enter': {
                e.preventDefault();
                if (highlightIndex >= 0 && highlightIndex < displayedOptions.length) {
                    handleSelect(displayedOptions[highlightIndex]);
                } else if (displayedOptions.length > 0) {
                    // Nenhuma opção explicitamente destacada: seleciona a primeira
                    handleSelect(displayedOptions[0]);
                } else {
                    // Nenhuma opção disponível: apenas fecha o dropdown
                    closeDropdown();
                }
                // Navega para o próximo campo após a animação de fechamento (150 ms)
                if (inputRef.current) {
                    const input = inputRef.current;
                    setTimeout(() => focusNextField(input), 160);
                }
                break;
            }
            case 'Escape':
                e.preventDefault();
                closeDropdown();
                inputRef.current?.blur();
                break;
            case 'Tab':
                closeDropdown();
                break;
        }
    };

    // ─── Select handler ───
    const handleSelect = (item: T) => {
        setQuery(getDisplayValue(item));
        onChange(item);
        closeDropdown();
    };

    // ─── Clear handler ───
    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setQuery('');
        onChange(null);
        setErrorMessage('');
        setOptions([]);
        setHasFetchedAll(false);
        closeDropdown();
    };

    // ─── Retry after error ───
    const handleRetry = () => {
        setErrorMessage('');
        fetchOptions(query);
    };

    const isNumeric = /^\d+$/.test(query);
    const effectiveMinChars = (minChars > 0 && isNumeric) ? 1 : minChars;
    const isTypingHint = effectiveMinChars > 0 && query.length < effectiveMinChars && !hasFetchedAll;

    // Bypassa o minChars quando já temos todos os dados dentro do threshold
    const inAutoShowMode = hasFetchedAll && options.length <= AUTO_SHOW_THRESHOLD;

    // ─── Local filter and Smart Sort ───
    const displayedOptions = useMemo(() => {
        if (isTypingHint) return [];

        let results = options;

        // If data is fully loaded in memory, filter it locally
        if (hasFetchedAll && query) {
            const isSelectedValueQuery = value && query === getDisplayValue(value);
            if (!isSelectedValueQuery) {
                const q = query.toLowerCase();
                const matchesQuery = (item: T, search: string) => {
                    const display = getDisplayValue(item).toLowerCase();
                    const idStr = item.id !== undefined && item.id !== null ? String(item.id).toLowerCase() : '';
                    return display.includes(search) || idStr.includes(search);
                };
                results = options.filter(item => matchesQuery(item, q));
            }
        }

        // Apply Smart Sort (Relevance Sort)
        if (query && results.length > 0) {
            const q = query.toLowerCase();
            return [...results].sort((a, b) => {
                const displayA = getDisplayValue(a).toLowerCase();
                const displayB = getDisplayValue(b).toLowerCase();
                const idA = a.id !== undefined && a.id !== null ? String(a.id).toLowerCase() : '';
                const idB = b.id !== undefined && b.id !== null ? String(b.id).toLowerCase() : '';

                // Helper para extrair só a parte do texto caso seja "id - texto"
                const getJustText = (display: string, id: string) => {
                    if (id && display.startsWith(id + ' - ')) {
                        return display.substring(id.length + 3);
                    }
                    return display;
                };
                
                const textA = getJustText(displayA, idA);
                const textB = getJustText(displayB, idB);

                // 1. Exact match on ID
                if (idA === q && idB !== q) return -1;
                if (idB === q && idA !== q) return 1;

                // 2. Exact match on Display Value or Just Text
                const exactA = displayA === q || textA === q;
                const exactB = displayB === q || textB === q;
                if (exactA && !exactB) return -1;
                if (exactB && !exactA) return 1;

                // 3. Starts with query (Display Value, Just Text, or ID)
                const startsA = displayA.startsWith(q) || idA.startsWith(q) || textA.startsWith(q);
                const startsB = displayB.startsWith(q) || idB.startsWith(q) || textB.startsWith(q);
                if (startsA && !startsB) return -1;
                if (startsB && !startsA) return 1;
                
                // 4. Contains query
                const containsA = displayA.includes(q) || textA.includes(q);
                const containsB = displayB.includes(q) || textB.includes(q);
                if (containsA && !containsB) return -1;
                if (containsB && !containsA) return 1;

                // 5. Maintain relative order for others
                return 0;
            });
        }

        return results;
    }, [inAutoShowMode, hasFetchedAll, query, minChars, options, getDisplayValue, isTypingHint]);

    // Só exibe o hint de "continue digitando" quando não estamos em auto-show e ainda não buscamos todos
    const showTypingHint = isTypingHint && !inAutoShowMode && !hasFetchedAll;

    const showDropdown = isOpen;
    const isSelected = (item: T) => value && item.id === value.id;

    // ─── Text highlight helper ───
    const highlightText = (text: string, search: string): React.ReactNode => {
        if (!search || !text) return text;
        const idx = text.toLowerCase().indexOf(search.toLowerCase());
        if (idx === -1) return text;
        return (
            <>
                {text.slice(0, idx)}
                <mark className="bg-indigo-100 text-indigo-800 rounded-sm px-0.5 font-semibold">
                    {text.slice(idx, idx + search.length)}
                </mark>
                {text.slice(idx + search.length)}
            </>
        );
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {label && (
                <div className={`flex items-center justify-between ml-0.5 ${compact ? 'mt-0 mb-0.5' : 'mt-1 mb-1.5 ml-1'}`}>
                    <label className={`block font-bold uppercase tracking-widest ${compact ? 'text-[9px]' : 'text-[10px]'} ${error ? 'text-rose-500' : 'text-slate-400'}`}>
                        {label} {error && <span className="normal-case font-normal text-rose-500 ml-1">— {error}</span>}
                    </label>
                    {labelAction && <div className="ml-2 flex items-center">{labelAction}</div>}
                </div>
            )}

            {/* ─── Input Container ─── */}
            <div
                className={`
                    relative flex items-center group
                    transition-all duration-200 ease-out
                    rounded-xl border bg-slate-50 shadow-inner
                    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
                    ${error
                        ? 'border-rose-400 bg-rose-50/10 ring-4 ring-rose-50 shadow-lg shadow-rose-100/30'
                        : isOpen
                            ? 'border-indigo-400 bg-white ring-4 ring-indigo-50 shadow-lg shadow-indigo-100/30'
                            : value
                                ? 'border-indigo-200 bg-indigo-50/30 hover:border-indigo-300'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-white'
                    }
                `}
            >
                {/* Search Icon */}
                <div className={`
                    pl-3.5 flex items-center transition-colors duration-200
                    ${error ? 'text-rose-500' : isOpen ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}
                `}>
                    {CustomIcon
                        ? <CustomIcon size={16} />
                        : isLoading
                            ? <Loader2 size={16} className="animate-spin text-indigo-500" />
                            : <Search size={16} />
                    }
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    value={query}
                    onChange={handleInputChange}
                    onClick={handleOpen}
                    onFocus={handleOpen}
                    onKeyDown={handleKeyDown}
                    onBlur={(e) => {
                        if (wrapperRef.current && !wrapperRef.current.contains(e.relatedTarget as Node)) {
                            closeDropdown();
                        }
                    }}
                    placeholder={placeholder}
                    autoComplete="new-password"
                    name={`search-${Math.random()}`}
                    spellCheck="false"
                    className={`
                        w-full text-xs uppercase font-normal bg-transparent px-2.5 pr-10 outline-none
                        placeholder:text-slate-400
                        ${compact ? 'py-1' : 'py-2.5'}
                        ${disabled ? 'cursor-not-allowed' : ''}
                        ${error ? 'text-rose-700' : value ? 'text-indigo-700' : 'text-slate-700'}
                        ${inputClassName || ''}
                    `}
                />

                {/* Right Icons */}
                <div className="absolute right-3 flex items-center gap-1">
                    {isLoading && (
                        <Loader2 size={15} className="text-indigo-500 animate-spin" />
                    )}
                    {value && !disabled && !isLoading ? (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150 rounded-full p-1"
                            title="Limpar seleção"
                        >
                            <X size={13} />
                        </button>
                    ) : !isLoading ? (
                        <ChevronDown
                            size={16}
                            className={`
                                text-slate-400 transition-all duration-200
                                ${error ? 'text-rose-400' : isOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-slate-500'}
                            `}
                        />
                    ) : null}
                </div>
            </div>

            {!label && error && error.trim() && (
                <span className="text-[10px] text-rose-500 font-bold ml-1.5 mt-1 block uppercase tracking-wider animate-fade-in">
                    {error}
                </span>
            )}

            {/* ─── Dropdown ─── */}
            {showDropdown && (
                <div
                    className={`
                        absolute top-full mt-1.5 left-0 right-0 z-[9999]
                        bg-white border border-slate-200/80
                        rounded-xl overflow-hidden
                        shadow-2xl shadow-slate-900/10
                        ${isClosing
                            ? 'animate-combobox-close'
                            : 'animate-combobox-open'
                        }
                    `}
                    style={{ maxHeight: '340px' }}
                >
                    {/* ── Typing Hint com botão "Ver todos" ── */}
                    {showTypingHint && !errorMessage && (
                        <div className="p-4 flex flex-col items-center gap-2 text-center">
                            <Search size={18} className="text-slate-300 mb-1" />
                            <p className="text-sm font-semibold text-slate-500">
                                {query.length === 0
                                    ? `Digite ao menos ${minChars} caracteres (ou um código numérico)`
                                    : 'Continue digitando...'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {query.length} de {effectiveMinChars} caracteres
                            </p>
                            <button
                                type="button"
                                onClick={handleBrowseAll}
                                disabled={browseAllLoading}
                                className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-600 border border-teal-300/50 hover:bg-teal-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {browseAllLoading
                                    ? <Loader2 size={12} className="animate-spin" />
                                    : <List size={12} />
                                }
                                {browseAllLoading ? 'Carregando...' : 'Ver todos os registros'}
                            </button>
                        </div>
                    )}

                    {/* ── Error State ── */}
                    {errorMessage && (
                        <div className="p-4 flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                                <AlertCircle size={20} className="text-rose-500" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">{errorMessage}</p>
                            <button
                                type="button"
                                onClick={handleRetry}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}

                    {/* ── Loading Shimmer ── */}
                    {isLoading && !errorMessage && displayedOptions.length === 0 && (
                        <div className="p-2 space-y-1">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                                    <div
                                        className="h-4 bg-slate-100 rounded-md animate-pulse"
                                        style={{ width: `${60 + Math.random() * 30}%`, animationDelay: `${i * 100}ms` }}
                                    />
                                    <div
                                        className="h-3.5 bg-slate-100 rounded-md animate-pulse ml-auto"
                                        style={{ width: '32px', animationDelay: `${i * 100 + 50}ms` }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Results ── */}
                    {!errorMessage && displayedOptions.length > 0 && (
                        <>
                            <div
                                ref={listRef}
                                className="p-1.5 overflow-y-auto"
                                style={{ maxHeight: '280px' }}
                                role="listbox"
                            >
                                {displayedOptions.map((item, index) => {
                                    const selected = isSelected(item);
                                    const highlighted = index === highlightIndex;
                                    return (
                                        <button
                                            key={`item-${item.id !== undefined ? item.id : 'idx'}-${index}`}
                                            type="button"
                                            data-combobox-item
                                            onClick={() => handleSelect(item)}
                                            onMouseEnter={() => setHighlightIndex(index)}
                                            role="option"
                                            aria-selected={selected}
                                            className={`
                                                w-full text-left px-3 py-2.5 rounded-lg text-[10px] uppercase font-normal
                                                transition-all duration-100 outline-none
                                                flex items-center gap-3
                                                ${highlighted
                                                    ? 'bg-indigo-50 text-slate-900'
                                                    : selected
                                                        ? 'bg-indigo-50/50 text-indigo-700'
                                                        : 'text-slate-700 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <div className="flex-1 min-w-0">
                                                {renderItem
                                                    ? renderItem(item, highlightText, query)
                                                    : highlightText(getDisplayValue(item), query)
                                                }
                                            </div>

                                            {/* Selected check */}
                                            {selected && (
                                                <div className="shrink-0 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Footer with count */}
                            <div className="px-3 py-2 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] text-slate-400 font-medium">
                                    {displayedOptions.length} resultado{displayedOptions.length !== 1 ? 's' : ''}
                                    {inAutoShowMode && query && options.length > displayedOptions.length && (
                                        <span className="ml-1 text-slate-300">de {options.length}</span>
                                    )}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                    ↑↓ navegar  ⏎ selecionar
                                </span>
                            </div>
                        </>
                    )}

                    {/* ── Empty State ── */}
                    {!isLoading && !errorMessage && !showTypingHint && displayedOptions.length === 0 && (
                        <div className="p-6 flex flex-col items-center gap-2 text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                                <MapPin size={22} className="text-slate-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-600">{emptyMessage}</p>
                            <p className="text-xs text-slate-400">{emptyHint}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchableCombobox;
