# Update Static Inscriptions Fallback
# Fetches latest inscriptions from Oracle API and saves to public/data/inscriptions.json
# This ensures the proverbs page works even when the Oracle API is offline

param(
    [string]$ApiUrl = "http://localhost:3003"
)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Update Static Inscriptions Fallback" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$outputPath = "public\data\inscriptions.json"

# Ensure directory exists
$outputDir = Split-Path -Parent $outputPath
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "✅ Created directory: $outputDir" -ForegroundColor Green
}

Write-Host "Fetching inscriptions from: $ApiUrl/api/inscriptions" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/api/inscriptions" -Method Get -TimeoutSec 10
    
    # Convert to JSON with proper formatting
    $json = $response | ConvertTo-Json -Depth 10
    
    # Save to file
    $json | Out-File -FilePath $outputPath -Encoding utf8 -NoNewline
    
    Write-Host "✅ Successfully updated $outputPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Summary:" -ForegroundColor Cyan
    Write-Host "  Total inscriptions: $($response.total)" -ForegroundColor Gray
    Write-Host "  Inscriptions array: $($response.inscriptions.Count) items" -ForegroundColor Gray
    
    if ($response.countByAct) {
        Write-Host "  Acts with inscriptions:" -ForegroundColor Gray
        $response.countByAct.PSObject.Properties | ForEach-Object {
            Write-Host "    Act $($_.Name): $($_.Value) inscriptions" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Review the updated file: $outputPath" -ForegroundColor White
    Write-Host "  2. Commit to git: git add $outputPath" -ForegroundColor White
    Write-Host "  3. Commit: git commit -m 'Update static inscriptions fallback'" -ForegroundColor White
    Write-Host "  4. Push: git push" -ForegroundColor White
    
} catch {
    Write-Host ""
    Write-Host "❌ Failed to fetch inscriptions" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "  - Oracle API is running on $ApiUrl" -ForegroundColor White
    Write-Host "  - The API endpoint is accessible" -ForegroundColor White
    Write-Host ""
    exit 1
}

