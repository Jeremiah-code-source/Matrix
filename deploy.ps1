# PowerShell script for easy deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Birthday Video Backend Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
$currentDir = Get-Location
if ($currentDir.Path -notlike "*Matrix*") {
    Write-Host "ERROR: Please run this from the Matrix directory" -ForegroundColor Red
    Write-Host "Current directory: $currentDir" -ForegroundColor Yellow
    exit
}

Write-Host "[1/4] Checking Vercel login status..." -ForegroundColor Green
$whoami = vercel whoami 2>&1
if ($whoami -match "not logged in") {
    Write-Host "  Please login to Vercel in the browser that will open..." -ForegroundColor Yellow
    vercel login
}
Write-Host "  ? Logged in" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Deploying to Vercel..." -ForegroundColor Green
Write-Host "  This may take 30-60 seconds..." -ForegroundColor Yellow
Write-Host ""

# Deploy and capture output
$deployment = vercel --prod --yes 2>&1 | Tee-Object -Variable deployOutput

Write-Host ""
Write-Host "[3/4] Extracting deployment URL..." -ForegroundColor Green

# Extract URL from output
$url = ""
foreach ($line in $deployOutput) {
    if ($line -match "https://.*\.vercel\.app") {
        $url = $matches[0]
        break
    }
}

if ($url -eq "") {
    Write-Host "  ? Could not automatically extract URL" -ForegroundColor Yellow
    Write-Host "  Please copy the Production URL from above" -ForegroundColor Yellow
    Write-Host ""
    $url = Read-Host "  Paste your Vercel URL here"
}

Write-Host "  ? Backend URL: $url" -ForegroundColor Green
Write-Host ""

Write-Host "[4/4] Updating config.js..." -ForegroundColor Green

# Update config.js
$configPath = "config.js"
$configContent = Get-Content $configPath -Raw

$configContent = $configContent -replace "USE_BACKEND: false", "USE_BACKEND: true"
$configContent = $configContent -replace "BACKEND_URL: '[^']*'", "BACKEND_URL: '$url'"

Set-Content -Path $configPath -Value $configContent

Write-Host "  ? Config updated" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ? DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $url" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test your backend: Open $url in browser" -ForegroundColor White
Write-Host "   Should show: {`"status`":`"Server is running`"}" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Commit and push to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m `"Enable backend`"" -ForegroundColor Gray
Write-Host "   git push origin master" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Your site will auto-deploy!" -ForegroundColor White
Write-Host ""
Write-Host "4. Test cross-device:" -ForegroundColor White
Write-Host "   - Upload video on Device A" -ForegroundColor Gray
Write-Host "   - Scan QR on Device B" -ForegroundColor Gray
Write-Host "   - Video should appear! ?" -ForegroundColor Gray
Write-Host ""

# Open browser to test
$testUrl = "$url"
Write-Host "Opening backend test page..." -ForegroundColor Yellow
Start-Process $testUrl

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
