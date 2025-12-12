import React, { useEffect, useState } from "react";
import { userService } from "../api/userService";
import type { IUserUpdateRequest, IUserAiConfiguration } from "../interfaces";
import { EyeButton } from "./EyeButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [jiraToken, setJiraToken] = useState("");
  const [jiraServerType, setJiraServerType] = useState<number>(1);
  const [jiraUrl, setJiraUrl] = useState("");
  const [geminiToken, setGeminiToken] = useState("");
  const [chatgptToken, setChatgptToken] = useState("");
  const [userAiData, setUserAiData] = useState<IUserAiConfiguration[]>([]);

  useEffect(() => {
    userService.getUser().then(user => {
      setJiraToken(user.jiraToken);
      console.log("User Jira Version:", user.jiraVersion);
      setJiraServerType(user.jiraVersion);
      setJiraUrl(user.jiraUrl);
    });
  }, [isOpen]);

  useEffect(() => {
    userService.getAiUserConfiguration().then(userAiData => {
      setUserAiData(userAiData);
      userAiData.forEach(config => {
        // gemini 1 chatgpt 2
        if (config.type === 1) {
          setGeminiToken(config.token);
        } else if (config.type === 2) {
          setChatgptToken(config.token);
        }
      });
    });
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const userData: IUserUpdateRequest = {
      jiraToken,
      jiraUrl,
      jiraVersion: jiraServerType,
    };
    userService.updateJiraUserCredentials(userData);

    userAiData.forEach(config => {
      if (config.type === 1) {
        userService.updateAiUserConfiguration({
          type: 1,
          token: geminiToken,
        });
      } else if (config.type === 2) {
        userService.updateAiUserConfiguration({
          type: 2,
          token: chatgptToken,
        });
      }
    });
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
                <EyeButton />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="jira-server-type" className="block text-sm font-medium text-gray-700">Jira Server Type</label>
            <select
              id="jira-server-type"
              value={jiraServerType === 1 ? "Cloud" : "Server"}
              onChange={(e) => setJiraServerType(e.target.value === "Cloud" ? 1 : 0)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              <option value="Cloud">Cloud</option>
              <option value="Server">Server</option>
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
                <EyeButton />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="chatgpt-api-token" className="block text-sm font-medium text-gray-700">ChatGPT API Token</label>
            <div className="flex pl-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <input
                type="password"
                id="chatgpt-api-token"
                value={chatgptToken}
                onChange={(e) => setChatgptToken(e.target.value)}
                className="mt-1 w-full px-3"
              />
              <button
                type="button"
                className="text-gray-500 hover:text-gray-800 p-2 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById("chatgpt-api-token") as HTMLInputElement;
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                <EyeButton />
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