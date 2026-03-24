import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const LESSON_PREVIEW_FOLDER = "learntoteach/lesson-previews";

// Uploads a base64 image to Cloudinary and returns the upload result (URL + publicId)
export const uploadLessonPreviewImage = async (file: string) => {
  return cloudinary.uploader.upload(file, {
    folder: LESSON_PREVIEW_FOLDER,
    resource_type: "image",
  });
};