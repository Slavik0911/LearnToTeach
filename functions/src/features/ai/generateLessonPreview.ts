import { onCall, HttpsError } from "firebase-functions/v2/https";
import { buildLessonImagePrompt } from "../../utils/buildLessonImagePrompt";
import { generateLessonImageBase64 } from "../../services/aiImage.service";
import { uploadLessonPreviewImage } from "../../services/cloudinary.service";

export const generateLessonPreview = onCall(
    {
        region: "europe-west1",
        timeoutSeconds: 180,
        memory: "1GiB",
    },
    async (request) => {
        const { title, topic, description, lessonType, aiVisualNotes } =
            request.data || {};

        if (typeof title !== "string" || !title.trim()) {
            throw new HttpsError("invalid-argument", "title is required");
        }

        try {
            const prompt = buildLessonImagePrompt({
                title,
                topic,
                description,
                lessonType,
                aiVisualNotes,
            });

            const imageBase64 = await generateLessonImageBase64(prompt);
            const uploadResult = await uploadLessonPreviewImage(imageBase64);

            return {
                secureUrl: uploadResult.secure_url,
                publicId: uploadResult.public_id,
            };
        } catch (error: unknown) {
            console.error("generateLessonPreview error:", error);

            if (error instanceof Error) {
                throw new HttpsError("internal", error.message);
            }

            throw new HttpsError("internal", "Image generation failed");
        }
    },
);
