import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import SettingsModal from "./SettingsModal";
import { Link } from "react-router-dom";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen min-w-[900px] bg-gray-100">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white shadow-md rounded-lg">
                    <header className="flex justify-between items-center p-6 border-b border-gray-200">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jira Test Generator</h1>
                        <button
                            onClick={openModal}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label="Settings"
                        >
                            <Cog6ToothIcon className="h-6 w-6" />
                        </button>
                    </header>
                    <nav className="border-b border-gray-200">
                        <div className="flex">
                            <Link
                                to="/test-case-generator"
                                className={`flex-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200 border-b-2 ${
                                    location.pathname === "/test-case-generator"
                                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                }`}
                            >
                                Test Case Generator
                            </Link>
                            <Link
                                to="/task-generator"
                                className={`flex-1 px-4 py-2 text-center text-sm font-medium transition-colors duration-200 border-b-2 ${
                                    location.pathname === "/task-generator"
                                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:cursor-pointer"
                                }`}
                            >
                                Task Generator
                            </Link>
                        </div>
                    </nav>
                    
                    <main className="bg-white">
                        {children}
                    </main>
                </div>
            </div>
            <SettingsModal isOpen={isModalOpen} onClose={closeModal} />
        </div>
    );
};

