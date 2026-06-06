import express from "express";
import { readFileSync } from "node:fs";
import { buildReliabilitySummary, type TelecomInput } from "./index.js";

export function renderPage(input: TelecomInput): string {
  const summary = buildReliabilitySummary(input);
  const rows = summary.findings
    .map(
      (route) => `<article class="route ${route.posture}"><div><span>${route.posture}</span><h3>${route.routeId}</h3><p>${route.boardNarrative}</p></div><dl><div><dt>Risk</dt><dd>${route.reliabilityRiskScore}</dd></div><div><dt>P95 latency</dt><dd>${route.latencyMsP95}ms</dd></div><div><dt>Loss</dt><dd>${route.packetLossPct}%</dd></div></dl><strong>${route.nextAction}</strong></article>`
    )
    .join("");

  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>Telecom Routing Reliability Map</title><meta name="description" content="Telecom routing reliability map for carrier handoff drift, packet loss, latency pressure, and escalation posture."/><style>:root{--bg:#050812;--panel:#0d1727;--text:#f4f1ea;--muted:#a8b3c7;--cyan:#25d7ef;--violet:#b47cff;--line:rgba(37,215,239,.24)}*{box-sizing:border-box}body{margin:0;font-family:"Segoe UI",sans-serif;color:var(--text);background:radial-gradient(circle at 86% 10%,rgba(180,124,255,.18),transparent 30rem),radial-gradient(circle at 12% 20%,rgba(37,215,239,.14),transparent 32rem),var(--bg)}main{width:min(1180px,calc(100% - 40px));margin:0 auto;padding:56px 0}.hero{border:1px solid var(--line);border-radius:28px;padding:clamp(28px,5vw,64px);background:linear-gradient(135deg,rgba(13,23,39,.96),rgba(8,11,24,.92))}.kicker{color:var(--cyan);font-family:Consolas,monospace;font-size:.78rem;letter-spacing:.18em;text-transform:uppercase}h1{max-width:960px;margin:18px 0;font-size:clamp(3rem,8vw,6.7rem);line-height:.92;letter-spacing:-.075em}.lede{max-width:760px;color:var(--muted);font-size:1.25rem;line-height:1.7}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:34px}.metric,.route{background:rgba(13,23,39,.9);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:22px}.metric small,dt{color:var(--muted);text-transform:uppercase;letter-spacing:.12em;font-size:.75rem}.metric b{display:block;margin-top:10px;font-size:2rem}.routes{display:grid;gap:16px;margin-top:22px}.route{display:grid;grid-template-columns:1.2fr 1fr;gap:24px;align-items:start}.route span{color:var(--cyan);font-family:Consolas,monospace;text-transform:uppercase;letter-spacing:.14em;font-size:.76rem}.route.critical{border-color:rgba(255,107,135,.42)}.route.watch{border-color:rgba(255,209,102,.38)}h3{font-size:1.65rem;margin:12px 0 10px}p{color:var(--muted);line-height:1.6}dl{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0}dd{margin:5px 0 0;font-size:1.25rem;font-weight:800}strong{grid-column:1/-1;color:var(--text)}footer{margin-top:34px;color:var(--muted);font-family:Consolas,monospace}@media(max-width:900px){.metrics,.route,dl{grid-template-columns:1fr}}</style></head><body><main><section class="hero"><div class="kicker">Telecom / Elixir + Go</div><h1>Carrier routing risk becomes visible before the next outage.</h1><p class="lede">Telecom Routing Reliability Map turns carrier handoff drift, p95 latency, packet loss, reroutes, and SLA breach minutes into one board-readable reliability map.</p><div class="metrics"><div class="metric"><small>Aggregate risk</small><b>${summary.aggregateReliabilityRisk}</b></div><div class="metric"><small>Critical routes</small><b>${summary.criticalRoutes}</b></div><div class="metric"><small>Routes tracked</small><b>${summary.findings.length}</b></div><div class="metric"><small>Top route</small><b>${summary.findings[0].routeId}</b></div></div></section><section class="routes">${rows}</section><footer>Primary recommendation: ${summary.primaryRecommendation}</footer></main></body></html>`;
}

export function createApp() {
  const app = express();
  const input = JSON.parse(readFileSync("fixtures/route-reliability.json", "utf8")) as TelecomInput;
  app.get("/", (_req, res) => res.type("html").send(renderPage(input)));
  app.get("/api/routes", (_req, res) => res.json(buildReliabilitySummary(input)));
  return app;
}

if (process.argv[1]?.endsWith("app.js")) {
  createApp().listen(4173, () => console.log("telecom-routing-reliability-map listening on http://localhost:4173"));
}

