# Plano de Migração TypeScript — `src/components/`

> Data: 2026-05-07

---

## Situação Atual

| Status | Arquivos |
|---|---|
| ✅ Já migrados (`.tsx`) | `MasterCrudPage`, `SearchableCombobox`, `Sidebar`, `ActionMenu`, `RelatorioViewer`, `GlobalHeader`, `GlobalLoader`, `GlobalToast`, `Report/GenericInvoiceReport`, `Report/GridPrintReport`, `Report/A4PrintContainer`, `Report/ReportPage`, `MestreFiltro`, `MestreGrid`, `ModalConfirmacao`, `ModalExportar`, `PesquisaCidade`, `RelatorioMestre` |
| 🔄 Para migrar (`.jsx`) | 2 arquivos (testes) |

Os componentes deste diretório são a **base compartilhada** de toda a aplicação.
`MasterCrudPage` e `SearchableCombobox` são críticos — erros introduzidos aqui propagam para todas as páginas.

---

## Inventário de Arquivos para Migrar

| Arquivo | Linhas | Criticidade | Obs. |
|---|---|---|---|
| `MasterCrudPage.jsx` | 203 | 🔴 CRÍTICO | Usado por ~25 páginas CRUD; resolve erros ativos no módulo Faz |
| `SearchableCombobox.jsx` | 502 | 🔴 CRÍTICO | Usado em ~15 formulários; precisa de generic `<T>` |
| `Sidebar.jsx` | 1.081 | 🟠 ALTO | Shell da app; 5 contextos; `routeConfig` tipado |
| `ActionMenu.jsx` | 104 | 🟠 ALTO | Usado pelo `MestreGrid`; portal + `ExtraAction` |
| `RelatorioViewer.jsx` | 224 | 🟡 MÉDIO | Registro dinâmico de PDFs; state machine |
| `GlobalHeader.jsx` | 118 | 🟡 MÉDIO | Breadcrumbs, relógio, empresa selecionada |
| `GlobalLoader.jsx` | 93 | 🟡 MÉDIO | Overlay global; sem props |
| `GlobalToast.jsx` | 61 | 🟡 MÉDIO | Toast; sem props |
| `Report/GenericInvoiceReport.jsx` | 268 | 🟡 MÉDIO | `forwardRef<HTMLDivElement, Props>` |
| `Report/GridPrintReport.jsx` | 222 | 🟡 MÉDIO | `forwardRef<HTMLDivElement, Props>` |
| `Report/A4PrintContainer.jsx` | 52 | 🟢 BAIXO | Wrapper A4 simples |
| `Report/ReportPage.jsx` | 81 | 🟢 BAIXO | Layout wrapper simples |
| `MasterCrudPage.test.jsx` | 131 | 🟢 BAIXO | Renomear + `as any` em mocks |
| `MestreFiltro.test.jsx` | 135 | 🟢 BAIXO | Renomear + `as any` em mocks |

**Total: ~3.180 linhas | Estimativa: ~9 h 30 min**

---

## Fase 1 — Componentes Simples (sem lógica de estado complexa)

> 5 arquivos | ~45 min

### 1.1 `Report/A4PrintContainer.jsx` → `.tsx`

```tsx
interface A4PrintContainerProps {
  children:   React.ReactNode;
  padding?:   string;
  className?: string;
}

export default function A4PrintContainer({ children, padding = '8mm 10mm', className = '' }: A4PrintContainerProps) { ... }
```

### 1.2 `Report/ReportPage.jsx` → `.tsx`

Wrapper de página sem hooks. Tipar `children` e qualquer prop de header/footer que o componente aceita.

### 1.3 `GlobalToast.jsx` → `.tsx`

Sem props. O `useToast()` retorna `{ toasts, removeToast }`.
Precisamos verificar se `ToastContext` já exporta o tipo `Toast` — se não, definir inline:

```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id:      string;
  type:    ToastType;
  message: string;
}
```

**Obs.:** Verificar `src/context/ToastContext.tsx` — se já exporta `Toast`, importar daí.

### 1.4 `GlobalLoader.jsx` → `.tsx`

Sem props. Verificar se `useLoading()` exporta tipos do `cancelOptions`:

```typescript
// Esperado em LoadingContext:
interface CancelOptions {
  showCancel?: boolean;
  onCancel?:   () => void;
}
```

Se não estiver tipado no contexto, adicionar inline com `(cancelOptions as any).showCancel`.

### 1.5 `GlobalHeader.jsx` → `.tsx`

```tsx
interface GlobalHeaderProps {
  onMobileMenuOpen: () => void;
}

interface Breadcrumb {
  label: string;
  path:  string;
  icon?: React.ReactNode;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onMobileMenuOpen }) => { ... }
```

**Erros esperados:**
- `selectedCompany.nome || selectedCompany.razao_social` — se `selectedCompany` for `any`, sem problema; se for tipado, ajustar acesso via `as any` ou campo explícito
- `getBreadcrumbs()` retorna array heterogêneo — tipar como `Breadcrumb[]`

---

## Fase 2 — Componentes de Relatório com `forwardRef`

> 2 arquivos | ~1 h

### 2.1 `Report/GridPrintReport.jsx` → `.tsx`

```tsx
interface GridPrintReportCompany {
  name?:   string;
  logo?:   string | null;
  cnpj?:   string;
  codigo?: string | number;
}

interface GridPrintReportColumn {
  key:    string;
  label:  string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface GridPrintReportProps {
  title?:    string;
  company?:  GridPrintReportCompany;
  user?:     string | null;
  filters?:  string | null;
  columns?:  GridPrintReportColumn[];
  data?:     Record<string, unknown>[];
  path?:     string;
}

const GridPrintReport = React.forwardRef<HTMLDivElement, GridPrintReportProps>(
  ({ title = 'Relatório', company = { ... }, user = null, filters = null, columns = [], data = [], path = '' }, ref) => {
    // O ref é aplicado à <div> interna via: <div ref={ref}>
    ...
  }
);

GridPrintReport.displayName = 'GridPrintReport';
export default GridPrintReport;
```

**Erros esperados:**
- `try { ... } catch(e) {}` no bloco `loggedCompany` — adicionar `catch (_e: unknown) {}`
- Acesso dinâmico `row[col.key]` em `data` — manter `row[col.key] as unknown`

### 2.2 `Report/GenericInvoiceReport.jsx` → `.tsx`

```tsx
interface CompanyAddress {
  street: string; number: string; neighborhood: string;
  city: string; state: string; zip_code: string;
}

interface InvoiceCompany {
  company_name:         string;
  document:             string;
  state_registration?:  string;
  phone?:               string;
  email?:               string;
  address?:             CompanyAddress;
}

interface InvoiceItem {
  [key: string]: unknown;
}

interface InvoicePayment {
  [key: string]: unknown;
}

interface GenericInvoiceReportProps {
  title?:        string;
  company?:      InvoiceCompany;
  client?:       Record<string, unknown> | null;
  items?:        InvoiceItem[];
  specialLines?: Record<string, unknown>;
  payments?:     InvoicePayment[];
  conditions?:   Record<string, unknown>;
  footerNote?:   string;
  totalAmount?:  number;
  freightPrice?: number;
  salesperson?:  string;
}

const GenericInvoiceReport = React.forwardRef<HTMLDivElement, GenericInvoiceReportProps>(
  ({ title = 'RELATÓRIO COMERCIAL', company = { ... }, ... }, ref) => {
    // ref é passado para A4PrintContainer ou para a div raiz
    ...
  }
);

GenericInvoiceReport.displayName = 'GenericInvoiceReport';
```

---

## Fase 3 — `ActionMenu` (Portal + ExtraAction)

