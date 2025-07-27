import React, { useState } from 'react';
import { Upload, ImageIcon, Loader2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageDescriptionDemoProps {
  // Component props would be defined here if needed
}

export const ImageDescriptionDemo: React.FC<ImageDescriptionDemoProps> = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const demoImageUrl = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzY2ODNmZiIvPgogIDx0ZXh0IHg9IjIwMCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EZXB0aCBvZiBGaWVsZDwvdGV4dD4KICA8dGV4dCB4PSIyMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UGhvdG9ncmFwaHk8L3RleHQ+CiAgPGNpcmNsZSBjeD0iMTUwIiBjeT0iMjAwIiByPSIzMCIgZmlsbD0iIzM0ZDM5OSIvPgogIDxjaXJjbGUgY3g9IjI1MCIgY3k9IjIwMCIgcj0iMjUiIGZpbGw9IiNmYmJmMjQiLz4KICA8cmVjdCB4PSIxMDAiIHk9IjI0MCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzg0Y2M4NCIvPgo8L3N2Zz4K";
  
  const demoDescription = "This image demonstrates the concept of depth of field in photography. It features a gradient blue background with the title 'Depth of Field Photography' prominently displayed in white text. Below the title are geometric shapes - two circles in different sizes (one larger green circle and one smaller yellow circle) positioned to illustrate foreground and background elements. At the bottom, there's a green rectangular bar that could represent a camera interface element or ground plane. The overall composition uses a blue color scheme with contrasting green and yellow accents to create visual interest and demonstrate how different elements at varying distances can be used to create depth in photographic compositions.";

  const startDemo = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing
    setShowDemo(true);
    setIsLoading(false);
    toast.success('Image description generated successfully!');
  };

  const copyDescription = () => {
    navigator.clipboard.writeText(demoDescription);
    toast.success('Description copied to clipboard!');
  };

  const downloadDescription = () => {
    const blob = new Blob([demoDescription], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'demo_image_description.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Description downloaded!');
  };

  const resetDemo = () => {
    setShowDemo(false);
    setIsLoading(false);
  };

  if (!showDemo && !isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card className="border-2 border-dashed border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
          <CardContent className="p-8">
            <div className="text-center py-12">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Upload an image to describe
              </h3>
              <p className="text-gray-400 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <div className="space-y-4">
                <Button variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
                <div>
                  <Button onClick={startDemo} className="bg-blue-600 hover:bg-blue-700">
                    Try Demo Image
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Supports JPG, PNG, GIF, WebP (max 10MB)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area with Image Preview */}
      <Card className="border-2 border-gray-600 bg-gray-900/50">
        <CardContent className="p-8">
          <div className="space-y-4">
            <div className="relative">
              <img
                src={demoImageUrl}
                alt="Demo image for description"
                className="w-full max-h-96 object-contain rounded-lg bg-gray-800"
              />
              <Button
                onClick={resetDemo}
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
              >
                Clear
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">
                demo_image.svg (2 KB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Description Button */}
      {!showDemo && (
        <div className="text-center">
          <Button
            onClick={startDemo}
            disabled={isLoading}
            className="px-8 py-3 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing image...
              </>
            ) : (
              'Generate Description'
            )}
          </Button>
        </div>
      )}

      {/* Description Result */}
      {showDemo && (
        <Card className="bg-gray-900/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              AI Generated Description
              <div className="flex gap-2">
                <Button
                  onClick={copyDescription}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button
                  onClick={downloadDescription}
                  variant="outline"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 leading-relaxed text-lg">
              {demoDescription}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageDescriptionDemo;