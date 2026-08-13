import React, { forwardRef, InputHTMLAttributes, useState, useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export interface DateFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'defaultValue'> {
    value?: string | null; // ISO: 'yyyy-MM-dd' ou null/undefined
    onChange?: (value: string | undefined) => void; // Retorna ISO 'yyyy-MM-dd' ou undefined
    label?: string;
    error?: string;
    defaultDate?: Date; // Data padrão ao montar (opcional)
}

/** Auxiliar para converter Date ou string ISO para apenas dígitos DDMMYYYY */
const isoToDigits = (iso: string): string => {
    if (!iso || iso.length < 10) return '';
    const parts = iso.substring(0, 10).split('-');
    if (parts.length !== 3) return '';
    const [y, m, d] = parts;
    return `${d.padStart(2, '0')}${m.padStart(2, '0')}${y}`;
};

/** Auxiliar para converter Date para apenas dígitos DDMMYYYY */
const dateToDigits = (dt: Date): string => {
    const d = String(dt.getDate()).padStart(2, '0');
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const y = String(dt.getFullYear());
    return `${d}${m}${y}`;
};

/** Auxiliar para converter dígitos DDMMYYYY em ISO 'yyyy-MM-dd' */
const digitsToIso = (digits: string): string | undefined => {
    if (digits.length !== 8) return undefined;
    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);
    return `${y}-${m}-${d}`;
};

/** Formata a string de dígitos DDMMYYYY mantendo a máscara / / sempre visível */
const formatDisplay = (digits: string, isFocused: boolean): string => {
    if (!digits) {
        return isFocused ? '  /  /    ' : '';
    }

    const d = digits.slice(0, 2);
    const m = digits.slice(2, 4);
    const y = digits.slice(4, 8);

    if (digits.length < 2) {
        return `${d} /  /    `;
    }
    if (digits.length === 2) {
        return `${d}/  /    `;
    }
    if (digits.length < 4) {
        return `${d}/${m} /    `;
    }
    if (digits.length === 4) {
        return `${d}/${m}/    `;
    }
    if (digits.length < 8) {
        return `${d}/${m}/${y}${' '.repeat(8 - digits.length)}`;
    }
    return `${d}/${m}/${y}`;
};

/** Calcula a posição ideal do cursor com base no número de dígitos */
const getCursorPos = (len: number): number => {
    if (len <= 2) return len === 2 ? 3 : len;
    if (len <= 4) return len === 4 ? 6 : len + 1;
    return len + 2;
};

