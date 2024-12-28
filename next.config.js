/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ddtqzdymlsrujlcdacim.supabase.co']
  }
};

export default nextConfig;

export const uploadImage = async (file) => {
    try {
        console.log("Starting upload...");
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully. URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw new Error("Failed to upload image");
    }
};
