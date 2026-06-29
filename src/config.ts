import * as fs from "node:fs";

type Configuration = {
  password: string;
  port: number;
};

const DEFAULT_PORT = 3000;

const getOrThrow = (obj: any, key: string) => {
  const val = obj[key];
  if (val === undefined)
    throw new Error(`couldnt find property "${key}" of ${JSON.stringify(obj)}`);
  return val;
};

export function loadConfig(): Configuration {
  const configPath = "./config.json";
  if (!fs.existsSync(configPath)) {
    throw new Error("couldnt find config file");
  }

  const existingConfig = JSON.parse(
    fs.readFileSync(configPath, { encoding: "utf-8" }),
  );

  return {
    password: getOrThrow(existingConfig, "password"),
    port: existingConfig.port || DEFAULT_PORT,
  };
}
