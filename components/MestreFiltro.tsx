import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { DateField } from './DateField';

export type SearchFieldType = 'string' | 'date' | 'integer' | 'currency';

export interface SearchField {
    label: string;
    value: string;
    /** Tipo do campo, espelha o FieldType do Delphi (ConfiguraFiltro*). Default: 'string' */
    type?: SearchFieldType;
}

interface MestreFiltroProps {
    fields: SearchField[];
    searchCols: string[];
    newLabel?: string;
    onSearch: (filter: { advancedFilter: string }) => void;
    onClear: () => void;
    onNew?: () => void;
    onPrint?: () => void;
    onExport?: () => void;
    isLoading?: boolean;
    /** Controla se o usuário pode pesquisar (ACTION_PESQUISA). Default: true */
    podePesquisar?: boolean;
    /** Conteúdo extra renderizado como PRIMEIRO filtro, antes da coluna de busca */
    prefixSlot?: React.ReactNode;
    /** Oculta as seleções de Coluna de Busca e Operação */
    hideColunaOperacao?: boolean;
    /** Rótulo personalizado para o campo de texto (ex: "Nº C.P.") */
    textoLabel?: string;
    /** Placeholder personalizado para o campo de texto (ex: "Digite o Nº C.P...") */
    textoPlaceholder?: string;
    /** Classe customizada para a div receptora do campo de texto (ex: "w-36 shrink-0") */
    textoClassName?: string;
    /** Renderiza o campo de texto (ex: Nº C.P.) em primeiro lugar na barra de filtros */
    textoFirst?: boolean;
    // Opcionais para "Memória" dos filtros
    persistentState?: {
        coluna: string; setColuna: (v: string) => void;
        operacao: string; setOperacao: (v: string) => void;
        texto: string; setTexto: (v: string) => void;
        textoFim: string; setTextoFim: (v: string) => void;
    };
    children?: React.ReactNode;
}

// Rótulos alinhados ao TForm_TelaPadrao (PopulaComboBoxOperacao)
const OPERACOES_BASE = [
    { label: 'CONTÉM', value: 'LIKE_C' },
    { label: 'NÃO CONTÉM', value: 'NOT_LIKE' },
    { label: 'COMEÇA COM', value: 'LIKE_I' },
    { label: 'TERMINA COM', value: 'LIKE_F' },
    { label: 'IGUAL A', value: '=' },
    { label: 'DIFERENTE DE', value: '<>' },
    { label: 'MAIOR QUE', value: '>' },
    { label: 'MAIOR OU IGUAL A', value: '>=' },
    { label: 'MENOR QUE', value: '<' },
    { label: 'MENOR OU IGUAL A', value: '<=' },
];
const OPERACAO_ENTRE = { label: 'ESTÁ ENTRE', value: 'BETWEEN' };

// Label do campo de valor conforme o tipo (ConfiguraFiltro*)
const LABEL_INICIAL: Record<SearchFieldType, string> = {
    string: 'Texto',
    date: 'Data',
    integer: 'Número',
    currency: 'Valor',
};
const LABEL_FINAL: Record<SearchFieldType, string> = {
    string: 'Texto Final',
    date: 'Data Final',
    integer: 'Número Final',
    currency: 'Valor Final',
};

/** Converte ISO (yyyy-mm-dd do input type=date) para dd/MM/yyyy esperado pelo legado */
const isoToBrDate = (iso: string): string => {
    if (!iso) return '';
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return iso;
    return `${m[3]}/${m[2]}/${m[1]}`;
};

/**
 * Painel de Busca Genérico (MestreFiltro)
 * Unifica a lógica de filtros avançados para todas as telas.
 * O campo de filtragem se adapta ao tipo da coluna (data/número/valor/texto)
 * e à operação (ENTRE => dois campos), espelhando o TForm_TelaPadrao.
 */
