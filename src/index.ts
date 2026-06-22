import { serve } from "@hono/node-server";
import { Hono } from "hono";

const PORT = 3000;

const app = new Hono();
app.get("/", (c) => c.text("Hello world!"));

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Running on ${info.address}:${info.port}`);
  },
);
