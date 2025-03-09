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

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a video file (MP4, WebM, or MOV)',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadGif(file);
      setUploadedUrl(result);
      toast({
        title: 'Upload successful',
        description: 'Your video has been uploaded and will be converted to a GIF',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload video. Please try again.',
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
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
          disabled={isUploading}
        />
        <label htmlFor="video-upload">
          <Button asChild variant="outline" disabled={isUploading}>
            <span className="flex items-center gap-2">
              {isUploading ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  Converting...
                </>
              ) : (
                'Upload Video'
              )}
            </span>
          </Button>
        </label>
      </div>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Generated GIF:</p>
          <img src={uploadedUrl} alt="Generated GIF" className="max-w-xs rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}