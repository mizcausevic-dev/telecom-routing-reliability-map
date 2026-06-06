import { readFileSync } from "node:fs";
import { buildReliabilitySummary, type TelecomInput } from "../src/index.js";

const input = JSON.parse(readFileSync("fixtures/route-reliability.json", "utf8")) as TelecomInput;
const summary = buildReliabilitySummary(input);

console.log(`network=${summary.network}`);
console.log(`risk=${summary.aggregateReliabilityRisk}`);
console.log(`critical=${summary.criticalRoutes}`);
console.log(`recommendation=${summary.primaryRecommendation}`);

