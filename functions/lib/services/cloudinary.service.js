"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLessonPreviewImage = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const LESSON_PREVIEW_FOLDER = "learntoteach/lesson-previews";
const uploadLessonPreviewImage = async (file) => {
    return cloudinary_1.v2.uploader.upload(file, {
        folder: LESSON_PREVIEW_FOLDER,
        resource_type: "image",
    });
};
exports.uploadLessonPreviewImage = uploadLessonPreviewImage;
//# sourceMappingURL=cloudinary.service.js.map