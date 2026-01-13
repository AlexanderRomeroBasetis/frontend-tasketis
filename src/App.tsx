import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import TestCaseGenerator from "./pages/TestCaseGenerator";
import TaskGenerator from "./pages/TaskGenerator";
import { Layout } from "./components/Layout";
import './styles/main.css';
import './styles/reset.css';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={
          <Login/>
        }
      />
      <Route
        path="/test-case-generator"
        element={
          <RequireAuth>
            <Layout>
              <TestCaseGenerator/>
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/task-generator"
        element={
          <RequireAuth>
            <Layout>
              <TaskGenerator/>
            </Layout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App