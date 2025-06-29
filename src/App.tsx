import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";
import CodeGenerator from "./pages/dashboard/CodeGenerator";
import RoadmapGenerator from "./pages/dashboard/RoadmapGenerater";
import AlgorithmExplainer from "./pages/dashboard/AlgorithmExplainer";
import TimeComplexityAnalyzer from "./pages/dashboard/TimeComplexityAnalyzer";
import APIGenerator from "./pages/dashboard/APIGenerator";
import RecentChats from './pages/dashboard/RecentChats';
import FrontendDeveloper from './pages/dashboard/FrontendDeveloper';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />}>
            <Route path="code-generator" element={<CodeGenerator />} />
            <Route path="roadmap-generator" element={<RoadmapGenerator />} />
            <Route path="algorithm-explainer" element={<AlgorithmExplainer />} />
            <Route path="time-complexity" element={<TimeComplexityAnalyzer />} />
            <Route path="api-generator" element={<APIGenerator />} />
            <Route path="frontend-developer" element={<FrontendDeveloper />} />
            <Route path="recent-chats" element={<RecentChats />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}