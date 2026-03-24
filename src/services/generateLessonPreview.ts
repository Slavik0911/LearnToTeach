import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

// Calls the backend generateLessonPreview function via Firebase, sends lesson data,
// and returns the generated image result (secureUrl and publicId)
export const generateLessonPreview = async (data: any) => {
  const fn = httpsCallable(functions, "generateLessonPreview");
  const res = await fn(data);
  return res.data;
};