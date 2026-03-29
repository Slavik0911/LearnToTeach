import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

export const generateLessonPreview = async (data: any) => {
    try {
        const fn = httpsCallable(functions, "generateLessonPreview");
        const res = await fn(data);
        console.log("generateLessonPreview success:", res.data);
        return res.data;
    } catch (error) {
        console.error("generateLessonPreview client error:", error);
        throw error;
    }
};
