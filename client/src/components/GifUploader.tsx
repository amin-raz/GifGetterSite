import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadGif } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function GifUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('gif')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a GIF file',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadGif(file);
      console.log('Upload result:', result); // Debug log
      setUploadedUrl(result.url);
      toast({
        title: 'Upload successful',
        description: 'Your GIF has been uploaded successfully',
      });
    } catch (error) {
      console.error('Upload error:', error); // Debug log
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload GIF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="gif-upload"
          disabled={isUploading}
        />
        <label htmlFor="gif-upload">
          <Button asChild variant="outline" disabled={isUploading}>
            <span className="flex items-center gap-2">
              {isUploading ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  Uploading...
                </>
              ) : (
                'Upload GIF'
              )}
            </span>
          </Button>
        </label>
      </div>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Uploaded GIF:</p>
          <img src={uploadedUrl} alt="Uploaded GIF" className="max-w-xs rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}