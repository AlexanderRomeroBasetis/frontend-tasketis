import React, { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { IUserUpdateRequest } from "../interfaces";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [jiraToken, setJiraToken] = useState("");
  const [jiraServerType, setJiraServerType] = useState("cloud");
  const [jiraUrl, setJiraUrl] = useState("");
  const [geminiToken, setGeminiToken] = useState("");

  useEffect(() => {
    userService.getUser().then(user => {
      setJiraToken(user.jiraToken);
      setJiraServerType(user.jiraVersion === 1 ? "cloud" : "server");
      setJiraUrl(user.jiraUrl);
      setGeminiToken(user.geminiToken);
    });
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: IUserUpdateRequest = {
      geminiToken,
      jiraToken,
      jiraUrl,
      jiraVersion: jiraServerType === "cloud" ? 1 : 0,
    };
    userService.updateUser(userData);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button onClick={onClose} className="text-gray-500 text-3xl cursor-pointer hover:bg-gray-200 hover:text-red-800 hover:cursor-pointer px-1 rounded-full">&times;</button>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label htmlFor="jira-api-token" className="block text-sm font-medium text-gray-700">Jira API Token</label>
            <div className="flex pl-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <input
                type="password"
                id="jira-api-token"
                value={jiraToken}
                onChange={(e) => setJiraToken(e.target.value)}
                className="mt-1 w-full px-3"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 hover:cursor-pointer p-2 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById("jira-api-token") as HTMLInputElement;
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                  <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="jira-server-type" className="block text-sm font-medium text-gray-700">Jira Server Type</label>
            <select
              id="jira-server-type"
              value={jiraServerType}
              onChange={(e) => setJiraServerType(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option>Cloud</option>
              <option>Server</option>
            </select>
          </div>
          <div>
            <label htmlFor="jira-url" className="block text-sm font-medium text-gray-700">Jira URL</label>
            <input
              type="text"
              value={jiraUrl}
              onChange={(e) => setJiraUrl(e.target.value)}
              id="jira-url" className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="gemini-api-token" className="block text-sm font-medium text-gray-700">Gemini API Token</label>
            <div className="flex pl-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <input
                type="password"
                id="gemini-api-token"
                value={geminiToken}
                onChange={(e) => setGeminiToken(e.target.value)}
                className="mt-1 w-full px-3"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 p-2 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById("gemini-api-token") as HTMLInputElement;
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                <svg className="shrink-0 size-3.5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                  <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                  <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                  <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                  <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                  <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 hover:cursor-pointer transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 hover:cursor-pointer transition cursor-pointer"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;