import { onRequest } from "firebase-functions/v2/https";

export const ping = onRequest(
  {
    region: "europe-west1",
  },
  (_req, res) => {
    res.status(200).send("pong");
  }
);