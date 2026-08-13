// Polyfill para Web Worker rodar no Vite (HMR e React)

// 1. O plugin de React do Vite (@vitejs/plugin-react) injeta HMR usando 'window'.
// No Web Worker 'window' não existe. Isso resolve o Uncaught ReferenceError: window is not defined.
(globalThis as any).window = globalThis;

// 2. O @react-pdf/renderer exige um polyfill de Buffer no browser.
if (!(globalThis as any).Buffer) {
    (globalThis as any).Buffer = {
        isBuffer: (obj: any) => obj && !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj),
        from: (arr: any) => new Uint8Array(arr),
        alloc: (size: number) => new Uint8Array(size)
    };
}

// 3. O Vite (@vitejs/plugin-react) injeta $RefreshReg$/$RefreshSig$ (React Fast Refresh)
// em todos os .tsx servidos, inclusive os importados pelo worker. Essas globals só existem
// na thread principal. Sem este polyfill: "Uncaught ReferenceError: $RefreshReg$ is not defined".
if (typeof (globalThis as any).$RefreshReg$ === 'undefined') {
    (globalThis as any).$RefreshReg$ = () => {};
    (globalThis as any).$RefreshSig$ = () => (type: any) => type;
}

// 4. Os relatórios tentam acessar localStorage no momento do render.
const dummyStorage = new Map<string, string>();
if (!(globalThis as any).localStorage) {
    (globalThis as any).localStorage = {
        getItem: (key: string) => dummyStorage.get(key) || null,
        setItem: (key: string, val: string) => dummyStorage.set(key, val),
        removeItem: (key: string) => dummyStorage.delete(key),
        clear: () => dummyStorage.clear(),
    };
}
