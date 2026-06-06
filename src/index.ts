export interface TelecomRoute {
  routeId: string;
  carrier: string;
  handoffCount: number;
  latencyMsP95: number;
  packetLossPct: number;
  rerouteEvents: number;
  slaBreachMinutes: number;
  owner: string;
  nextAction: string;
}

export interface TelecomInput {
  asOf: string;
  network: string;
  routes: TelecomRoute[];
}

export interface RouteFinding extends TelecomRoute {
  reliabilityRiskScore: number;
  posture: "stable" | "watch" | "critical";
  boardNarrative: string;
}

export interface ReliabilitySummary {
  asOf: string;
  network: string;
  aggregateReliabilityRisk: number;
  criticalRoutes: number;
  primaryRecommendation: string;
  findings: RouteFinding[];
}

const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const round = (value: number): number => Math.round(value * 100) / 100;

export function scoreRoute(route: TelecomRoute): RouteFinding {
  const reliabilityRiskScore = round(
    clamp(
      route.handoffCount * 5 +
        route.latencyMsP95 / 3.2 +
        route.packetLossPct * 11 +
        route.rerouteEvents * 2.2 +
        route.slaBreachMinutes * 0.75
    )
  );
  const posture = reliabilityRiskScore >= 72 ? "critical" : reliabilityRiskScore >= 40 ? "watch" : "stable";
  const boardNarrative =
    posture === "critical"
      ? `${route.routeId} needs carrier failover or route containment before high-volume traffic resumes.`
      : posture === "watch"
        ? `${route.routeId} can keep serving traffic with visible queue-drain and SLA evidence.`
        : `${route.routeId} is stable with current synthetic probe evidence.`;

  return { ...route, reliabilityRiskScore, posture, boardNarrative };
}

export function buildReliabilitySummary(input: TelecomInput): ReliabilitySummary {
  if (!input.routes.length) {
    throw new Error("At least one telecom route is required.");
  }
  const findings = input.routes.map(scoreRoute).sort((a, b) => b.reliabilityRiskScore - a.reliabilityRiskScore);
  const aggregateReliabilityRisk = round(
    findings.reduce((sum, route) => sum + route.reliabilityRiskScore, 0) / findings.length
  );
  const criticalRoutes = findings.filter((route) => route.posture === "critical").length;
  const top = findings[0];
  return {
    asOf: input.asOf,
    network: input.network,
    aggregateReliabilityRisk,
    criticalRoutes,
    primaryRecommendation: `${top.routeId}: ${top.nextAction}`,
    findings
  };
}