/** Valida se dia, mês e ano formam uma data real válida no calendário */
const isValidDate = (d: number, m: number, y: number): boolean => {
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1000 || y > 9999) return false;
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
};

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
    (
        {
            value,
            onChange,
            label,
            error,
            defaultDate,
            className = '',
            disabled,
            readOnly,
            onFocus,
            onBlur,
            onKeyDown,
            ...props
        },
        ref
    ) => {
        const { showToast } = useToast();
        const internalRef = useRef<HTMLInputElement | null>(null);

        const setRefs = (element: HTMLInputElement | null) => {
            internalRef.current = element;
            if (typeof ref === 'function') {
                ref(element);
            } else if (ref) {
                (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
            }
        };

        const [rawDigits, setRawDigits] = useState<string>(() => {
            if (value) return isoToDigits(value);
            if (defaultDate) return dateToDigits(defaultDate);
            return '';
        });

        const [isFocused, setIsFocused] = useState<boolean>(false);
        const [invalidDateError, setInvalidDateError] = useState<boolean>(false);
        const isInitialMount = useRef(true);

        const [showCalendar, setShowCalendar] = useState(false);
        const [calendarDate, setCalendarDate] = useState(new Date());
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const handleClickOutside = (e: MouseEvent) => {
                if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                    setShowCalendar(false);
                }
            };
            if (showCalendar) {
                document.addEventListener('mousedown', handleClickOutside);
            }
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showCalendar]);

        const handleToggleCalendar = () => {
            if (disabled || readOnly) return;
            if (!showCalendar) {
                if (rawDigits.length === 8) {
                    const d = parseInt(rawDigits.slice(0, 2), 10);
                    const m = parseInt(rawDigits.slice(2, 4), 10);
                    const y = parseInt(rawDigits.slice(4, 8), 10);
                    if (isValidDate(d, m, y)) {
                        setCalendarDate(new Date(y, m - 1, d));
                    } else {
                        setCalendarDate(new Date());
                    }
                } else {
                    setCalendarDate(new Date());
                }
            }
            setShowCalendar(!showCalendar);
        };

        const handleSelectDate = (d: number, m: number, y: number) => {
            const dt = new Date(y, m, d);
            const digits = dateToDigits(dt);
            setRawDigits(digits);
            setInvalidDateError(false);
            if (onChange) {
                onChange(digitsToIso(digits));
            }
            setShowCalendar(false);
        };

        // Notifica o pai se defaultDate tiver sido fornecido no primeiro carregamento sem value
        useEffect(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                if (!value && defaultDate && onChange) {
                    const iso = digitsToIso(dateToDigits(defaultDate));
                    if (iso) onChange(iso);
                }
            }
        }, [defaultDate, onChange, value]);

        const rawDigitsRef = useRef(rawDigits);
        rawDigitsRef.current = rawDigits;

        // Sincroniza com value externo quando alterado
        useEffect(() => {
            if (value !== undefined) {
                const currentIso = digitsToIso(rawDigitsRef.current) || '';
                const newIso = value || '';
                
                // Só atualizamos rawDigits se o novo valor ISO do pai for diferente 
                // do ISO que nosso rawDigits atual representa.
                // Isso evita que o pai apague o rawDigits no meio da digitação.
                if (newIso !== currentIso) {
                    const newDigits = value ? isoToDigits(value) : '';
                    setRawDigits(newDigits);
                    if (newDigits.length === 8) {
                        setInvalidDateError(false);
                    }
                }
            }
        }, [value]);

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (disabled || readOnly) return;

            const nativeInput = e.target;
            const cursorInNative = nativeInput.selectionStart || 0;
            const valueBeforeCursor = nativeInput.value.slice(0, cursorInNative);
            const digitsBeforeCursor = valueBeforeCursor.replace(/\D/g, '').length;

            let inputVal = nativeInput.value.replace(/\D/g, '');
            if (inputVal.length > 8) {
                inputVal = inputVal.slice(0, 8);
            }

            setRawDigits(inputVal);
            setInvalidDateError(false);

            // Ajusta o cursor limitando à quantidade total de dígitos no novo valor
            const targetDigitsBeforeCursor = Math.min(digitsBeforeCursor, inputVal.length);
            const nextCursor = getCursorPos(targetDigitsBeforeCursor);
            
            requestAnimationFrame(() => {
                if (internalRef.current) {
                    internalRef.current.setSelectionRange(nextCursor, nextCursor);
                }
            });

            if (!onChange) return;

            if (inputVal.length === 8) {
                const d = parseInt(inputVal.slice(0, 2), 10);
                const m = parseInt(inputVal.slice(2, 4), 10);
                const y = parseInt(inputVal.slice(4, 8), 10);

                if (isValidDate(d, m, y)) {
                    onChange(digitsToIso(inputVal));
                } else {
                    onChange(undefined);
                }
            } else {
                onChange(undefined);
            }
        };

        const handleFocusEvent = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            const cursorPos = getCursorPos(rawDigits.length);
            requestAnimationFrame(() => {
                if (internalRef.current) {
                    internalRef.current.setSelectionRange(cursorPos, cursorPos);
                }
            });

            if (onFocus) onFocus(e);
        };

        const handleBlurEvent = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (!disabled && !readOnly) {
                if (rawDigits.length === 8) {
                    const d = parseInt(rawDigits.slice(0, 2), 10);
                    const m = parseInt(rawDigits.slice(2, 4), 10);
                    const y = parseInt(rawDigits.slice(4, 8), 10);

                    if (!isValidDate(d, m, y)) {
                        const fieldLabel = label ? `"${label}"` : 'informada';
                        showToast(`A data ${fieldLabel} é inválida.`, 'warning');
                        setRawDigits('');
                        setInvalidDateError(true);
                        if (onChange) onChange(undefined);
                    } else {
                        setInvalidDateError(false);
                    }
                } else if (rawDigits.length > 0) {
                    setRawDigits('');
                    setInvalidDateError(false);
                    if (onChange) onChange(undefined);
                }
            }

            if (onBlur) onBlur(e);
        };

        const handleKeyDownEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (disabled || readOnly) {
                if (onKeyDown) onKeyDown(e);
                return;
            }

            if (e.key === 'Backspace') {
                e.preventDefault();
                setInvalidDateError(false);

                if (!rawDigits) return;

                const input = internalRef.current;
                const selStart = input?.selectionStart ?? 0;
                const selEnd = input?.selectionEnd ?? 0;

                let newDigits = rawDigits;
                let nextPos = 0;

                if (selStart !== selEnd) {
                    const getDigitsBefore = (pos: number): number => {
                        if (pos <= 0) return 0;
                        if (pos <= 2) return pos;
                        if (pos === 3) return 2;
                        if (pos <= 5) return pos - 1;
                        if (pos === 6) return 4;
                        return pos - 2;
                    };
                    const startDigit = getDigitsBefore(selStart);
                    const endDigit = getDigitsBefore(selEnd);
                    newDigits = rawDigits.slice(0, startDigit) + rawDigits.slice(endDigit);
                    nextPos = getCursorPos(startDigit);
                } else {
                    // Mapeia posição visual (0..10) para o dígito à ESQUERDA do cursor (comportamento padrão do Backspace)
                    const getDigitIndexToLeft = (pos: number): number => {
                        if (pos <= 0) return -1;
                        if (pos === 1) return 0;       // após D1
                        if (pos === 2) return 1;       // após D2
                        if (pos === 3) return 1;       // após '/' → remove D2 (à esquerda da barra)
                        if (pos === 4) return 2;       // após M1
                        if (pos === 5) return 3;       // após M2
                        if (pos === 6) return 3;       // após '/' → remove M2 (à esquerda da barra)
                        if (pos === 7) return 4;       // após Y1
                        if (pos === 8) return 5;       // após Y2
                        if (pos === 9) return 6;       // após Y3
                        return 7;                      // pos >= 10, após Y4
                    };

                    let targetIdx = getDigitIndexToLeft(selStart);

                    if (targetIdx < 0) {
                        // Cursor no início: nada à esquerda para apagar
                        newDigits = rawDigits;
                        nextPos = 0;
                    } else {
                        // Se cursor estiver além dos dígitos preenchidos, clampeia ao último
                        if (targetIdx >= rawDigits.length) {
                            targetIdx = rawDigits.length - 1;
                        }
                        // Remove o dígito à esquerda do cursor
                        newDigits = rawDigits.slice(0, targetIdx) + rawDigits.slice(targetIdx + 1);
                        nextPos = getCursorPos(targetIdx);
                    }
                }

                setRawDigits(newDigits);

                requestAnimationFrame(() => {
                    if (internalRef.current) {
                        internalRef.current.setSelectionRange(nextPos, nextPos);
                    }
                });

                if (onChange) {
                    onChange(digitsToIso(newDigits));
                }
                return;
            }

            if (e.key === 't' || e.key === 'T') {
                e.preventDefault();
                const today = new Date();
                const todayDigits = dateToDigits(today);
                setRawDigits(todayDigits);
                setInvalidDateError(false);

                if (onChange) {
                    const iso = digitsToIso(todayDigits);
                    onChange(iso);
                }
                return;
            }

            if (onKeyDown) onKeyDown(e);
        };

        const renderCalendar = () => {
            if (!showCalendar) return null;

            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();

            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startDay = new Date(year, month, 1).getDay();

            const days = [];
            for (let i = 0; i < startDay; i++) {
                days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
            }
            for (let d = 1; d <= daysInMonth; d++) {
                const isSelected = rawDigits.length === 8 && 
                    parseInt(rawDigits.slice(0, 2), 10) === d && 
                    parseInt(rawDigits.slice(2, 4), 10) === month + 1 && 
                    parseInt(rawDigits.slice(4, 8), 10) === year;
                
                const isToday = new Date().getDate() === d && new Date().getMonth() === month && new Date().getFullYear() === year;

                days.push(
                    <button
                        key={d}
                        type="button"
                        onClick={() => handleSelectDate(d, month, year)}
                        className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-colors ${
                            isSelected ? 'bg-corp-teal text-white font-medium shadow-sm' :
                            isToday ? 'bg-slate-100 text-corp-teal font-semibold' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        {d}
                    </button>
                );
            }

            const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

            return (
                <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-slate-200 shadow-xl rounded-xl p-3 w-[260px]">
                    <div className="flex items-center justify-between mb-3">
                        <button
                            type="button"
                            onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-sm font-semibold text-slate-700">
                            {monthNames[month]} {year}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {weekDays.map((wd, i) => (
                            <div key={i} className="h-6 flex items-center justify-center text-xs font-medium text-slate-400">
                                {wd}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {days}
                    </div>
                </div>
            );
        };

        const hasError = !!error || invalidDateError;
        const displayValue = formatDisplay(rawDigits, isFocused);

        return (
            <div className="flex flex-col space-y-1" ref={containerRef}>
                {label && (
                    <label
                        className={`text-xs font-semibold uppercase tracking-wider ${
                            hasError ? 'text-rose-500' : 'text-slate-500'
                        }`}
                    >
                        {label}
                        {error && <span className="normal-case font-normal text-rose-500 ml-1">- {error}</span>}
                    </label>
                )}
                <div className="relative w-full">
                    <input
                        ref={setRefs}
                        type="text"
                        inputMode="numeric"
                        placeholder="  /  /    "
                        value={displayValue}
                        onChange={handleInputChange}
                        onFocus={handleFocusEvent}
                        onBlur={handleBlurEvent}
                        onKeyDown={handleKeyDownEvent}
                        disabled={disabled}
                        readOnly={readOnly}
                        className={`w-full text-sm bg-slate-50 border rounded-xl pl-4 pr-10 py-2.5 outline-none font-medium text-slate-800 transition-colors ${
                            hasError
                                ? 'border-rose-400 ring-2 ring-rose-50'
                                : 'border-slate-200 focus:bg-white focus:border-corp-teal'
                        } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''} ${className}`}
                        {...props}
                    />
                    <button
                        type="button"
                        onClick={handleToggleCalendar}
                        disabled={disabled || readOnly}
                        className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                            disabled || readOnly ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-corp-teal'
                        }`}
                        tabIndex={-1}
                    >
                        <Calendar size={18} />
                    </button>
                    {renderCalendar()}
                </div>
            </div>
        );
    }
);

DateField.displayName = 'DateField';
