import React, { useEffect, useState } from "react";
import { jiraService } from "../api/jiraService";
import type { IJiraIssue } from "../interfaces";
import parse from 'html-react-parser';

interface JiraDataProps {
    invalidIssueKey: (value: boolean) => void;
    noToken: (value: boolean) => void;
    onIssueKeyChange: (issueKey: string) => void;
}

export const JiraData: React.FC<JiraDataProps> = ({
    invalidIssueKey,
    noToken,
    onIssueKeyChange,
}) => {
    const [jiraIssueKey, setJiraIssueKey] = useState<string>("");
    const [jiraIssueData, setJiraIssueData] = useState<IJiraIssue | null>(null);
    const [showAlertEpic, setShowAlertEpic] = useState<boolean>(false);
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        if (jiraIssueData?.type.toLocaleLowerCase() === 'epic') {
            setShowAlertEpic(true);
            setTimeout(() => setShowAlertEpic(false), 5000);
        }
    }, [jiraIssueData]);

    const validateIssueKey = (issueKey: string): boolean => {
        const issueKeyPattern = /^[A-Z]{2,4}-\d+$/;
        
        if (issueKey.length === 0 || !issueKeyPattern.test(issueKey)) {
            invalidIssueKey(true);
            setTimeout(() => invalidIssueKey(false), 5000);
            return false;
        }
        
        onIssueKeyChange!(issueKey);
        fetchJiraIssue(issueKey);
        return true;
    };

    const fetchJiraIssue = async (issueKey: string): Promise<IJiraIssue | false> => {
        if (!accessToken) {
            noToken(true);
            setTimeout(() => noToken(false), 5000);
            return false;
        }
        try {
            const issueData = await jiraService.getJiraIssue(issueKey, accessToken);
            setJiraIssueData(issueData);
            return issueData;
        } catch (error) {
            throw error;
        }
    };

    const alertEpicType = () => {
        return (
            <div className="fade-in-out fixed bottom-4 right-4 p-4 text-sm rounded-lg bg-red-50 bg-gray-100 text-red-400" role="alert">
                <span className="font-medium">Esta issue es una epica, considera dividirla en tareas más pequeñas.</span>
            </div>
        );
    };

    return (
        <>
            {/* Input Section */}
            <section className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                    type="text"
                    id="jiraIssueInput"
                    value={jiraIssueKey}
                    onChange={(e) => setJiraIssueKey(e.target.value)}
                    placeholder="Jira Issue E.g PIA-30"
                    className="flex-grow px-4 py-2 text-gray-700 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    onClick={async () => {
                        validateIssueKey(jiraIssueKey);
                    }}
                >
                    Fetch Issue
                </button>
            </section>

            {/* Issue Info */}
            <section className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Issue Details</h2>
                <div>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">Title: </span>{jiraIssueData?.title}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">Status: </span>{jiraIssueData?.status}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">Type: </span>{jiraIssueData?.type}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold text-gray-700">Assignee: </span>{jiraIssueData?.assignee}
                    </p>
                </div>
            </section>

            {/* Description */}
            <section className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Descripción</h3>
                    {
                        jiraIssueData?.description ? (
                            <div className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto jira-description">
                                {parse(jiraIssueData.description)}
                            </div>
                        ) : (
                            <p className="text-gray-600 leading-relaxed max-h-40 overflow-y-auto">
                                "No hay descripción disponible para esta issue."
                            </p>
                        )
                    }
            </section>

            {/* Render epic type issue alert */}
            {showAlertEpic && alertEpicType()}
        </>
    );
}