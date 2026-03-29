"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLessonPreviewImage = void 0;
const cloudinary_1 = require("cloudinary");
const LESSON_PREVIEW_FOLDER = "learntoteach/lesson-previews";
const configureCloudinary = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error("Missing Cloudinary environment variables");
    }
    cloudinary_1.v2.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
};
const uploadLessonPreviewImage = async (file) => {
    configureCloudinary();
    return cloudinary_1.v2.uploader.upload(file, {
        folder: LESSON_PREVIEW_FOLDER,
        resource_type: "image",
    });
};
exports.uploadLessonPreviewImage = uploadLessonPreviewImage;
//# sourceMappingURL=cloudinary.service.js.map
