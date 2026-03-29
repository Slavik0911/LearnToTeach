"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLessonPreview = void 0;
const https_1 = require("firebase-functions/v2/https");
const buildLessonImagePrompt_1 = require("../../utils/buildLessonImagePrompt");
const aiImage_service_1 = require("../../services/aiImage.service");
const cloudinary_service_1 = require("../../services/cloudinary.service");
exports.generateLessonPreview = (0, https_1.onCall)(
    {
        region: "europe-west1",
        timeoutSeconds: 180,
        memory: "1GiB",
        cors: ["https://slavik0911.github.io"],
    },
    async (request) => {
        const { title, topic, description, lessonType, aiVisualNotes } =
            request.data || {};
        if (typeof title !== "string" || !title.trim()) {
            throw new https_1.HttpsError(
                "invalid-argument",
                "title is required",
            );
        }
        try {
            const prompt = (0, buildLessonImagePrompt_1.buildLessonImagePrompt)(
                {
                    title,
                    topic,
                    description,
                    lessonType,
                    aiVisualNotes,
                },
            );
            const imageBase64 = await (0,
            aiImage_service_1.generateLessonImageBase64)(prompt);
            const uploadResult = await (0,
            cloudinary_service_1.uploadLessonPreviewImage)(imageBase64);
            return {
                secureUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            };
        } catch (error) {
            console.error("generateLessonPreview error:", error);
            if (error instanceof Error) {
                throw new https_1.HttpsError("internal", error.message);
            }
            throw new https_1.HttpsError("internal", "Image generation failed");
        }
    },
);
//# sourceMappingURL=generateLessonPreview.js.map
