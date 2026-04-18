import React from 'react';

const ResultDisplay = ({ data }) => {
  if (!data) return null;

  // Split the insights by newlines and filter out any empty lines
  const insightPoints = data.insights
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="mt-8 w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header with Glassmorphism effect */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
            {data.prediction}
          </h2>
          <p className="text-sm font-medium text-green-600">Analysis complete</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-2xl border border-green-100">
          <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest text-center">Confidence</p>
          <p className="text-xl font-black text-green-700">{data.confidence}</p>
        </div>
      </div>

      {/* Insight Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="p-1.5 bg-green-600 rounded-lg">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Krishi AI Recommendations
        </h3>

        <div className="grid gap-4">
          {insightPoints.map((point, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-green-50/30 transition-colors duration-300"
            >
              {/* Number Badge */}
              <div className="shrink-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-green-700 shadow-sm border border-gray-100">
                {index + 1}
              </div>
              
              {/* Point Content */}
              <p className="text-gray-700 leading-relaxed font-medium pt-0.5">
                {/* Remove leading numbers or bullets if the AI included them */}
                {point.replace(/^\d+\.\s*|-\s*/, '')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Footer */}
      <div className="mt-10 pt-6 border-t border-gray-50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <span>Region: India</span>
        <span>Llama-3.3 Intelligence</span>
      </div>
    </div>
  );
};

export default ResultDisplay;