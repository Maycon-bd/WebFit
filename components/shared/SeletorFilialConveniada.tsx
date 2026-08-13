import React, { useState, useEffect } from 'react';
import SearchableCombobox from '../SearchableCombobox';

export interface SelecaoFilialConveniada {
    filial: any | null;
    conveniada: any | null;
    sequencia: string | number;
}

export interface SeletorFilialConveniadaProps {
    value?: SelecaoFilialConveniada;
    onChange: (selecao: SelecaoFilialConveniada) => void;
    onSearchFilial: (query: string) => Promise<any[]>;
    onSearchConveniada: (query: string, filialId?: number | string) => Promise<any[]>;
    disabled?: boolean;
}

export default function SeletorFilialConveniada({
    value,
    onChange,
    onSearchFilial,
    onSearchConveniada,
    disabled = false
}: SeletorFilialConveniadaProps) {
    const [filial, setFilial] = useState<any | null>(value?.filial || null);
    const [conveniada, setConveniada] = useState<any | null>(value?.conveniada || null);
    const [sequencia, setSequencia] = useState<string | number>(value?.sequencia || '');

    // Sync external value changes
    useEffect(() => {
        if (value) {
            setFilial(value.filial);
            setConveniada(value.conveniada);
            setSequencia(value.sequencia);
        }
    }, [value]);

    const handleChange = (f: any | null, c: any | null, s: string | number) => {
        setFilial(f);
        setConveniada(c);
        setSequencia(s);
        onChange({ filial: f, conveniada: c, sequencia: s });
    };

    const handleFilialChange = (novaFilial: any | null) => {
        // Se mudou a filial, limpa a conveniada e a sequencia
        handleChange(novaFilial, null, '');
    };

    const handleConveniadaChange = (novaConveniada: any | null) => {
        let f = filial;
        const fId = novaConveniada?.filial_id || novaConveniada?.id_filial || novaConveniada?.FILIAL || (typeof novaConveniada?.filial !== 'object' ? novaConveniada?.filial : null) || novaConveniada?.filial?.id;

        if (novaConveniada && fId) {
            if (!filial || filial.id !== fId || filial.ID !== fId) {
                if (novaConveniada.filial && typeof novaConveniada.filial === 'object') {
                    f = novaConveniada.filial;
                } else {
                    const fNome = novaConveniada.nome_filial || novaConveniada.NOME_FILIAL || `Filial ${fId}`;
                    f = { id: fId, nome: fNome, NOME: fNome, ID: fId };
                }
            }
        }
        
        let s = sequencia;
        if (novaConveniada?.sequencia !== undefined || novaConveniada?.SEQUENCIA !== undefined) {
            s = novaConveniada?.sequencia ?? novaConveniada?.SEQUENCIA;
        }

        handleChange(f, novaConveniada, s);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-end w-full">
            <div className="flex-1">
                <SearchableCombobox
                    label="Filial"
                    placeholder="Buscar filial..."
                    value={filial}
                    onChange={handleFilialChange}
                    onSearch={onSearchFilial}
                    disabled={disabled}
                    minChars={0}
                    emptyMessage="Nenhuma filial encontrada"
                />
            </div>
            
            <div className="flex-1">
                <SearchableCombobox
                    label="Conveniada"
                    placeholder="Buscar conveniada..."
                    value={conveniada}
                    onChange={handleConveniadaChange}
                    // Passa o id da filial se houver, para o backend filtrar (regra 1)
                    onSearch={(q) => onSearchConveniada(q, filial?.id)}
                    disabled={disabled}
                    minChars={0}
                    emptyMessage={filial ? "Nenhuma conveniada para esta filial" : "Nenhuma conveniada encontrada"}
                />
            </div>

            <div className="flex-1">
                <label className="block font-bold uppercase tracking-widest text-[10px] mt-1 mb-1.5 ml-1 text-slate-400">
                    Sequência
                </label>
                <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:border-[#3bbfad] outline-none transition-all shadow-inner text-slate-700 disabled:opacity-50"
                    placeholder="Nº"
                    value={sequencia}
                    onChange={(e) => handleChange(filial, conveniada, e.target.value)}
                    disabled={disabled}
                />
            </div>
        </div>
    );
}
