import { v2 as cloudinary } from "cloudinary";

const LESSON_PREVIEW_FOLDER = "learntoteach/lesson-previews";

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary environment variables");
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export const uploadLessonPreviewImage = async (file: string) => {
  configureCloudinary();

  return cloudinary.uploader.upload(file, {
    folder: LESSON_PREVIEW_FOLDER,
    resource_type: "image",
  });
};