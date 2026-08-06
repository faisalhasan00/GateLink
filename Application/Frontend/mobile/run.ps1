# SocietySphere Flutter Launcher
# Double-click or run this from any PowerShell terminal

$env:PATH = "C:\Program Files\Git\cmd;C:\Users\faiza\develop\flutter\bin;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Windows\System32;" + $env:PATH

Write-Host "Starting SocietySphere App..." -ForegroundColor Cyan
Write-Host "Running on Chrome browser..." -ForegroundColor Green

flutter run -d chrome
