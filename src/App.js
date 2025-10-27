import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ECMExplanation from './pages/ECMExplanation';
import DevelopmentGuide from './pages/DevelopmentGuide';
import RepositoryAnalysis from './pages/RepositoryAnalysis';
import ScriptReorganization from './pages/ScriptReorganization';
import Templates from './pages/Templates';
import Chat from './pages/Chat';
import Settings from './pages/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router basename={process.env.NODE_ENV === 'production' ? '/ECM-Education-Agent' : ''}>
        <div className="App">
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/explanation" element={<ECMExplanation />} />
              <Route path="/development" element={<DevelopmentGuide />} />
              <Route path="/analysis" element={<RepositoryAnalysis />} />
              <Route path="/reorganization" element={<ScriptReorganization />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
