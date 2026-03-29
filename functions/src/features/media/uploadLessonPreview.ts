import { onCall, HttpsError } from "firebase-functions/v2/https";
import { uploadLessonPreviewImage } from "../../services/cloudinary.service";

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
            const result = await uploadLessonPreviewImage(fileBase64);

            return {
                secureUrl: result.secure_url,
                publicId: result.public_id,
            };
        } catch (error: unknown) {
            console.error("uploadLessonPreview error:", error);

            if (error instanceof Error) {
                throw new HttpsError("internal", error.message);
            }

            throw new HttpsError("internal", "Upload failed");
        }
    },
);
