import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import * as formatters from '../utils/formatters';

// Polyfill minimal para o @react-pdf/renderer funcionar no browser sem o Node Buffer
if (typeof window !== 'undefined' && !(window as any).Buffer) {
    (window as any).Buffer = {
        isBuffer: (obj: any) => obj && !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj),
        from: (arr: any) => new Uint8Array(arr),
        alloc: (size: number) => new Uint8Array(size)
    };
}

const styles = StyleSheet.create({
    page: { padding: 35, backgroundColor: '#fff', flexDirection: 'column' },

    // Header
    headerBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.5, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 8, padding: 15, marginBottom: 20 },
    headerLogoContainer: { width: '25%', flexShrink: 0 },
    logo: { width: 100, height: 40, objectFit: 'contain' },

    headerCenterContent: { width: '50%', alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
    headerCompanyRow: { fontSize: 9, fontWeight: 'medium', color: '#334155', marginBottom: 2 },
    headerCompanyRow2: { fontSize: 9, fontWeight: 'medium', color: '#334155' },

    headerRightContent: { width: '25%', alignItems: 'flex-end', justifyContent: 'center' },
    emitidoPor: { fontSize: 8, color: '#64748b', marginBottom: 4 },
    emitidoPorName: { color: '#1e293b', fontWeight: 'bold' },
    dateTime: { fontSize: 8, color: '#64748b', marginBottom: 4 },
    pageNumber: { fontSize: 8, color: '#64748b' },

    // Breadcrumb e Filtros
    breadcrumb: { fontSize: 8, color: '#94a3b8', fontStyle: 'italic', marginBottom: 8, paddingLeft: 4 },
    filterBox: { borderWidth: 0.5, borderColor: '#e2e8f0', borderStyle: 'solid', borderRadius: 6, padding: 10, marginBottom: 20, backgroundColor: '#f8fafc' },
    filterTextBase: { fontSize: 8, color: '#64748b', lineHeight: 1.4 },
    filterTextBold: { color: '#0f172a', fontWeight: 'bold' },

    // Tabela
    table: { display: 'flex', width: 'auto', borderTopWidth: 1.5, borderTopColor: '#475569', borderTopStyle: 'solid' },
    tableRowHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#94a3b8', borderBottomStyle: 'solid', backgroundColor: '#f1f5f9', minHeight: 28, alignItems: 'center' },
    tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#e2e8f0', borderBottomStyle: 'solid', minHeight: 24, alignItems: 'center' },
    tableRowZebra: { backgroundColor: '#f1f5f9' },
    tableCellHeader: { fontSize: 8, color: '#1e293b', fontWeight: 'bold', paddingHorizontal: 4 },
    tableCell: { fontSize: 8, color: '#334155', paddingHorizontal: 4 },

    // Rodapé fixo
    footer: { position: 'absolute', bottom: 20, left: 35, right: 35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 0.5, borderTopColor: '#e2e8f0', borderTopStyle: 'solid', paddingTop: 6 },
    footerText: { fontSize: 8, color: '#94a3b8' },
    footerPageNum: { fontSize: 8, color: '#64748b', fontWeight: 'bold' },
});

interface RelatorioMestreProps {
    title: string;
    companyCnpj?: string;
    companyName?: string;
    emitidoPor?: string;
    breadcrumb?: string;
    filtrosAplicados?: string;
    columns: { key: string; label: string; width?: string; align?: 'left' | 'center' | 'right' }[];
    data: any[];
    orientation?: 'portrait' | 'landscape';
    zebra?: boolean;
    compact?: boolean;
}

/**
 * Motor de Relatórios Master (RelatorioMestre)
 * Usa paginação nativa do react-pdf — sem chunking manual.
 * O cabeçalho da tabela repete automaticamente em cada página via `fixed`.
 */