> 1 arquivo | ~30 min

```tsx
// Converte o @typedef JSDoc em interface TypeScript exportada
export interface ExtraAction {
  label:    string;
  icon:     React.ComponentType<{ size?: number; className?: string }>;
  onClick:  () => void;
  variant?: 'default' | 'danger';
}

interface MenuPosition {
  top:  number;
  left: number;
}

interface ActionMenuProps {
  isOpen:        boolean;
  menuRef:       React.RefObject<HTMLDivElement>;
  position:      MenuPosition;
  onClose:       () => void;
  onEdit?:       () => void;
  onView?:       () => void;
  onDelete?:     () => void;
  onPrint?:      () => void;
  extraActions?: ExtraAction[];
}

const ActionMenu: React.FC<ActionMenuProps> = ({ ... }) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal( ... , document.body);
};
```

**Nota:** Exportar `ExtraAction` como named export para que consumidores possam tipá-la.

---

## Fase 4 — `MasterCrudPage` (CRÍTICO)

> 1 arquivo | ~1 h

Este componente é a **peça mais importante** — erros aqui se propagam para todas as páginas CRUD.
Além disso, os parâmetros `customHeaderActions`, `crud`, `exportConfig`, `printConfig` **precisam de `= null` como default** para evitar os erros de propriedade requerida que foram detectados nos módulos Faz.

```tsx
// Exportar para consumidores (Adm, Cpr, Faz etc.)
export interface MasterCrudPermissions {
  podeCriar?:    boolean;
  podeImprimir?: boolean;
  podeExportar?: boolean;
  [key: string]: unknown;
}

interface MasterCrudState {
  hasData:               boolean;
  isLoading:             boolean;
  isExportModalOpen?:    boolean;
  setIsExportModalOpen?: (v: boolean) => void;
  handleExport?:         () => void;
  data:                  unknown[];
  [key: string]:         unknown;
}

interface ExportConfig {
  title?:            string;
  columnGroups:      { label: string; keys: string[] }[];
  availableColumns:  { key: string; label: string }[];
  filenamePrefix?:   string;
}

interface PrintConfig {
  handlePrint?: () => void;
  [key: string]: unknown;
}

interface MasterCrudPageProps {
  title:                 string;
  subtitle?:             React.ReactNode;
  icon?:                 React.ComponentType<{ size?: number }>;
  viewMode:              'list' | 'form';
  onNew?:                () => void;
  onPrint?:              () => void;
  onExport?:             () => void;
  onRefresh?:            () => void;
  isLoading?:            boolean;
  hasData?:              boolean;
  searchSlot?:           React.ReactNode;
  gridSlot?:             React.ReactNode;
  formSlot?:             React.ReactNode;
  extraSlot?:            React.ReactNode;
  // Estas 4 props DEVEM ter default = null para não quebrar consumers existentes
  customHeaderActions?:  React.ReactNode;
  crud?:                 MasterCrudState | null;
  exportConfig?:         ExportConfig | null;
  printConfig?:          PrintConfig | null;
  permissions?:          MasterCrudPermissions;
}

const MasterCrudPage: React.FC<MasterCrudPageProps> = ({
  title,
  subtitle,
  icon: Icon,
  viewMode,
  onNew,
  onPrint,
  onExport,
  onRefresh,
  isLoading,
  hasData,
  searchSlot,
  gridSlot,
  formSlot,
  extraSlot,
  customHeaderActions = null,  // ← DEFAULT OBRIGATÓRIO
  crud = null,                 // ← DEFAULT OBRIGATÓRIO
  exportConfig = null,         // ← DEFAULT OBRIGATÓRIO
  printConfig = null,          // ← DEFAULT OBRIGATÓRIO
  permissions,
}) => { ... }
```

