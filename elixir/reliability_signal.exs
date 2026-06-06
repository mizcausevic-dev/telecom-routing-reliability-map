path = System.argv() |> List.first() || "fixtures/route-reliability.json"
content = File.read!(path)

routes = Regex.scan(~r/"routeId"\s*:\s*"([^"]+)"/, content)
loss_values =
  Regex.scan(~r/"packetLossPct"\s*:\s*([0-9.]+)/, content)
  |> Enum.map(fn [_, value] -> String.to_float(value) end)

max_loss = Enum.max(loss_values)

IO.puts("route_count=#{length(routes)}")
IO.puts("max_packet_loss=#{max_loss}")

if max_loss < 1.0 do
  raise "expected at least one degraded telecom route"
end

