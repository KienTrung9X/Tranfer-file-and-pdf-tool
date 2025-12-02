import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Upload } from './pages/Upload';
import { Download } from './pages/Download';
import { PdfTools } from './pages/PdfTools';
import { SplitPdf } from './pages/SplitPdf';
import { RotatePdf } from './pages/RotatePdf';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/download/:code" element={<Download />} />
            
            {/* PDF Tools Routes */}
            <Route path="/pdf-tools" element={<PdfTools />} />
            <Route path="/pdf-tools/split" element={<SplitPdf />} />
            <Route path="/pdf-tools/rotate" element={<RotatePdf />} />
            
            {/* Redirect unknown routes to upload */}
            <Route path="*" element={<Navigate to="/upload" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;