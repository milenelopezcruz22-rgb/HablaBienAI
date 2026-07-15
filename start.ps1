$root = $PSScriptRoot
Write-Host "=== Iniciando HablaBien AI ===" -ForegroundColor Cyan

# Frontend (Vite)
$fe = Join-Path $root "frontend"
$feJob = Start-Job -ScriptBlock { Set-Location $using:fe; npm run dev }

# Backend Express
$be = Join-Path $root "backend"
$beJob = Start-Job -ScriptBlock { Set-Location $using:be; npm start }

# Backend FastAPI
$faJob = Start-Job -ScriptBlock { Set-Location $using:be; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 }

Write-Host "`nServidores iniciados:" -ForegroundColor Green
Write-Host "  Frontend:  http://localhost:5173"
Write-Host "  Express:   http://localhost:3001"
Write-Host "  FastAPI:   http://localhost:8000"
Write-Host "`nPresiona cualquier tecla para detener todo..." -ForegroundColor Yellow

$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "`nDeteniendo servidores..." -ForegroundColor Yellow
$feJob, $beJob, $faJob | Stop-Job
$feJob, $beJob, $faJob | Remove-Job
Write-Host "Detenido." -ForegroundColor Green