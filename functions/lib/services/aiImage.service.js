"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLessonImageBase64 = void 0;
const axios_1 = __importDefault(require("axios"));
const LEONARDO_API_KEY = process.env.LEONARDO_API_KEY;
const LEONARDO_BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";
const FLUX_DEV_MODEL_ID = "b2614463-296c-462a-9586-aafdb8f00e36";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const createGeneration = async (prompt) => {
    const response = await axios_1.default.post(`${LEONARDO_BASE_URL}/generations`, {
        modelId: FLUX_DEV_MODEL_ID,
        prompt,
        num_images: 1,
        width: 896,
        height: 896,
        contrast: 3.5,
        enhancePrompt: false,
    }, {
        headers: {
            accept: "application/json",
            authorization: `Bearer ${LEONARDO_API_KEY}`,
            "content-type": "application/json",
        },
    });
    const generationId = response.data?.sdGenerationJob?.generationId;
    if (!generationId) {
        throw new Error("Leonardo did not return generationId");
    }
    return generationId;
};
const waitForImageUrl = async (generationId) => {
    const maxAttempts = 40;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const response = await axios_1.default.get(`${LEONARDO_BASE_URL}/generations/${generationId}`, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${LEONARDO_API_KEY}`,
            },
        });
        const job = response.data?.generations_by_pk;
        const status = job?.status;
        const imageUrl = job?.generated_images?.[0]?.url;
        if (status === "COMPLETE" && imageUrl) {
            return imageUrl;
        }
        if (status === "FAILED") {
            throw new Error("Leonardo generation failed");
        }
        await sleep(2500);
    }
    throw new Error("Leonardo generation timed out");
};
const imageUrlToBase64DataUrl = async (imageUrl) => {
    const response = await axios_1.default.get(imageUrl, {
        responseType: "arraybuffer",
    });
    const contentType = response.headers["content-type"] || "image/png";
    const base64 = Buffer.from(response.data).toString("base64");
    return `data:${contentType};base64,${base64}`;
};
const generateLessonImageBase64 = async (prompt) => {
    if (!LEONARDO_API_KEY) {
        throw new Error("Missing LEONARDO_API_KEY");
    }
    try {
        const generationId = await createGeneration(prompt);
        const imageUrl = await waitForImageUrl(generationId);
        return await imageUrlToBase64DataUrl(imageUrl);
    }
    catch (error) {
        console.error("Leonardo FLUX Dev raw error:", error);
        if (error.response) {
            console.error("Leonardo status:", error.response.status);
            console.error("Leonardo data:", error.response.data);
        }
        else {
            console.error("Leonardo message:", error.message);
        }
        throw new Error("AI image generation failed");
    }
};
exports.generateLessonImageBase64 = generateLessonImageBase64;
//# sourceMappingURL=aiImage.service.js.map