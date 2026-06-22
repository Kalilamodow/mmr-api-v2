import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bootstrap } from "./bootstrapper.js";
import { EOSAuth } from "./egs-auth/index.js";
import { RocketLeague } from "./rl/index.js";

const PORT = 3000;
const currentAuth: EOSAuth = EOSAuth.default();
const rocketLeague = new RocketLeague();

const app = new Hono();
app.get("/bootstrap", () => bootstrap(currentAuth));
app.get("/skill", async (c) => {
  const playerId = c.req.query("playerId");
  if (playerId === undefined)
    return c.json({ error: "No player id specified" });

  try {
    const skill = await rocketLeague.getPlayerSkill(currentAuth, playerId);
    return c.json({ skill });
  } catch (error) {
    return c.json({ error: (error as Error).message });
  }
});

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  (info) => {
    console.log(`Running on ${info.address}:${info.port}`);
  },
);
