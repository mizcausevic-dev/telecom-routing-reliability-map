import { readFileSync } from "node:fs";
import { buildReliabilitySummary, type TelecomInput } from "./index.js";

const file = process.argv[2] ?? "fixtures/route-reliability.json";
const input = JSON.parse(readFileSync(file, "utf8")) as TelecomInput;
console.log(JSON.stringify(buildReliabilitySummary(input), null, 2));