const MestreFiltro = ({
    fields,
    searchCols,
    newLabel,
    onSearch,
    onClear,
    onNew,
    onPrint,
    onExport,
    isLoading,
    podePesquisar = true,
    prefixSlot,
    hideColunaOperacao = false,
    textoLabel,
    textoPlaceholder,
    textoClassName,
    textoFirst = false,
    persistentState,
    children
}: MestreFiltroProps) => {
    const [coluna, setColuna] = useState(persistentState?.coluna || '');
    const [operacao, setOperacao] = useState(persistentState?.operacao || 'LIKE_C');
    const [texto, setTexto] = useState(persistentState?.texto || '');
    const [textoFim, setTextoFim] = useState(persistentState?.textoFim || '');

    // Sincroniza com externo se houver mudança lá (ex: resetFilters)
    useEffect(() => {
        if (persistentState) {
            setColuna(persistentState.coluna);
            setOperacao(persistentState.operacao);
            setTexto(persistentState.texto);
            setTextoFim(persistentState.textoFim);
        }
    }, [persistentState?.coluna, persistentState?.operacao, persistentState?.texto, persistentState?.textoFim]);

    // Tipo do campo selecionado (TODAS AS COLUNAS => string), espelha RetornaComboBoxFieldType
    const currentType: SearchFieldType = useMemo(() => {
        if (!coluna) return 'string';
        return fields.find(f => f.value === coluna)?.type || 'string';
    }, [coluna, fields]);

    // Lista de operações: ENTRE só aparece quando uma coluna específica está selecionada
    const operacoesDisponiveis = useMemo(() => {
        return coluna ? [...OPERACOES_BASE, OPERACAO_ENTRE] : OPERACOES_BASE;
    }, [coluna]);

    const isEntre = operacao === 'BETWEEN';

    const buildFilterForColumn = (col: string, val1: string, val2: string) => {
        const v1 = val1.replace(/'/g, "''");
        const v2 = val2.replace(/'/g, "''");
        const getFieldType = (colValue: string): SearchFieldType => {
            const sourceFields = fields || [];
            const field = sourceFields.find(f => f.value === colValue);
            return field?.type || 'string';
        };
        const type = getFieldType(col);

        if (type === 'integer' || type === 'currency') {
            switch (operacao) {
                case '=': return `${col} = ${v1}`;
                case '<>': return `${col} <> ${v1}`;
                case '>': return `${col} > ${v1}`;
                case '>=': return `${col} >= ${v1}`;
                case '<': return `${col} < ${v1}`;
                case '<=': return `${col} <= ${v1}`;
                case 'LIKE_C': return `${col} LIKE '%${v1}%'`;
                case 'NOT_LIKE': return `${col} NOT LIKE '%${v1}%'`;
                case 'LIKE_I': return `${col} LIKE '${v1}%'`;
                case 'LIKE_F': return `${col} LIKE '%${v1}'`;
                case 'BETWEEN':
                    if (!v2) return `${col} >= ${v1}`;
                    return `${col} BETWEEN ${v1} AND ${v2}`;
                default: return '';
            }
        }

        if (type === 'date') {
            const d1 = `'${v1}'`;
            const d2 = `'${v2}'`;
            switch (operacao) {
                case '=': return `${col} = ${d1}`;
                case '<>': return `${col} <> ${d1}`;
                case '>': return `${col} > ${d1}`;
                case '>=': return `${col} >= ${d1}`;
                case '<': return `${col} < ${d1}`;
                case '<=': return `${col} <= ${d1}`;
                case 'LIKE_C': return `${col} LIKE '%${v1}%'`;
                case 'NOT_LIKE': return `${col} NOT LIKE '%${v1}%'`;
                case 'LIKE_I': return `${col} LIKE '${v1}%'`;
                case 'LIKE_F': return `${col} LIKE '%${v1}'`;
                case 'BETWEEN':
                    if (!v2) return `${col} >= ${d1}`;
                    return `${col} BETWEEN ${d1} AND ${d2}`;
                default: return '';
            }
        }

        const field = col;
        switch (operacao) {
            case '=': return `${field} = '${v1}'`;
            case '<>': return `${field} <> '${v1}'`;
            case '>': return `${col} > '${v1}'`;
            case '>=': return `${col} >= '${v1}'`;
            case '<': return `${col} < '${v1}'`;
            case '<=': return `${col} <= '${v1}'`;
            case 'LIKE_C': return `${field} LIKE '%${v1}%'`;
            case 'NOT_LIKE': return `${field} NOT LIKE '%${v1}%'`;
            case 'LIKE_I': return `${field} LIKE '${v1}%'`;
            case 'LIKE_F': return `${field} LIKE '%${v1}'`;
            case 'BETWEEN':
                if (!v2) return `${col} >= '${v1}'`;
                return `${col} BETWEEN '${v1}' AND '${v2}'`;
            default: return '';
        }
    };

    const handleSearchClick = () => {
        if (!texto.trim()) {
            onSearch({ advancedFilter: '' });
            return;
        }

        // String => UPPER (texto); data => ISO→dd/MM/yyyy; número/valor => sem UPPER
        let val1 = texto.trim();
        let val2 = textoFim.trim();
        if (currentType === 'string') {
            val1 = val1.toUpperCase();
            val2 = val2.toUpperCase();
        } else if (currentType === 'date') {
            val1 = isoToBrDate(val1);
            val2 = isoToBrDate(val2);
        }

        let filterStr = '';
        if (!coluna) {
            const conditions = searchCols.map(c => buildFilterForColumn(c, val1, val2));
            filterStr = `(${conditions.join(' OR ')})`;
        } else {
            filterStr = buildFilterForColumn(coluna, val1, val2);
        }

        onSearch({ advancedFilter: filterStr });
    };

    const handleClearClick = () => {
        setTexto('');
        setTextoFim('');
        setOperacao('LIKE_C');

        if (persistentState) {
            persistentState.setTexto('');
            persistentState.setTextoFim('');
            persistentState.setOperacao('LIKE_C');
        }

        onClear();
    };

    // Ao trocar a coluna: reseta operação para CONTÉM e limpa valores
    // (espelha PopulaComboBoxOperacao + HabilitaDesabilitaFiltros do Delphi)
    const handleColunaChange = (newColuna: string) => {
        setColuna(newColuna);
        setOperacao('LIKE_C');
        setTexto('');
        setTextoFim('');
        if (persistentState) {
            persistentState.setColuna(newColuna);
            persistentState.setOperacao('LIKE_C');
            persistentState.setTexto('');
            persistentState.setTextoFim('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, setValue?: (v: string) => void) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        } else if ((e.key === 't' || e.key === 'T') && currentType === 'date' && setValue) {
            e.preventDefault();
            const hoje = new Date().toISOString().substring(0, 10);
            setValue(hoje);
        }
    };

    // Restringe teclas em campos numéricos (espelha Edit_Texto*KeyPress)
    const handleNumberKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') { handleSearchClick(); return; }
        if (currentType === 'integer') {
            if (!/^[0-9]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete'
                && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        } else if (currentType === 'currency') {
            if (!/^[0-9,]$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete'
                && e.key !== 'Tab' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                e.preventDefault();
            }
        }
    };

    // Renderiza um input de valor conforme o tipo do campo
    const renderValorInput = (value: string, setValue: (v: string) => void, isFim: boolean) => {
        const baseCls = "w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:border-corp-teal outline-none transition-all duration-75 shadow-inner placeholder:text-slate-300";

        if (currentType === 'date') {
            return (
                <DateField
                    value={value}
                    onChange={(val) => { setValue(val || ''); }}
                    disabled={!podePesquisar}
                    className="w-full text-xs shadow-inner"
                />
            );
        }
        if (currentType === 'integer') {
            return (
                <input
                    type="number"
                    step={1}
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); }}
                    onKeyDown={handleNumberKeyDown}
                    disabled={!podePesquisar}
                    placeholder={textoPlaceholder || (isEntre ? (isFim ? 'Até...' : 'De...') : 'Digite o número...')}
                    className={`${baseCls} text-right`}
                />
            );
        }
        if (currentType === 'currency') {
            return (
                <input
                    type="number"
                    step="0.001"
                    inputMode="decimal"
                    value={value}
                    onChange={(e) => { setValue(e.target.value); }}
                    onKeyDown={handleNumberKeyDown}
                    disabled={!podePesquisar}
                    placeholder={textoPlaceholder || (isEntre ? (isFim ? 'Até...' : 'De...') : 'Digite o valor...')}
                    className={`${baseCls} text-right`}
                />
            );
        }
        // string
        return (
            <input
                type="text"
                value={value}
                onChange={(e) => { setValue(e.target.value); }}
                onKeyDown={handleKeyDown}
                disabled={!podePesquisar}
                placeholder={textoPlaceholder || (isEntre ? (isFim ? 'Até...' : 'De...') : 'Digite para pesquisar...')}
                className={baseCls}
            />
        );
    };

    const labelTexto = textoLabel
        ? textoLabel
        : isEntre
            ? `${LABEL_INICIAL[currentType]} Inicial`
            : LABEL_INICIAL[currentType];

    const renderTextoField = () => (
        <div className={`${textoClassName || 'flex-[2] min-w-[200px]'} ${!podePesquisar ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{labelTexto}</label>
            {renderValorInput(texto, (v) => { setTexto(v); persistentState?.setTexto(v); }, false)}
        </div>
    );

    return (
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col xl:flex-row gap-4 xl:items-end animate-fade-in">
            {children}
            {!podePesquisar && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 w-full">
                    <Search size={13} className="shrink-0" />
                    Pesquisa desabilitada para seu perfil de acesso.
                </div>
            )}
            {textoFirst && renderTextoField()}
            {prefixSlot}
            {!hideColunaOperacao && (
                <>
                    <div className={`w-48 shrink-0 ${!podePesquisar ? 'opacity-40 pointer-events-none' : ''}`}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Coluna de Busca</label>
                        <div className="relative">
                            <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                value={coluna}
                                onChange={(e) => handleColunaChange(e.target.value)}
                                disabled={!podePesquisar}
                                className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 focus:bg-white focus:border-corp-teal outline-none transition-all duration-75 appearance-none cursor-pointer"
                            >
                                <option value="">TODAS AS COLUNAS</option>
                                {fields.map(f => <option key={f.value} value={f.value}>{f.label.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className={`w-40 shrink-0 ${!podePesquisar ? 'opacity-40 pointer-events-none' : ''}`}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Operação</label>
                        <select
                            value={operacao}
                            onChange={(e) => {
                                setOperacao(e.target.value);
                                persistentState?.setOperacao(e.target.value);
                            }}
                            disabled={!podePesquisar}
                            className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:border-corp-teal outline-none transition-all duration-75 appearance-none cursor-pointer text-corp-teal"
                        >
                            {operacoesDisponiveis.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                    </div>
                </>
            )}

            {!textoFirst && renderTextoField()}

            {isEntre && (
                <div className={`flex-[2] min-w-[200px] animate-fade-in ${!podePesquisar ? 'opacity-40 pointer-events-none' : ''}`}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">{LABEL_FINAL[currentType]}</label>
                    {renderValorInput(textoFim, (v) => { setTextoFim(v); persistentState?.setTextoFim(v); }, true)}
                </div>
            )}

            <div className="flex items-center gap-2 mt-2 xl:mt-0">
                <button
                    onClick={handleClearClick}
                    disabled={isLoading || !podePesquisar}
                    className="w-[42px] h-[42px] flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-100 transition-all duration-75 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Limpar Filtros"
                >
                    <X size={18} />
                </button>

                <button
                    onClick={handleSearchClick}
                    disabled={isLoading || !podePesquisar}
                    title={!podePesquisar ? 'Pesquisa não permitida para seu perfil' : undefined}
                    className="h-[42px] px-6 bg-corp-teal hover:bg-corp-teal-hover text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-corp-teal/20 transition-all duration-75 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Search size={16} />
                    )}
                    PESQUISAR
                </button>
            </div>
        </div>
    );
};

export default MestreFiltro;
