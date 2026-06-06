import { describe, expect, it } from "vitest";
import fixture from "../fixtures/route-reliability.json" with { type: "json" };
import { buildReliabilitySummary, scoreRoute, type TelecomInput } from "../src/index.js";

describe("telecom routing reliability map", () => {
  it("scores route pressure into board-readable posture", () => {
    const finding = scoreRoute((fixture as TelecomInput).routes[0]);
    expect(finding.posture).toBe("critical");
    expect(finding.reliabilityRiskScore).toBeGreaterThan(90);
  });

  it("summarizes critical routes and recommendation", () => {
    const summary = buildReliabilitySummary(fixture as TelecomInput);
    expect(summary.criticalRoutes).toBe(1);
    expect(summary.findings[0].routeId).toBe("SIP-NA-EAST");
    expect(summary.primaryRecommendation).toContain("secondary carrier");
  });
});

