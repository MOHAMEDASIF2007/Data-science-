import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ModelIntelligence from './pages/ModelIntelligence';
import EDA from './pages/EDA';
import FeatureInsights from './pages/FeatureInsights';

import Documentation from './pages/Documentation';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-brand-mainBg text-brand-textMain">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-6">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/prediction" element={<Prediction />} />
                <Route path="/model" element={<ModelIntelligence />} />
                <Route path="/eda" element={<EDA />} />
                <Route path="/insights" element={<FeatureInsights />} />
                <Route path="/documentation" element={<Documentation />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
