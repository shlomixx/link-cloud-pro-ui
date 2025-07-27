import React, { useState, useCallback } from 'react';
import { Upload, ImageIcon, Loader2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ImageDescriptionToolProps {
  // Component props would be defined here if needed
}

export const ImageDescriptionTool: React.FC<ImageDescriptionToolProps> = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear previous description
    setDescription('');
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const generateDescription = async () => {
    if (!selectedImage || !imagePreview) {
      toast.error('Please select an image first');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock AI description for now - in a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      const mockDescriptions = [
        "This image shows a beautiful landscape with rolling hills covered in lush green grass. In the foreground, there are colorful wildflowers scattered across the meadow. The sky is partly cloudy with soft white clouds against a blue backdrop. In the distance, there appear to be some trees forming a natural border along the horizon.",
        "The image depicts a modern urban scene with tall glass buildings reflecting the sunlight. People can be seen walking along the sidewalk, and there are cars parked along the street. The architecture appears to be contemporary with clean lines and geometric shapes. Street lights and some green vegetation add to the urban atmosphere.",
        "This photograph captures a cozy indoor scene with warm lighting. There appears to be furniture arranged in a living space, with soft textures and neutral colors dominating the composition. Natural light seems to be coming through windows, creating interesting shadows and highlights throughout the room.",
        "The image shows what appears to be a close-up view of an object or surface with interesting textures and patterns. The lighting creates depth and dimension, highlighting various details that might not be immediately apparent from a distance. The composition suggests careful attention to artistic elements.",
        "This image contains various elements arranged in a compositionally pleasing way. The color palette appears to be harmonious, with different shades and tones working together to create visual interest. The overall mood of the image is calm and inviting."
      ];
      
      const randomDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      setDescription(randomDescription);
      toast.success('Image description generated successfully!');
      
    } catch (error) {
      console.error('Error generating description:', error);
      toast.error('Failed to generate description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyDescription = () => {
    if (description) {
      navigator.clipboard.writeText(description);
      toast.success('Description copied to clipboard!');
    }
  };

  const downloadDescription = () => {
    if (description && selectedImage) {
      const blob = new Blob([description], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedImage.name.split('.')[0]}_description.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Description downloaded!');
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setDescription('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
        <CardContent className="p-8">
          <div
            className={`relative cursor-pointer transition-all duration-200 ${
              isDragOver ? 'bg-blue-500/10 border-blue-400' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!imagePreview ? (
              <div className="text-center py-12">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Upload an image to describe
                </h3>
                <p className="text-gray-400 mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Choose Image
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supports JPG, PNG, GIF, WebP (max 10MB)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-h-96 object-contain rounded-lg bg-gray-800"
                  />
                  <Button
                    onClick={clearImage}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    Clear
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    {selectedImage?.name} ({Math.round((selectedImage?.size || 0) / 1024)} KB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generate Description Button */}
      {imagePreview && (
        <div className="text-center">
          <Button
            onClick={generateDescription}
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
      {description && (
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
              {description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageDescriptionTool;