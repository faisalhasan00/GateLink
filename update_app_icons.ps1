Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\faiza\.gemini\antigravity-ide\brain\2c090468-4c83-4891-b58b-c683b93df8f7\.user_uploaded\media_1786704397092.png"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image file not found at $sourcePath"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

function Save-ResizedAppIcon {
    param (
        [string]$destPath,
        [int]$width,
        [int]$height
    )

    $parentDir = Split-Path -Path $destPath -Parent
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Force -Path $parentDir | Out-Null
    }

    $destBmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $g.DrawImage($srcImage, 0, 0, $width, $height)
    $g.Dispose()

    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()

    Write-Host "Successfully generated icon: $destPath ($($width)x$($height))"
}

# 1. Android Mipmap App Icons (Resident App)
$residentResDir = "c:\Faisal\SocietySphere\Application\Frontend\resident_app\android\app\src\main\res"
Save-ResizedAppIcon "$residentResDir\mipmap-mdpi\ic_launcher.png" 48 48
Save-ResizedAppIcon "$residentResDir\mipmap-hdpi\ic_launcher.png" 72 72
Save-ResizedAppIcon "$residentResDir\mipmap-xhdpi\ic_launcher.png" 96 96
Save-ResizedAppIcon "$residentResDir\mipmap-xxhdpi\ic_launcher.png" 144 144
Save-ResizedAppIcon "$residentResDir\mipmap-xxxhdpi\ic_launcher.png" 192 192

# 2. Android Mipmap App Icons (Guard App)
$guardResDir = "c:\Faisal\SocietySphere\Application\Frontend\guard_app\android\app\src\main\res"
Save-ResizedAppIcon "$guardResDir\mipmap-mdpi\ic_launcher.png" 48 48
Save-ResizedAppIcon "$guardResDir\mipmap-hdpi\ic_launcher.png" 72 72
Save-ResizedAppIcon "$guardResDir\mipmap-xhdpi\ic_launcher.png" 96 96
Save-ResizedAppIcon "$guardResDir\mipmap-xxhdpi\ic_launcher.png" 144 144
Save-ResizedAppIcon "$guardResDir\mipmap-xxxhdpi\ic_launcher.png" 192 192

# 3. Mobile In-App Assets
Save-ResizedAppIcon "c:\Faisal\SocietySphere\Application\Frontend\resident_app\assets\images\app_logo.png" 512 512
Save-ResizedAppIcon "c:\Faisal\SocietySphere\Application\Frontend\guard_app\assets\images\app_logo.png" 512 512

# 4. Web Favicons
Save-ResizedAppIcon "c:\Faisal\SocietySphere\Application\Frontend\website\public\favicon.png" 64 64
Save-ResizedAppIcon "c:\Faisal\SocietySphere\Application\Frontend\society_admin\public\favicon.png" 64 64
Save-ResizedAppIcon "c:\Faisal\SocietySphere\Application\Frontend\super_admin\public\favicon.png" 64 64

$srcImage.Dispose()
Write-Host "All Android Launcher Mipmaps and App Icons updated with the exact GateLink icon!"
