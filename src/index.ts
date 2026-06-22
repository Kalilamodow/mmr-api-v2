import { serve } from "@hono/node-server";
import { Hono } from "hono";
import * as fs from "node:fs";
import { bootstrap } from "./bootstrapper.js";
import { EOSAuth } from "./egs-auth/index.js";
import { RocketLeague } from "./rl/index.js";

async function initializeAuth() {
  const auth = new EOSAuth();

  auth.onRefreshTokenUpdate((refresh) => {
    fs.writeFileSync(
      CREDENTIAL_FILE,
      JSON.stringify({
        refreshToken: refresh,
      }),
      {
        encoding: "utf-8",
      },
    );
  });

  if (fs.existsSync(CREDENTIAL_FILE)) {
    console.log("Using refresh token from credential file");
    const current = fs.readFileSync(CREDENTIAL_FILE, { encoding: "utf-8" });
    const json = JSON.parse(current);
    if (typeof json.refreshToken === "string") {
      await auth.refresh(json.refreshToken);
    }
  } else {
    console.log("Auth bootstrap required");
  }

  setInterval(
    () => {
      if (auth.exists()) auth.refresh();
    },
    60 * 60 * 1000,
  );

  return auth;
}

const CREDENTIAL_FILE = "./saved-credentials.json";
const PORT = 3000;

const auth = await initializeAuth();
const rocketLeague = new RocketLeague();

const app = new Hono();
app.get("/bootstrap", () => bootstrap(auth));
app.get("/skill", async (c) => {
  const playerId = c.req.query("playerId");
  if (playerId === undefined)
    return c.json({ error: "No player id specified" });

  try {
    const skill = await rocketLeague.getPlayerSkill(auth, playerId);
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
