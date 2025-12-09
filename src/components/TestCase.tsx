// component test case tsx
import React, { useState, type Dispatch } from 'react';
import { testCaseService } from '../api/testCaseService';
import type { ITestCase } from '../interfaces';
import { jiraService } from '../api/jiraService';

interface TestCaseProps {
    jiraIssueKey: string;
    onIssueKeyError: Dispatch<React.SetStateAction<boolean>>;
}

export const TestCase: React.FC<TestCaseProps> = ({
    jiraIssueKey,
    onIssueKeyError,
}) => {
    const [testCases, setTestCases] = useState<ITestCase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [testType, setTestType] = useState<string>("api");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingTestCase, setEditingTestCase] = useState<ITestCase | null>(null);
    const [aiModel, setAiModel] = useState<number>(1);

    const handleGenerateTestCases = async () => {
        if (!jiraIssueKey) {
            onIssueKeyError(true);
            return;
        }

        setLoading(true);
        setTestCases([]);

        try {
            const generatedTestCases = await testCaseService.generateTestCases(jiraIssueKey, testType, aiModel);
            setTestCases(generatedTestCases);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const handleTestCaseSelection = (index: number) => {
        setTestCases(prevTestCases =>
            prevTestCases.map((testCase, i) =>
                i === index
                    ? { ...testCase, selected: !testCase.selected }
                    : testCase
            )
        );
    };

    const handleEditTestCase = (index: number) => {
        setEditingIndex(index);
        setEditingTestCase({ ...testCases[index] });
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingTestCase(null);
    };

    const handleSaveEdit = () => {
        if (editingIndex !== null && editingTestCase) {
            setTestCases(prevTestCases =>
                prevTestCases.map((testCase, i) =>
                    i === editingIndex ? editingTestCase : testCase
                )
            );
            setEditingIndex(null);
            setEditingTestCase(null);
        }
    };

    const handleEditInputChange = (field: keyof ITestCase, value: string) => {
        if (editingTestCase) {
            setEditingTestCase({
                ...editingTestCase,
                [field]: value
            });
        }
    };

    const handlePostTestCases = () => {
        const selectedTestCases = testCases.filter(testCase => testCase.selected);
        const testCasesToSend = selectedTestCases.map(({ selected, ...rest }) => rest);

        if (selectedTestCases.length === 0) {
            throw new Error('No hay casos de prueba seleccionados para enviar.');
        }
        jiraService.postTestCases(jiraIssueKey, testCasesToSend);
    }

    return (
        <div>
            {/* Test Type Selector */}
            <section className="p-6 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 gap-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">⚙️ Generar Tests</h3>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <select
                        name="ai-model"
                        id="ai-model-selector"
                        className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        defaultValue=""
                        value={aiModel}
                        onChange={(e) => setAiModel(Number(e.target.value))}
                    >
                        <option value="" disabled>
                            Selecciona el modelo de lenguaje que quieres usar
                        </option>
                        <option value="1">GEMINI</option>
                        <option value="2">CHATGPT</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                    <select
                        name="test-type"
                        id="test-type-selector"
                        className="flex-grow px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        defaultValue=""
                        value={testType}
                        onChange={(e) => setTestType(e.target.value)}
                    >
                        <option value="" disabled>
                            Selecciona el tipo de test
                        </option>
                        <option value="api">API</option>
                        <option value="web">Web</option>
                    </select>
                    <button
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        onClick={handleGenerateTestCases}
                    >
                        Generar
                    </button>
                </div>

                {/* Test Cases */}
                {testCases.map((testCase, index) => (
                    <div key={index} className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                        {editingIndex === index ? (
                            <form onSubmit={handleSaveEdit} className="space-y-4">
                                <div>
                                    <label htmlFor={`title-${index}`} className="block text-sm font-bold text-gray-700 mb-2">
                                        Título
                                    </label>
                                    <input
                                        id={`title-${index}`}
                                        type="text"
                                        value={editingTestCase?.title || ''}
                                        onChange={(e) => handleEditInputChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                        maxLength={200}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`description-${index}`} className="block text-sm font-bold text-gray-700 mb-2">
                                        Descripción
                                    </label>
                                    <textarea
                                        id={`description-${index}`}
                                        value={editingTestCase?.description || ''}
                                        onChange={(e) => handleEditInputChange('description', e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                                        required
                                        maxLength={1000}
                                        placeholder="Describe los pasos del test case..."
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`result-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                        Resultado Esperado
                                    </label>
                                    <textarea
                                        id={`result-${index}`}
                                        value={editingTestCase?.result || ''}
                                        onChange={(e) => handleEditInputChange('result', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                                        required
                                        maxLength={500}
                                        placeholder="Define el resultado esperado..."
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        disabled={!editingTestCase?.title?.trim() || !editingTestCase?.description?.trim() || !editingTestCase?.result?.trim()}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex justify-between items-stretch min-h-32">
                                <div className="space-y-3 flex-grow">
                                    <h4 className="text-lg font-semibold text-gray-800">{testCase.title}</h4>
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-700">Descripción: </span>
                                        {testCase.description}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium text-gray-700">Resultado Esperado: </span>
                                        {testCase.result}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-between items-end self-stretch ml-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`test-checkbox-${index}`}
                                            name="test-checkbox"
                                            type="checkbox"
                                            checked={testCase.selected || false}
                                            onChange={() => handleTestCaseSelection(index)}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleEditTestCase(index)}
                                        className="px-2 py-1 bg-gray-400 text-white text-sm font-medium rounded-md hover:bg-blue-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                        disabled={editingIndex !== null}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {loading &&
                    <div className="flex flex-col items-center space-y-4">
                        <p className="text-center text-gray-600">Cargando casos de prueba...</p>
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-300 animate-spin fill-indigo-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div>
                }

                {!loading && testCases.length === 0 && (
                    <div className="text-center text-gray-500 p-6 bg-gray-50 rounded-lg">
                        <p>No se han generado tests todavía. Pulsa "Generar" para empezar.</p>
                    </div>
                )}
                <div className="flex justify-end mt-4">
                    <button
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        onClick={handlePostTestCases}
                    >
                        Enviar
                    </button>
                </div>
            </section>
        </div>
    );
}