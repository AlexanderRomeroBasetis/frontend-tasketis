import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TestCaseGenerator from "./pages/TestCaseGenerator";
import TaskGenerator from "./pages/TaskGenerator";
import { Layout } from "./components/Layout";
import './styles/main.css';
import './styles/reset.css';

function App() {

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login/>
        }
      />
      <Route
        path="/test-case-generator"
        element={
          <Layout>
            <TestCaseGenerator/>
          </Layout>
        }
      />
      <Route
        path="/task-generator"
        element={
          <Layout>
            <TaskGenerator/>
          </Layout>
        }
      />
    </Routes>
  )
}

export default App