**Erros esperados:**
- `crud?.handleExport` → `(crud as MasterCrudState).handleExport` ou verificar existência antes
- `printConfig?.handlePrint` → já é opcional, sem problema
- `timer` no `useEffect` precisa de `ReturnType<typeof setInterval>`
- `exportConfig.title.toLowerCase()` — `title` pode ser `undefined`; usar `exportConfig.title ?? title`

**⚠️ Impacto cascata:** Após esta fase, rodar `tsc --noEmit` para confirmar que nenhuma página
quebrou com as novas interfaces. Se alguma página passar `permissions` com campos extras,
o `[key: string]: unknown` garante compatibilidade.

---

## Fase 5 — `RelatorioViewer` (Registro dinâmico de PDFs)

> 1 arquivo | ~45 min

```tsx
interface ReportConfig {
  type:    string;
  data:    unknown[];
  filtros?: string;
  label?:  string;
}

type ReportComponent = React.ComponentType<{ data: unknown[]; filtros?: string }>;
type ReportRegistry  = Record<string, ReportComponent>;

const reports: ReportRegistry = {
  'Maquina':  RelatorioMaquina as ReportComponent,
  'Bomba':    RelatorioBomba   as ReportComponent,
  // ... demais imports com @ts-ignore ou cast
};

const RelatorioViewer: React.FC = () => {
  const [config,       setConfig]       = useState<ReportConfig | null>(null);
  const [error,        setError]        = useState<string | null>(null);
  const [isPreparing,  setIsPreparing]  = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [blobUrl,      setBlobUrl]      = useState<string | null>(null);
  ...
};
```

**Erros esperados:**
- Imports de relatórios `.jsx` sem tipos → usar `// @ts-ignore` acima de cada import ou cast como `ReportComponent`
- `pdf(element).toBlob()` — `pdf` do `@react-pdf/renderer` já é tipado, sem problemas
- `JSON.parse(raw)` retorna `any` → tipar como `ReportConfig` com cast
- `e` nos `catch` blocks → `catch (e: unknown)`

---

## Fase 6 — `SearchableCombobox` (Generic, 502 linhas)

> 1 arquivo | ~2 h

Este é o componente mais complexo. Deve ser migrado para **componente genérico** `<T>`.

```tsx
interface SearchableComboboxProps<T = unknown> {
  label:           string;
  placeholder?:    string;
  value?:          T | null;
  onChange:        (item: T | null) => void;
  onSearch:        (searchText: string) => Promise<T[]>;
  renderItem?:     (
    item:          T,
    highlightText: (text: string, query: string) => React.ReactNode,
    query:         string
  ) => React.ReactNode;
  getDisplayValue: (item: T) => string;
  disabled?:       boolean;
  minChars?:       number;
  emptyMessage?:   string;
  emptyHint?:      string;
  icon?:           React.ComponentType<{ size?: number; className?: string }> | null;
}

function SearchableCombobox<T = unknown>({
  label,
  placeholder = 'Pesquisar...',
  value,
  onChange,
  onSearch,
  renderItem,
  getDisplayValue,
  disabled = false,
  minChars = 0,
  emptyMessage = 'Nenhum resultado encontrado',
  emptyHint = 'Tente buscar com outro termo',
  icon: CustomIcon = null,
}: SearchableComboboxProps<T>): JSX.Element {
  const [options, setOptions] = useState<T[]>([]);
  const [initialOptions, setInitialOptions] = useState<T[]>([]);
  ...
}

export default SearchableCombobox;
```

**Erros esperados:**
- `debounceRef.current` → `useRef<ReturnType<typeof setTimeout> | null>(null)`
- `wrapperRef` / `inputRef` / `listRef` → `useRef<HTMLDivElement | null>(null)`, `useRef<HTMLInputElement | null>(null)`, `useRef<HTMLUListElement | null>(null)`
- `options.map(...)` — já é `T[]`, sem problema
- `highlightText` helper interno retorna `React.ReactNode` — tipar explicitamente
- `item` no `renderItem` call → `T`, sem problema com generic
- `setOptions(results || [])` → `results` é `T[]`, sem problema
- `getDisplayValue(value)` quando `value` pode ser null → verificar antes

