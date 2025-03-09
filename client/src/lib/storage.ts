import type { User } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function uploadGif(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest("POST", "/api/upload", formData);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading GIF:', error);
    throw error;
  }
}

export async function deleteGif(id: string): Promise<void> {
  try {
    await apiRequest("DELETE", `/api/gifs/${id}`);
  } catch (error) {
    console.error('Error deleting GIF:', error);
    throw error;
  }
}