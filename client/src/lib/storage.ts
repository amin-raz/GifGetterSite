import { uploadData, getUrl, remove } from 'aws-amplify/storage';

export interface GifUploadResult {
  key: string;
  url: string;
}

export async function uploadGif(file: File): Promise<GifUploadResult> {
  try {
    const timestamp = new Date().getTime();
    const key = `gifs/${timestamp}-${file.name}`;
    
    const result = await uploadData({
      key,
      data: file,
      options: {
        contentType: 'image/gif',
        accessLevel: 'protected'
      }
    }).result;

    const url = await getUrl({
      key,
      options: {
        validateObjectExistence: true,
        accessLevel: 'protected'
      }
    });

    return {
      key: result.key,
      url: url.url.toString()
    };
  } catch (error) {
    console.error('Error uploading GIF:', error);
    throw error;
  }
}

export async function deleteGif(key: string): Promise<void> {
  try {
    await remove({
      key,
      options: {
        accessLevel: 'protected'
      }
    });
  } catch (error) {
    console.error('Error deleting GIF:', error);
    throw error;
  }
}
