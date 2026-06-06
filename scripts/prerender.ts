import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderPage } from "../src/app.js";
import type { TelecomInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/route-reliability.json", "utf8")) as TelecomInput;
mkdirSync("site", { recursive: true });
writeFileSync("site/index.html", renderPage(input));
writeFileSync("site/robots.txt", "User-agent: *\nAllow: /\n");

