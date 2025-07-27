import { useMemo } from 'react';

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Link Cloud Pro - Image Description Tool
        </h1>
        
        <div className="text-center text-gray-400">
          <p>Upload an image to get an AI-powered description.</p>
        </div>
      </div>
    </div>
  );
}

export default Index;