import React, { useState } from "react";
import { JiraData } from "../components/JiraData";
import { TestCase } from "../components/TestCase";


const TestCaseGenerator: React.FC = () => {
  const [showAlertInvalidIssueKey, setShowAlertInvalidIssueKey] = useState(false);
  const [showAlertNoToken, setShowAlertNoToken] = useState(false);
  const [jiraIssueKey, setJiraIssueKey] = useState<string>("");

  const alertInvalidJiraIssueKey = () => {
    return (
      <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 bg-gray-100 text-red-400" role="alert">
        <span className="font-medium">Issue key invalida!</span> Por favor, introduce una issue de Jira válida.
      </div>
    )
  }

  const alertNoToken = () => {
    return (
      <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 bg-gray-100 text-red-400" role="alert">
        <span className="font-medium">Por favor, recarga la pagina y vuelve a hacer login</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 flex flex-col gap-4">
        <JiraData
          invalidIssueKey={setShowAlertInvalidIssueKey}
          noToken={setShowAlertNoToken}
          onIssueKeyChange={setJiraIssueKey}
        />
        <TestCase
          jiraIssueKey={jiraIssueKey}
          onIssueKeyError={setShowAlertInvalidIssueKey}
        />
      </div>
      {/* Render empty iussue alert */}
      {showAlertInvalidIssueKey && alertInvalidJiraIssueKey()}
      {showAlertNoToken && alertNoToken()}
    </div >
  );
};

export default TestCaseGenerator;