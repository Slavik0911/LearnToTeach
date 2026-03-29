import { onRequest } from "firebase-functions/v2/https";
export { uploadLessonPreview } from "./features/media/uploadLessonPreview";
export { generateLessonPreview } from "./features/ai/generateLessonPreview";

export const ping = onRequest(
    {
        region: "europe-west1",
    },
    (_req, res) => {
        res.status(200).send("pong");
    },
);
