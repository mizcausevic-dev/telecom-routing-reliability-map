import { readFileSync } from "node:fs";

const html = readFileSync("site/index.html", "utf8");
const markers = ["Telecom Routing Reliability Map", "Carrier routing risk becomes visible", "SIP-NA-EAST"];
const missing = markers.filter((marker) => !html.includes(marker));

if (missing.length > 0) {
  throw new Error(`Missing static markers: ${missing.join(", ")}`);
}

console.log("smoke ok");

