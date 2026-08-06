# SocietySphere - Watchman / Security Guard App Launcher
# Run from: C:\Faisal\SocietySphere\Application\mobile

$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.20.8-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\Users\faiza\platform-tools;C:\Program Files\Git\cmd;C:\Users\faiza\develop\flutter\bin;C:\Windows\System32\WindowsPowerShell\v1.0;C:\Windows\System32;" + $env:PATH

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  SocietySphere - STANDALONE WATCHMAN APP     " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Target Device: Samsung SM S721B (RZCY90G2W8H)" -ForegroundColor Green
Write-Host "Launching Standalone Guard App (lib/main_guard.dart)..." -ForegroundColor Yellow
Write-Host ""

flutter run --flavor guard -t lib/main_guard.dart
