import { parse, stringify } from "yaml";

import { z } from "zod";

const pathSchema = z.object({
  label: z.string(),
  path: z.string(),
  baseUrl: z.string().url(),
});

const configSchema = z.object({
  suffix: z.string().default(""),
  paths: z.array(pathSchema),
});

type Config = z.infer<typeof configSchema>;

const defaultConfig: Config = {
  suffix: "🦊",
  paths: [
    {
      label: "radarr",
      path: "/radarr/*",
      baseUrl: "http://radarr:7878",
    },
    {
      label: "sonarr",
      path: "/sonarr/*",
      baseUrl: "http://sonarr:8989",
    },
  ],
};

export async function getsertConfig() {
  const configPath =
    process.env.NODE_ENV !== "production"
      ? "./config/config.yml"
      : "/config/config.yml";
  console.log("🦊 Config path:", configPath);

  let config: Config;
  const file = Bun.file(configPath);

  const exists = await file.exists();
  if (exists) {
    const text = await file.text();
    console.log("🦊 Loading config file:");
    console.log(text);
    const json = parse(text);
    const maybeConfig = configSchema.safeParse(json);
    if (maybeConfig.success) {
      config = maybeConfig.data;
    } else {
      console.error("🦊 Invalid config file:");
      console.error(maybeConfig.error.errors);
      process.exit(1);
    }
  } else {
    console.log("🦊 Config file not found, creating one with default values.");
    await Bun.write(configPath, stringify(defaultConfig));
    config = defaultConfig;
  }

  return config;
}
