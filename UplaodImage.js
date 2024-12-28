import { supabase } from "./supabaseClient";

export const uploadImage = async (file) => {
  try {
    console.log("Starting upload...");
    const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '-')}`;
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage error:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    console.log("Image uploaded successfully. URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
};