**Nota de retrocompatibilidade:** Como o componente agora é genérico, os consumidores existentes
(`.jsx` e `.tsx`) continuam funcionando porque `T` tem default `= unknown`.
Consumidores `.tsx` ganham type safety ao especificar `<SearchableCombobox<Cidade> ... />`.

---

## Fase 7 — `Sidebar` (Maior arquivo, 1.081 linhas)

> 1 arquivo | ~3 h

```tsx
// Props do componente
interface SidebarProps {
  isOpen:        boolean;
  setMobileOpen: (open: boolean) => void;
  width:         number;
  setWidth:      (w: number) => void;
}

// Configuração de rotas
interface RouteConfigItem {
  route:       string;
  componente?: string;
}

type RouteConfig = Record<string, RouteConfigItem>;

// Item de menu (para estrutura recursiva de menus)
interface MenuItem {
  label:        string;
  icon?:        React.ComponentType<{ size?: number }>;
  route?:       string;
  componente?:  string;
  children?:    MenuItem[];
}

// Resultado de useCompany tipado
const { selectedCompany, setSelectedCompany, availableCompanies, setAvailableCompanies, isLoading: isContextLoading, setIsLoading: setIsContextLoading } = useCompany();

// Resultado de usePermissions tipado
const { podeAcessarComponente, permissionsLoaded, permMap } = usePermissions();
```

**Erros esperados:**
- `routeConfig` como `Record<string, { route: string; componente?: string }>` — straightforward
- `podeAcessarComponente(componente)` — verificar tipo do retorno no contexto (`boolean`)
- Múltiplos `useState` de refs DOM → tipar explicitamente: `useRef<HTMLDivElement>(null)`, `useRef<number | null>(null)`
- `availableCompanies.map(c => ...)` — se `c` for `any` do contexto, sem problema
- Handlers de evento de resize → `(e: MouseEvent) => void`
- `window.addEventListener` / `removeEventListener` → sem problema
- `navigate(route)` → `route` é `string`, sem problema

**Estratégia para `routeConfig` (tipagem segura sem `as const`):**

```typescript
const routeConfig: RouteConfig = {
  'Empresa': { route: '/administrativo/empresa', componente: 'FORM_ADM_EMPRESA' },
  // ...
};
```

**Atenção:** A Sidebar tem ~1.081 linhas com muitos handlers inline. A abordagem mais segura é
adicionar os tipos de cada `useState`, `useRef` e event handler, e manter os callbacks como `any` onde
a inferência for complexa — limpar progressivamente em refatorações futuras.

---

## Fase 8 — Arquivos de Teste

> 2 arquivos | ~30 min

### 8.1 `MasterCrudPage.test.jsx` → `.test.tsx`

- Renomear arquivo
- Adicionar tipos em mocks de context: `{ selectedCompany: { id: 1, nome: 'Teste' } as any }`
- Os mocks de `CompanyContext` provavelmente precisam de `as any`

### 8.2 `MestreFiltro.test.jsx` → `.test.tsx`

- Renomear arquivo  
- Tipar `rerender` e props passadas ao componente

---

## 🚀 Progresso da Migração

- [x] **Fase 1: Críticos & Utilitários** (`GlobalLoader`, `GlobalToast`, `ReportPage`, `A4PrintContainer`, `GlobalHeader`) — **CONCLUÍDO**
- [x] **Fase 2: Relatórios com forwardRef** (`GridPrintReport`, `GenericInvoiceReport`) — **CONCLUÍDO**
- [x] **Fase 3: Portal & ExtraAction** (`ActionMenu`) — **CONCLUÍDO**
- [x] **Fase 4: Core CRUD** (`MasterCrudPage`) — **CONCLUÍDO**
- [x] **Fase 5: Registro Dinâmico** (`RelatorioViewer`) — **CONCLUÍDO**
- [x] **Fase 6: Componente Genérico <T>** (`SearchableCombobox`) — **CONCLUÍDO**
- [x] **Fase 7: Estrutura Principal** (`Sidebar`) — **CONCLUÍDO**
- [ ] **Fase 8: Testes Unitários** (Opcional)

