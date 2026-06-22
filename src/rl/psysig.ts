import { createHmac } from "node:crypto";
import { PSY_KEY } from "./constants.js";

export function generatePsySig(body: string) {
  return createHmac("sha256", PSY_KEY).update(`-${body}`).digest("base64");
}
