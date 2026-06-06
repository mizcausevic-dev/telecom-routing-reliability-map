package main

import "testing"

func TestScoreCriticalRoute(t *testing.T) {
	risk := score(Route{RouteID: "SIP-NA-EAST", HandoffCount: 7, LatencyMsP95: 188, PacketLossPct: 1.8, RerouteEvents: 14, SLABreachMinutes: 42})
	if risk < 90 {
		t.Fatalf("expected critical risk, got %.2f", risk)
	}
}
