"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLessonPreview = void 0;
const https_1 = require("firebase-functions/v2/https");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Upload lesson preview to Cloudinary
exports.uploadLessonPreview = (0, https_1.onCall)({
    region: "europe-west1",
    timeoutSeconds: 60,
    memory: "512MiB",
}, async (request) => {
    const { fileBase64 } = request.data || {};
    if (!fileBase64 || typeof fileBase64 !== "string") {
        throw new https_1.HttpsError("invalid-argument", "fileBase64 is required");
    }
    try {
        const result = await cloudinary_1.v2.uploader.upload(fileBase64, {
            folder: "learntoteach/lesson-previews",
            resource_type: "image",
        });
        return {
            secureUrl: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch (error) {
        console.error(error);
        throw new https_1.HttpsError("internal", "Upload failed");
    }
});
//# sourceMappingURL=uploadLessonPreview.js.map