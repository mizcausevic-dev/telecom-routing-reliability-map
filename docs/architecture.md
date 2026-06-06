# Architecture

Telecom Routing Reliability Map is intentionally small but multi-language:

- `fixtures/route-reliability.json` stores synthetic route posture.
- `src/index.ts` scores route reliability risk and produces board-readable findings.
- `src/app.ts` renders the public static surface and local Express route.
- `go/main.go` provides a compiled route reliability CLI.
- `elixir/reliability_signal.exs` extracts degraded-route signals with a telecom-friendly concurrency language lane.

Production use would require authenticated ingest, PII redaction, route-topology access controls, and a separation between internal telemetry and public executive summaries.

