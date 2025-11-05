import { useState, useRef } from "react";
import { geminiService } from "../api/geminiService";

const TaskGenerator: React.FC = () => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validatePdfFile = (file: File): boolean => {
        if (file.type !== 'application/pdf') {
            setUploadError('Solo se permiten archivos PDF');
            return false;
        }
        if (file.size > 15 * 1024 * 1024) {
            setUploadError('El archivo no puede superar los 15MB');
            return false;
        }
        setUploadError('');
        return true;
    };

    const processFile = (file: File) => {
        if (validatePdfFile(file)) {
            setSelectedFile(file);
            geminiService.generateTasks(file);
        }
    };

    const onDragStateChange = (dragState: boolean) => {
        setIsDragActive(dragState);
    };

    const onDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
            onDragStateChange(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onFilesDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDragStateChange(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            processFile(droppedFiles[0]);
        }
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFile(files[0]);
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setUploadError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div
                className={`h-[300px] p-6 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${isDragActive
                        ? "border-blue-400 bg-blue-50"
                        : selectedFile
                            ? "border-green-400 bg-green-50"
                            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 hover:cursor-pointer"
                    }`}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onFilesDrop}
                onClick={openFileDialog}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={onFileInputChange}
                    className="hidden"
                />

                {selectedFile ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-green-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-center">
                            <p className="text-green-700 font-medium">{selectedFile.name}</p>
                            <p className="text-gray-500 text-sm">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedFile();
                            }}
                            className="px-4 py-2 bg-red-400 text-white text-sm rounded hover:bg-red-600 hover:cursor-pointer transition-colors"
                        >
                            Eliminar
                        </button>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                        </svg>
                        <div className="text-center">
                            <p className={`text-sm transition-colors ${isDragActive ? 'text-blue-600' : 'text-gray-600'}`}>
                                {isDragActive ? '¡Suelta el archivo aquí!' : 'Arrastra tu PDF aquí o haz clic para seleccionar'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Solo archivos PDF (máximo 15MB)
                            </p>
                        </div>
                    </>
                )}
            </div>

            {uploadError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {uploadError}
                </div>
            )}
        </div>
    );
}

export default TaskGenerator;