---

## Ordem de Execução Recomendada

```
Fase 1: Simples (5 arquivos)           CONCLUÍDO
Fase 2: forwardRef (2 arquivos)        CONCLUÍDO
Fase 3: ActionMenu                     CONCLUÍDO
Fase 4: MasterCrudPage (CRÍTICO)       CONCLUÍDO
Fase 5: RelatorioViewer                CONCLUÍDO
Fase 6: SearchableCombobox (CRÍTICO)   CONCLUÍDO
Fase 7: Sidebar (maior)                CONCLUÍDO
Fase 8: Testes (2 arquivos)            Pendente
```

---

## Erros TypeScript Antecipados por Arquivo

| Arquivo | Erro | Correção |
|---|---|---|
| `MasterCrudPage.tsx` | `crud?.handleExport` tipo desconhecido | Usar `MasterCrudState` com index signature |
| `MasterCrudPage.tsx` | `timer` sem tipo | `ReturnType<typeof setInterval>` |
| `MasterCrudPage.tsx` | Props requeridas sem default | Adicionar `= null` nos 4 parâmetros |
| `SearchableCombobox.tsx` | `debounceRef` sem tipo | `useRef<ReturnType<typeof setTimeout> \| null>(null)` |
| `SearchableCombobox.tsx` | `options` sem generic | `useState<T[]>([])` |
| `SearchableCombobox.tsx` | `highlightText` retorno | `: React.ReactNode` explícito |
| `RelatorioViewer.tsx` | Imports de relatórios `.jsx` | `// @ts-ignore` ou `as ReportComponent` |
| `RelatorioViewer.tsx` | `JSON.parse` retorna `any` | `as ReportConfig` |
| `Sidebar.tsx` | Contextos retornam `any` | Manter `any` ou tipar com cast `as CompanyType` |
| `Sidebar.tsx` | Handlers de resize | `(e: MouseEvent) => void` |
| `GridPrintReport.tsx` | `catch(e) {}` vazio | `catch (_e: unknown) {}` |
| `GlobalLoader.tsx` | `cancelOptions.showCancel` | Verificar tipo em `LoadingContext` |
| `ActionMenu.tsx` | `ExtraAction` como JSDoc | Converter para `interface` e exportar |

---

## Interfaces a Exportar (para consumidores)

Após a migração, garantir que as seguintes interfaces sejam **exportadas** dos arquivos `.tsx`:

| Interface | Arquivo fonte | Consumidores |
|---|---|---|
| `ExtraAction` | `ActionMenu.tsx` | `MestreGrid.tsx` |
| `MasterCrudPermissions` | `MasterCrudPage.tsx` | Todas as páginas CRUD |
| `MasterCrudState` | `MasterCrudPage.tsx` | `useCrudState` hook |
| `SearchableComboboxProps<T>` | `SearchableCombobox.tsx` | `PesquisaCidade`, todos os formulários |

---

## Checklist Final

- [ ] `tsc --noEmit` sem erros em `src/components/`
- [ ] Após Fase 4: `tsc --noEmit` sem novos erros em `src/pages/`
- [ ] `SearchableCombobox` funciona com e sem generic explícito
- [ ] `MasterCrudPage` aceita `permissions` sem campos obrigatórios faltando
- [ ] Sidebar renderiza e navega corretamente
- [ ] Relatórios PDF abrem via `RelatorioViewer`
- [ ] Testes de `MasterCrudPage` e `MestreFiltro` passam
