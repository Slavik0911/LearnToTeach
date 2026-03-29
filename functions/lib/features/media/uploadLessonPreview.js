"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLessonPreview = void 0;
const https_1 = require("firebase-functions/v2/https");
const cloudinary_service_1 = require("../../services/cloudinary.service");
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
        const result = await (0, cloudinary_service_1.uploadLessonPreviewImage)(fileBase64);
        return {
            secureUrl: result.secure_url,
            publicId: result.public_id,
        };
    }
    catch (error) {
        console.error("uploadLessonPreview error:", error);
        if (error instanceof Error) {
            throw new https_1.HttpsError("internal", error.message);
        }
        throw new https_1.HttpsError("internal", "Upload failed");
    }
});
//# sourceMappingURL=uploadLessonPreview.js.map