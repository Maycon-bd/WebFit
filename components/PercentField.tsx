import React, { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';

export interface PercentFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: number | null;
    onChange?: (value: number | undefined) => void;
    label?: string;
    error?: string;
}

export const PercentField = forwardRef<HTMLInputElement, PercentFieldProps>(
    ({ value, onChange, label, error, className = '', disabled, ...props }, ref) => {
        // Internal state allows typing '5,' without the comma disappearing due to float parsing
        const [localVal, setLocalVal] = useState<string>('');

        useEffect(() => {
            if (typeof value === 'number') {
                const parsedLocal = parseFloat(localVal.replace(',', '.'));
                // Only update local value from external if it significantly differs 
                // (prevents cursor jumping while typing decimals)
                if (isNaN(parsedLocal) || Math.abs(parsedLocal - value) > 0.001) {
                    setLocalVal(value.toFixed(2).replace('.', ','));
                }
            } else {
                setLocalVal('');
            }
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let val = e.target.value.replace(/[^0-9,]/g, ''); // keep only numbers and comma
            
            // prevent multiple commas
            const commaCount = (val.match(/,/g) || []).length;
            if (commaCount > 1) {
                val = val.substring(0, val.lastIndexOf(','));
            }

            setLocalVal(val);

            if (!onChange) return;

            if (!val || val === ',') {
                onChange(undefined);
                return;
            }

            const numeric = parseFloat(val.replace(',', '.'));
            if (!isNaN(numeric)) {
                onChange(numeric);
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (localVal && localVal !== ',') {
                const numeric = parseFloat(localVal.replace(',', '.'));
                if (!isNaN(numeric)) {
                    setLocalVal(numeric.toFixed(2).replace('.', ','));
                }
            }
            if (props.onBlur) props.onBlur(e);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (!disabled) {
                setLocalVal('');
                if (onChange) onChange(undefined);
            }
            if (props.onFocus) props.onFocus(e);
        };

        const hasError = !!error;

        return (
            <div className="flex flex-col space-y-1">
                {label && (
                    <label className={`text-xs font-semibold uppercase tracking-wider ${hasError ? 'text-rose-500' : 'text-slate-500'}`}>
                        {label}
                        {hasError && <span className="normal-case font-normal text-rose-500 ml-1">- {error}</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    type="text"
                    value={localVal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    disabled={disabled}
                    className={`w-full text-sm bg-slate-50 border rounded-xl px-4 py-2.5 outline-none text-right font-bold text-slate-800 transition-colors ${
                        hasError ? 'border-rose-400 ring-2 ring-rose-50' : 'border-slate-200 focus:bg-white focus:border-corp-teal'
                    } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-100' : ''} ${className}`}
                    {...props}
                />
            </div>
        );
    }
);
PercentField.displayName = 'PercentField';
