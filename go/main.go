package main

import (
	"encoding/json"
	"fmt"
	"math"
	"os"
)

type Route struct {
	RouteID          string  `json:"routeId"`
	HandoffCount     float64 `json:"handoffCount"`
	LatencyMsP95     float64 `json:"latencyMsP95"`
	PacketLossPct    float64 `json:"packetLossPct"`
	RerouteEvents    float64 `json:"rerouteEvents"`
	SLABreachMinutes float64 `json:"slaBreachMinutes"`
}

type Input struct {
	Network string  `json:"network"`
	Routes  []Route `json:"routes"`
}

func score(route Route) float64 {
	value := route.HandoffCount*5 + route.LatencyMsP95/3.2 + route.PacketLossPct*11 + route.RerouteEvents*2.2 + route.SLABreachMinutes*0.75
	if value > 100 {
		value = 100
	}
	if value < 0 {
		value = 0
	}
	return math.Round(value*100) / 100
}

func main() {
	path := "fixtures/route-reliability.json"
	if len(os.Args) > 1 {
		path = os.Args[1]
	}
	data, err := os.ReadFile(path)
	if err != nil {
		panic(err)
	}
	var input Input
	if err := json.Unmarshal(data, &input); err != nil {
		panic(err)
	}
	critical := 0
	total := 0.0
	for _, route := range input.Routes {
		risk := score(route)
		total += risk
		if risk >= 72 {
			critical++
		}
	}
	average := math.Round((total/float64(len(input.Routes)))*100) / 100
	fmt.Printf("network=%s\nroutes=%d\ncritical=%d\naverage_risk=%.2f\n", input.Network, len(input.Routes), critical, average)
}
