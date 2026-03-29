import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
    });
}

export async function uploadToBackend(file: File): Promise<string> {
    const fileBase64 = await fileToBase64(file);

    const callable = httpsCallable(functions, "uploadLessonPreview");
    const result = await callable({ fileBase64 });

    return (result.data as { secureUrl: string }).secureUrl;
}
