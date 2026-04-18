import React, { useState } from 'react';
import SoilUploader from './components/SoilUploader';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-800 mb-2">
          Soil <span className="text-green-600">Analyser</span>
        </h1>
        <p className="text-gray-500 text-lg italic">CNN Intelligence + Grok Insights</p>
      </header>

      {/* Main Content */}
      <SoilUploader onResult={setResult} setLoading={setLoading} />

      {loading && (
        <div className="mt-8 flex items-center space-x-2 text-green-700">
          <div className="animate-spin h-5 w-5 border-4 border-green-500 border-t-transparent rounded-full"></div>
          <span className="font-medium">Analysing with CNN and Grok...</span>
        </div>
      )}

      {!loading && <ResultDisplay data={result} />}
    </div>
  );
}

export default App;