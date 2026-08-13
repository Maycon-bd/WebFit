import React from 'react';
import SearchableCombobox from './SearchableCombobox';
import { api as axios } from '../services/apiService';

interface PesquisarCidadeProps {
    value?: any;
    onChange: (value: any) => void;
    disabled?: boolean;
    error?: boolean;
    errorMessage?: string;
}

const PesquisaCidade: React.FC<PesquisarCidadeProps> = ({
    value,
    onChange,
    disabled = false,
    error = false,
    errorMessage = 'obrigatório'
}) => {

    const handlePesquisarCidade = async (query: string) => {
        try {
            const params: { filter?: string } = {};
            if (query) {
                params.filter = `NOME LIKE '%${query.toUpperCase()}%'`;
            }

            const response = await axios.get('/admCidade', {
                params,
                timeout: 30000
            });

            const rawData = response.data || [];
            const normalizedData = Array.isArray(rawData) ? rawData.map(item => ({
                id: item.id || item.ID || item.Id || 0,
                nome: item.nome || item.NOME || item.Nome || '',
                uf: item.uf || item.UF || item.Uf || '',
                codigo_ibge: item.codigo_ibge || item.CODIGO_IBGE || item.cod_ibge || item.COD_IBGE || item.codigoIbge || ''
            })) : [];

            return normalizedData;
        } catch (err) {
            console.error('Erro ao buscar cidades na PesquisaCidade:', err);
            return [];
        }
    };

    return (
        <div className="space-y-1">
            <label className={`block text-xs font-semibold mb-1 uppercase tracking-wider ${error ? 'text-red-500' : 'text-slate-500'}`}>
                Cidade * {error && <span className="normal-case font-normal text-red-500 ml-1">— {errorMessage}</span>}
            </label>
            <SearchableCombobox
                error={error ? ' ' : undefined}
                placeholder="Digite o nome da cidade para buscar..."
                value={value?.id ? value : null}
                onSearch={handlePesquisarCidade}
                onChange={onChange}
                disabled={disabled}
                getDisplayValue={(c) => `${c.nome} / ${c.uf}`}
                renderItem={(c, highlightText, searchQuery) => (
                    <div className="flex items-center gap-3 w-full">
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-800 truncate">
                                {highlightText ? highlightText(c.nome, searchQuery) : c.nome}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                                Cód. IBGE: {c.codigo_ibge || c.id}
                            </div>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 text-[11px] font-bold rounded-md bg-corp-teal/20 text-corp-teal tracking-wide">
                            {c.uf}
                        </span>
                    </div>
                )}
                minChars={2}
                emptyMessage="Nenhuma cidade encontrada"
                emptyHint="Digite ao menos 2 caracteres para buscar"
            />
        </div>
    );
};

export default PesquisaCidade;
