import React, { useState } from 'react';

const SoilUploader = ({ onResult, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      onResult(null); // Clear previous results
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100">
      <div className="w-full h-56 bg-gray-50 rounded-lg mb-6 overflow-hidden flex items-center justify-center border border-gray-200">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Select a soil photo</span>
        )}
      </div>

      <div className="flex gap-4">
        <label className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300">
          Select Image
          <input type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
        </label>

        <button 
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`px-6 py-2 rounded-lg font-bold text-white transition-all ${
            selectedFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          Get AI Insights
        </button>
      </div>
    </div>
  );
};

export default SoilUploader;