import React, { forwardRef, InputHTMLAttributes } from 'react';

export interface ValueFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value?: number | null;
    onChange?: (value: number | undefined) => void;
    label?: string;
    error?: string;
    decimals?: number;
}

export const ValueField = forwardRef<HTMLInputElement, ValueFieldProps>(
    ({ value, onChange, label, error, className = '', disabled, decimals = 2, ...props }, ref) => {
        const displayValue = typeof value === 'number' ? value.toFixed(decimals).replace('.', ',') : '';

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChange) return;
            const raw = e.target.value.replace(/\D/g, '');
            
            if (!raw) {
                onChange(undefined);
                return;
            }
            
            const divisor = Math.pow(10, decimals);
            const val = parseInt(raw, 10) / divisor;
            onChange(val);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (onChange && !disabled) {
                onChange(undefined);
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
                    value={displayValue}
                    onChange={handleChange}
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
ValueField.displayName = 'ValueField';
