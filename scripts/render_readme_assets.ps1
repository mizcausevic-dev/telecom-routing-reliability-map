$ErrorActionPreference = "Stop"

$screenshots = @(
  @{
    Path = "screenshots/01-overview-proof.png"
    Title = "Carrier routing risk becomes visible before the next outage."
    Subtitle = "Handoffs, p95 latency, packet loss, reroutes, and SLA breach minutes resolve into one telecom reliability map."
    Bullets = @(
      "SIP-NA-EAST is critical before high-volume campaign traffic resumes.",
      "Carrier failover and queue-drain proof stay attached to route owners.",
      "Elixir, Go, and TypeScript create a clear telecom language signal."
    )
  },
  @{
    Path = "screenshots/02-ledger-proof.png"
    Title = "Route posture stays readable across voice, SMS, and edge lanes."
    Subtitle = "The same synthetic fixture powers tests, CLI output, and the public decision surface."
    Bullets = @(
      "Packet loss and reroute events are scored before they become customer-visible incidents.",
      "SLA breach minutes become executive evidence, not buried network noise.",
      "Carrier changes have one owner, one route, and one next action."
    )
  }
)

Add-Type -AssemblyName System.Drawing

foreach ($shot in $screenshots) {
  $bitmap = New-Object System.Drawing.Bitmap 1600, 900
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::FromArgb(5, 8, 18))

  $panelBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Rectangle 0, 0, 1600, 900),
    [System.Drawing.Color]::FromArgb(13, 23, 39),
    [System.Drawing.Color]::FromArgb(8, 11, 24),
    22
  )
  $graphics.FillRectangle($panelBrush, 70, 70, 1460, 760)

  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(37, 215, 239)), 3
  $graphics.DrawRectangle($pen, 70, 70, 1460, 760)

  $brandFont = New-Object System.Drawing.Font "Segoe UI", 22, ([System.Drawing.FontStyle]::Bold)
  $titleFont = New-Object System.Drawing.Font "Georgia", 36, ([System.Drawing.FontStyle]::Bold)
  $bodyFont = New-Object System.Drawing.Font "Segoe UI", 23, ([System.Drawing.FontStyle]::Regular)
  $smallFont = New-Object System.Drawing.Font "Consolas", 16, ([System.Drawing.FontStyle]::Regular)
  $brandBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(37, 215, 239))
  $titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(244, 241, 234))
  $bodyBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 196, 215))
  $violetBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 124, 255))

  $graphics.DrawString("Telecom Routing Reliability Map", $brandFont, $brandBrush, 130, 120)
  $graphics.DrawString($shot.Title, $titleFont, $titleBrush, (New-Object System.Drawing.RectangleF 130, 185, 1180, 120))
  $graphics.DrawString($shot.Subtitle, $bodyFont, $bodyBrush, (New-Object System.Drawing.RectangleF 130, 320, 1120, 120))

  $y = 470
  foreach ($bullet in $shot.Bullets) {
    $graphics.FillEllipse($violetBrush, 132, ($y + 10), 10, 10)
    $graphics.DrawString($bullet, $bodyFont, $titleBrush, (New-Object System.Drawing.RectangleF 160, $y, 1140, 86))
    $y += 100
  }

  $graphics.DrawString("Synthetic proof render for README packaging.", $smallFont, $bodyBrush, 130, 775)
  $bitmap.Save((Join-Path (Get-Location) $shot.Path), [System.Drawing.Imaging.ImageFormat]::Png)

  $graphics.Dispose()
  $bitmap.Dispose()
}

