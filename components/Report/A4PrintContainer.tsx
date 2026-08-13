import React, { forwardRef } from 'react';

/**
 * A4PrintContainer
 * Um wrapper de layout genérico que força as dimensões exatas de uma página A4
 * (210mm x 297mm) e insere as media-queries de impressão adequadas para que
 * navegadores imprimam com as cores e margens corretas.
 */

interface A4PrintContainerProps {
  children:   React.ReactNode;
  padding?:   string;
  className?: string;
}

const A4PrintContainer = forwardRef<HTMLDivElement, A4PrintContainerProps>(function A4PrintContainer({ children, padding = '8mm 10mm', className = '' }, ref) {
    const printStyles = `
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                margin: 0;
                padding: 0;
                background-color: white;
            }
            html, body {
                height: 100%;
                width: 100%;
            }
        }
    `;

    return (
        <div
            ref={ref}
            className={`bg-white text-black font-sans leading-tight flex flex-col justify-between ${className}`}
            style={{
                width: '210mm',
                minHeight: '297mm',
                padding: padding,
                margin: '0 auto',
                boxSizing: 'border-box',
                fontFamily: 'Arial, sans-serif',
                overflow: 'hidden'
            }}
        >
            <style>{printStyles}</style>
            {children}
        </div>
    );
});

export default A4PrintContainer;
