import { Elysia } from "elysia";
import { getsertConfig } from "./config";

async function main() {
  const app = new Elysia();
  const { paths, suffix } = await getsertConfig();

  for (const { label, path, baseUrl } of paths) {
    app.all(path, async ({ body, path, request, set }) => {
      console.log(`[${label}] incoming: ${path}`);
      if (isBodyWithName(body)) {
        console.log(`[${label}] name: ${body.name}`);
        body.name = body.name.replace(" (Prowlarr)", suffix);
      }
      const res = await fetch(`${baseUrl}${path}`, {
        method: request.method,
        headers: request.headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      const version = res.headers.get("X-Application-Version");
      if (version) {
        set.headers["X-Application-Version"] = version;
      }
      console.log(`[${label}] done: ${path}`);
      return data;
    });
    console.log(`🦊 ${label} is proxied at ${path} (${baseUrl})`);
  }

  app.listen(3000);
  console.log(
    `🦊 prowlarr-proxy is running at ${app.server?.hostname}:${app.server?.port}`
  );
}

void main();

function isBodyWithName(body: unknown): body is { name: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    typeof (body as { name: unknown }).name === "string"
  );
}

process.on("SIGINT", () => {
  console.log("🦊 good bye");
  process.exit();
});
