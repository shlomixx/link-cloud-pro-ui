import ImageDescriptionTool from '@/components/ImageDescriptionTool';

function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Link Cloud Pro - Image Description Tool
        </h1>
        
        {/* Use the main component for production */}
        <ImageDescriptionTool />
      </div>
    </div>
  );
}

export default Index;