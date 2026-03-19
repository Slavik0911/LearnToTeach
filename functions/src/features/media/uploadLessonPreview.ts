import { onCall, HttpsError } from "firebase-functions/v2/https";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload lesson preview to Cloudinary
export const uploadLessonPreview = onCall(
  {
    region: "europe-west1",
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request) => {
    const { fileBase64 } = request.data || {};

    if (!fileBase64 || typeof fileBase64 !== "string") {
      throw new HttpsError("invalid-argument", "fileBase64 is required");
    }

    try {
      const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "learntoteach/lesson-previews",
        resource_type: "image",
      });

      return {
        secureUrl: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error(error);
      throw new HttpsError("internal", "Upload failed");
    }
  }
);