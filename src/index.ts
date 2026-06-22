import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bootstrap } from "./bootstrapper.js";
import { EOSAuth } from "./egs-auth/index.js";

const PORT = 3000;
const currentAuth: EOSAuth = EOSAuth.default();

const app = new Hono();
app.get("/bootstrap", () => bootstrap(currentAuth));

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Running on ${info.address}:${info.port}`);
  },
);
