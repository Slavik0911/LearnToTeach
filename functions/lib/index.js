"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ping = void 0;
const https_1 = require("firebase-functions/v2/https");
exports.ping = (0, https_1.onRequest)({
    region: "europe-west1",
}, (_req, res) => {
    res.status(200).send("pong");
});
//# sourceMappingURL=index.js.map