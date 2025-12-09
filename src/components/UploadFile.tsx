import { useState, useRef } from "react";

interface UploadFileProps {
    onFilesGenerated: (taskGroups: any[]) => void;
    testCaseService: any;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFilesGenerated, testCaseService }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
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
        }
    };

    const onSendFile = async () => {
        setIsLoading(true);

        try {
            if (selectedFile) {
                const fetchedTasks = await testCaseService.generateTasks(selectedFile);
                setIsLoading(false);
                setSelectedFile(null);
                onFilesGenerated(fetchedTasks);
            }
        } catch (error) {
            setIsLoading(false);
            throw error;
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
        if (isLoading) return;
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
        <>
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

                        {isLoading ? (
                            <div className="flex flex-col items-center space-y-4">
                                <p className="text-gray-500 mt-2">Cargando y procesando el archivo...</p>
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-300 animate-spin fill-indigo-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSendFile();
                                    }}
                                    disabled={isLoading}
                                    className={`mt-3 px-4 py-1 rounded text-white font-medium transition-colors ${selectedFile
                                        ? "bg-blue-600 hover:bg-blue-500 cursor-pointer"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    Enviar
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelectedFile();
                                    }}
                                    disabled={isLoading}
                                    className="px-3 py-1 bg-red-400 text-white text-sm rounded hover:bg-red-600 hover:cursor-pointer transition-colors"
                                >
                                    Eliminar
                                </button>
                            </>
                        )}
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
                <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {uploadError}
                </div>
            )}
        </>
    );
};

export default UploadFile;