const RelatorioMestre = ({
    title,
    companyCnpj = "03817702000150",
    companyName = "0001 — Vólus Instituição De Pagamento Ltda",
    emitidoPor = "Usuário",
    breadcrumb = "Home / Relatórios",
    filtrosAplicados = "Todos os registros",
    columns,
    data,
    orientation = 'portrait',
    zebra = false,
    compact = false,
}: RelatorioMestreProps) => {
    const defaultWidth = `${100 / columns.length}%`;

    const compactCellStyle = compact ? { fontSize: 6.5, paddingHorizontal: 4 } : {};
    const compactHeaderStyle = compact ? { fontSize: 7, paddingHorizontal: 4 } : {};
    const compactRowStyle = compact ? { minHeight: 18 } : {};
    const compactHeaderRowStyle = compact ? { minHeight: 22 } : {};

    const now = new Date();
    const dataHoraObj = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR')}`;

    const formattedTitle = formatters.toTitleCase(title);
    const formattedCompanyName = formatters.toTitleCase(companyName);
    const formattedEmitidoPor = formatters.toTitleCase(emitidoPor);

    const getNestedValue = (obj: any, path: string) =>
        path.split('.').reduce((acc, part) => acc && acc[part], obj);

    const cellStyle = (col: any) => ({
        width: col.width || defaultWidth,
        textAlign: (col.align === 'center' ? 'center' : col.align === 'right' ? 'right' : 'left') as any,
    });

    return (
        <Document title={formattedTitle}>
            <Page size="A4" orientation={orientation} style={[styles.page, { paddingBottom: 50 }]}>

                {/* ── 1. Cabeçalho ── */}
                <View style={styles.headerBox}>
                    <View style={styles.headerLogoContainer}>
                        <Image src="/logo-volus.png" style={styles.logo} />
                    </View>
                    <View style={styles.headerCenterContent}>
                        <Text style={styles.headerTitle}>{formattedTitle}</Text>
                        <Text style={styles.headerCompanyRow}>CNPJ: {formatters.formatCnpj(companyCnpj)}</Text>
                        <Text style={styles.headerCompanyRow2}>{formattedCompanyName}</Text>
                    </View>
                    <View style={styles.headerRightContent}>
                        <Text style={styles.emitidoPor}>
                            Emitido por: <Text style={styles.emitidoPorName}>{formattedEmitidoPor}</Text>
                        </Text>
                        <Text style={styles.dateTime}>{dataHoraObj}</Text>
                    </View>
                </View>

                {/* ── 2. Breadcrumb ── */}
                {breadcrumb && <Text style={styles.breadcrumb}>{breadcrumb}</Text>}

                {/* ── 3. Filtros ── */}
                <View style={styles.filterBox}>
                    <Text style={styles.filterTextBase}>
                        <Text style={styles.filterTextBold}>Filtros Aplicados: </Text>
                        {filtrosAplicados}
                    </Text>
                </View>

                {/* ── 4. Tabela — paginação automática pelo react-pdf ── */}
                <View style={styles.table}>
                    {/* Cabeçalho da tabela: `fixed` faz repetir em cada página */}
                    <View style={[styles.tableRowHeader, compactHeaderRowStyle]} fixed>
                        {columns.map((col, idx) => (
                            <Text key={idx} style={[styles.tableCellHeader, cellStyle(col), compactHeaderStyle]}>
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {/* Linhas: `wrap={false}` evita quebrar uma linha entre páginas */}
                    {data.map((item, rowIdx) => (
                        <View
                            key={rowIdx}
                            style={[styles.tableRow, compactRowStyle, zebra && rowIdx % 2 !== 0 ? styles.tableRowZebra : {}]}
                            wrap={false}
                        >
                            {columns.map((col, colIdx) => {
                                const val = getNestedValue(item, col.key);
                                return (
                                    <Text key={colIdx} style={[styles.tableCell, cellStyle(col), compactCellStyle]}>
                                        {val ?? '—'}
                                    </Text>
                                );
                            })}
                        </View>
                    ))}
                </View>

                {/* ── 5. Rodapé fixo — repete em todas as páginas ── */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerText}>Total de registros: {data.length}</Text>
                    <Text
                        style={styles.footerPageNum}
                        render={({ pageNumber, totalPages }) => `Pág. ${pageNumber} de ${totalPages}`}
                    />
                </View>

            </Page>
        </Document>
    );
};

export default RelatorioMestre;
