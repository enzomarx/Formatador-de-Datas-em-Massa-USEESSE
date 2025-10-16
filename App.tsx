
import React, { useState, useCallback } from 'react';

const INPUT_PLACEHOLDER_MDY = `Cole as datas aqui ou arraste e solte um arquivo.
Cada data deve estar em uma nova linha.

Exemplo:
1/25/2023
3/6/2023
9/12/2025
...
`;

const INPUT_PLACEHOLDER_DMY = `Cole as datas aqui ou arraste e solte um arquivo.
Cada data deve estar em uma nova linha.

Exemplo:
25/1/2023
6/3/2023
12/9/2025
...
`;

const OUTPUT_PLACEHOLDER = `As datas formatadas aparecerão aqui.
Exemplo:
2023-01-25
2023-03-06
2025-09-12
...
`;

const ArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

const ClearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25Z" />
    </svg>
);

const Toast: React.FC<{ message: string; show: boolean }> = ({ message, show }) => (
    <div
        className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-gray-800 text-white py-3 px-5 rounded-lg shadow-2xl shadow-emerald-500/20 border border-emerald-500 transition-all duration-300 ease-in-out
            ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
            }`}
        role="alert"
        aria-live="assertive"
    >
        <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
        <span className="font-semibold">{message}</span>
    </div>
);


export default function App() {
    const [inputDates, setInputDates] = useState('');
    const [outputDates, setOutputDates] = useState('');
    const [copyButtonText, setCopyButtonText] = useState('Copiar');
    const [inputFormat, setInputFormat] = useState('mdy');
    const [showToast, setShowToast] = useState(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const formatDateLine = useCallback((line: string): string => {
        const trimmedLine = line.trim();
        if (!trimmedLine) {
            return ""; 
        }

        const parts = trimmedLine.split('/');
        if (parts.length !== 3 || parts.some(p => !/^\d+$/.test(p.trim()))) {
            return `${trimmedLine}  <- Formato inválido`;
        }

        let monthStr: string, dayStr: string, yearStr: string;

        if (inputFormat === 'mdy') {
            [monthStr, dayStr, yearStr] = parts;
        } else {
            [dayStr, monthStr, yearStr] = parts;
        }

        const year = parseInt(yearStr.length === 2 ? (parseInt(yearStr) > 50 ? `19${yearStr}` : `20${yearStr}`) : yearStr);
        const month = parseInt(monthStr);
        const day = parseInt(dayStr);
        
        const date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
            return `${trimmedLine}  <- Data inválida`;
        }
        
        const paddedMonth = month.toString().padStart(2, '0');
        const paddedDay = day.toString().padStart(2, '0');
        const fullYear = year.toString();

        return `${fullYear}-${paddedMonth}-${paddedDay}`;
    }, [inputFormat]);

    const handleFormatClick = useCallback(() => {
        if (!inputDates) {
            setOutputDates('');
            return;
        }
        const lines = inputDates.split('\n');
        const formattedLines = lines.map(formatDateLine);
        setOutputDates(formattedLines.join('\n'));
    }, [inputDates, formatDateLine]);

    const handleCopyToClipboard = useCallback(() => {
        if (showToast || !outputDates) {
            return;
        }
        navigator.clipboard.writeText(outputDates);
        setCopyButtonText('Copiado!');
        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
            setCopyButtonText('Copiar');
        }, 2500);
    }, [outputDates, showToast]);
    
    const handleClear = useCallback(() => {
        setInputDates('');
        setOutputDates('');
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDraggingOver(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        // FIX: Explicitly type the 'file' parameter as 'File' to resolve TypeScript
        // errors where it was being inferred as 'unknown'.
        const readPromises: Promise<string>[] = Array.from(files)
            .filter((file: File) => file.type === "" || file.type.startsWith("text/"))
            .map((file: File) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target?.result as string);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            }));

        Promise.all(readPromises)
            .then(contents => {
                const newContent = contents.join('\n');
                if (newContent) {
                    setInputDates(prev => (prev ? `${prev.trim()}\n${newContent}` : newContent));
                }
            })
            .catch(error => {
                console.error("Error reading dropped files:", error);
            });
    }, []);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 font-sans bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/50">
            <main className="bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-5xl space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent pb-2">
                        Formatador de Datas em Massa
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Converta datas de <span className="font-mono bg-gray-900/50 text-cyan-300 px-1.5 py-0.5 rounded-md border border-gray-700">M/D/YYYY</span> ou <span className="font-mono bg-gray-900/50 text-cyan-300 px-1.5 py-0.5 rounded-md border border-gray-700">D/M/YYYY</span> para <span className="font-mono bg-gray-900/50 text-cyan-300 px-1.5 py-0.5 rounded-md border border-gray-700">YYYY-MM-DD</span> instantaneamente.
                    </p>
                </div>
                
                <div className="flex flex-col items-center gap-3">
                    <label id="input-format-label" className="text-sm font-medium text-gray-300">
                        Formato de Entrada
                    </label>
                    <div
                        role="radiogroup"
                        aria-labelledby="input-format-label"
                        className="relative flex items-center bg-gray-900/70 border border-gray-700 p-1 rounded-lg shadow-inner"
                    >
                        <div className={`
                            absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md transition-all duration-300 ease-in-out
                            ${inputFormat === 'mdy' ? 'left-1' : 'left-[calc(50%+1px)]'}
                        `}></div>
                
                        <div className="relative z-10 flex">
                            <label className="flex cursor-pointer px-4 py-1.5 rounded-md">
                                <input
                                    type="radio"
                                    name="input-format"
                                    value="mdy"
                                    checked={inputFormat === 'mdy'}
                                    onChange={() => setInputFormat('mdy')}
                                    className="sr-only"
                                />
                                <span className={`font-mono text-sm transition-colors duration-300 ${inputFormat === 'mdy' ? 'text-white font-semibold' : 'text-cyan-200'}`}>M/D/YYYY</span>
                            </label>
                            <label className="flex cursor-pointer px-4 py-1.5 rounded-md">
                                <input
                                    type="radio"
                                    name="input-format"
                                    value="dmy"
                                    checked={inputFormat === 'dmy'}
                                    onChange={() => setInputFormat('dmy')}
                                    className="sr-only"
                                />
                                <span className={`font-mono text-sm transition-colors duration-300 ${inputFormat === 'dmy' ? 'text-white font-semibold' : 'text-cyan-200'}`}>D/M/YYYY</span>
                            </label>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col h-full">
                        <label htmlFor="input-dates" className="block mb-2 text-sm font-medium text-gray-300">
                            Datas de Entrada
                        </label>
                        <div 
                            className="relative flex-grow h-80"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <textarea
                                id="input-dates"
                                value={inputDates}
                                onChange={(e) => setInputDates(e.target.value)}
                                placeholder={inputFormat === 'mdy' ? INPUT_PLACEHOLDER_MDY : INPUT_PLACEHOLDER_DMY}
                                className="w-full h-full bg-gray-900/70 border border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 resize-none focus:shadow-inner"
                                aria-label="Input dates to be formatted"
                            />
                            <div 
                                className={`absolute inset-0 bg-gray-900/50 backdrop-blur-sm border-2 border-dashed border-cyan-400 rounded-lg flex items-center justify-center transition-opacity duration-300 ease-in-out ${isDraggingOver ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                                aria-hidden="true"
                            >
                                <div className="text-center">
                                    <UploadIcon className="w-10 h-10 mx-auto text-cyan-400 animate-pulse" />
                                    <p className="mt-2 font-semibold text-cyan-400 animate-pulse">Solte o arquivo para carregar</p>
                                    <p className="text-xs text-gray-400">Os dados do arquivo serão adicionados aqui</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col h-full">
                         <label htmlFor="output-dates" className="block mb-2 text-sm font-medium text-gray-300">
                            Datas de Saída (YYYY-MM-DD)
                        </label>
                        <textarea
                            id="output-dates"
                            value={outputDates}
                            readOnly
                            placeholder={OUTPUT_PLACEHOLDER}
                            className="flex-grow w-full h-80 bg-gray-900/70 border border-gray-700 rounded-lg p-4 font-mono text-base text-gray-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all duration-200 resize-none"
                            aria-label="Formatted output dates"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                     <button
                        onClick={handleFormatClick}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-cyan-500/20 transform hover:-translate-y-1"
                        aria-label="Format the input dates"
                    >
                        <ArrowIcon className="w-5 h-5" />
                        <span>Formatar Datas</span>
                    </button>
                    <button
                        onClick={handleCopyToClipboard}
                        disabled={!outputDates}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95 disabled:bg-gray-600 disabled:from-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:brightness-100 shadow-lg shadow-emerald-500/20 disabled:shadow-none transform hover:-translate-y-1 disabled:hover:translate-y-0"
                        aria-label="Copy formatted dates to clipboard"
                    >
                        <CopyIcon className="w-5 h-5" />
                        <span>{copyButtonText}</span>
                    </button>
                     <button
                        onClick={handleClear}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/20 transform hover:-translate-y-1"
                        aria-label="Clear all input and output fields"
                    >
                        <ClearIcon className="w-5 h-5" />
                        <span>Limpar</span>
                    </button>
                </div>
            </main>
            <Toast message="Datas copiadas!" show={showToast} />
        </div>
    );
}
