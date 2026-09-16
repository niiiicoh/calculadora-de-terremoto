import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
const root = resolve("out");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};
createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const relative =
      prefix && path.startsWith(prefix + "/")
        ? path.slice(prefix.length)
        : path;
    let file = resolve(root, "." + relative);
    if (file !== root && !file.startsWith(root + sep))
      throw new Error("Invalid path");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    response.setHeader(
      "Content-Type",
      types[extname(file)] || "application/octet-stream",
    );
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html" });
    response.end(
      await readFile(resolve(root, "404.html")).catch(() => "Not found"),
    );
  }
}).listen(Number(process.env.PORT || 3017), "127.0.0.1", () =>
  console.log("Static preview ready"),
);
