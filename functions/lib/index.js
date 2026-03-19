"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = exports.uploadLessonPreview = void 0;
const https_1 = require("firebase-functions/v2/https");
var uploadLessonPreview_1 = require("./features/media/uploadLessonPreview");
Object.defineProperty(exports, "uploadLessonPreview", { enumerable: true, get: function () { return uploadLessonPreview_1.uploadLessonPreview; } });
exports.ping = (0, https_1.onRequest)({
    region: "europe-west1",
}, (_req, res) => {
    res.status(200).send("pong");
});
//# sourceMappingURL=index.js.map