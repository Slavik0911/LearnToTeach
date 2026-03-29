type GenerateLessonPreviewInput = {
    title: string;
    topic?: string;
    description?: string;
    aiVisualNotes?: string;
    lessonType?: "standard" | "ted-talk" | "book-story" | "grammar";
};

const getVisualStyleByLessonType = (lessonType?: string) => {
    switch (lessonType) {
        case "grammar":
            return "clean abstract educational illustration with simple visual learning elements";
        case "ted-talk":
            return "modern conceptual educational illustration with presentation-like visual structure";
        case "book-story":
            return "warm editorial-style educational illustration inspired by reading and storytelling";
        default:
            return "clean modern educational illustration";
    }
};

// Builds prompt
export const buildLessonImagePrompt = ({
    title,
    topic,
    lessonType,
    aiVisualNotes,
}: GenerateLessonPreviewInput) => {
    const style = getVisualStyleByLessonType(lessonType);

    return `
Flat vector illustration for an educational English lesson platform.

Topic: ${title}
Category: ${topic || "English learning"}
Visual details: ${aiVisualNotes || "none"}

Style:
${style}
- flat illustration
- vector style
- minimal
- clean shapes
- soft colors
- pastel palette
- modern UI illustration
- simple composition
- no realism
- no photo style
- no detailed textures

Scene:
- simple conceptual representation of the topic
- 1–2 characters or objects max
- calm composition
- friendly and educational mood

STRICTLY AVOID:
- realistic photo
- photorealism
- football match photography
- stadium scenes
- action shots
- dynamic sports scenes
- text
- letters
- logos
- watermark

Color palette:
- deep navy blue
- soft blue
- light blue
- white background
- subtle purple accents
- clean modern SaaS colors
- no bright or saturated colors
- no random color combinations


Background:
- plain light background
- minimal background
- no scene
- no background
- isolated object


The image should look like a modern SaaS product illustration, not a real photo.
`.trim();
};
