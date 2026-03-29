export const LEVELS = ["A0", "A1", "A2", "B1", "B2", "C1"];

export function createInitialFormState(initialData = null) {
    return {
        // Basic
        title: initialData?.title || "",
        topic: initialData?.topic || "",
        description: initialData?.description || "",
        age: initialData?.age || "",
        level: initialData?.level || "",
        isPremium: initialData?.isPremium || false,
        lessonType: initialData?.lessonType || "standard",
        images: (initialData?.images || []).map((url) => ({ url })),
        aiVisualNotes: initialData?.aiVisualNotes || "",

        // TED Talk
        speaker: initialData?.speaker || "",
        videoUrl: initialData?.videoUrl || "",
        duration: initialData?.duration || "",
        discussionQuestions: initialData?.discussionQuestions?.length
            ? initialData.discussionQuestions
            : [""],

        // Book / Story
        bookTitle: initialData?.bookTitle || "",
        author: initialData?.author || "",
        storyType: initialData?.storyType || "",
        themes: initialData?.themes?.length ? initialData.themes : [""],

        // Grammar
        grammarTopic: initialData?.grammarTopic || "",
        ruleFocus: initialData?.ruleFocus || "",
        exercisesCount: initialData?.exercisesCount || "",

        // Materials
        studentVersion: initialData?.studentVersion || "",
        teacherVersion: initialData?.teacherVersion || "",
        presentationUrl: initialData?.presentationUrl || "",
        worksheetsUrl: initialData?.worksheetsUrl || "",
    };
}

// Generate slug
export function generateSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");
}

// Validation for form
export function validateLessonForm(form) {
    const errors = {};

    if (!form.title.trim()) errors.title = true;
    if (!form.topic.trim()) errors.topic = true;
    if (!form.description.trim()) errors.description = true;
    if (!form.age) errors.age = true;
    if (!form.level) errors.level = true;
    if (form.images.length === 0) errors.images = true;

    return errors;
}

export function buildTypeFields(form) {
    if (form.lessonType === "ted-talk") {
        return {
            speaker: form.speaker.trim(),
            videoUrl: form.videoUrl.trim(),
            duration: form.duration.trim(),
            discussionQuestions: form.discussionQuestions
                .map((q) => q.trim())
                .filter(Boolean),
        };
    }

    if (form.lessonType === "book-story") {
        return {
            bookTitle: form.bookTitle.trim(),
            author: form.author.trim(),
            storyType: form.storyType.trim(),
            themes: form.themes.map((t) => t.trim()).filter(Boolean),
        };
    }

    if (form.lessonType === "grammar") {
        return {
            grammarTopic: form.grammarTopic.trim(),
            ruleFocus: form.ruleFocus.trim(),
            exercisesCount: form.exercisesCount.trim(),
        };
    }

    return {};
}

export function buildLessonData(form) {
    return {
        title: form.title.trim(),
        title_lc: form.title.trim().toLowerCase(),
        topic: form.topic.trim(),
        topic_lc: form.topic.trim().toLowerCase(),
        description: form.description.trim(),
        aiVisualNotes: form.aiVisualNotes.trim() || null,
        age: form.age,
        level: form.level,
        images: form.images,
        isPremium: form.isPremium,
        lessonType: form.lessonType,
        ...buildTypeFields(form),

        studentVersion: form.studentVersion.trim() || null,
        teacherVersion: form.teacherVersion.trim() || null,
        presentationUrl: form.presentationUrl.trim() || null,
        worksheetsUrl: form.worksheetsUrl.trim() || null,
    };
}
