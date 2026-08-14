Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Faisal\SocietySphere\Application\Frontend\society_admin\src\assets\logo.png"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image file not found at $sourcePath"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

function Save-SquareAppIcon {
    param (
        [string]$destPath,
        [int]$size
    )

    $parentDir = Split-Path -Path $destPath -Parent
    if (-not (Test-Path $parentDir)) {
        New-Item -ItemType Directory -Force -Path $parentDir | Out-Null
    }

    $destBmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Fill white background
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($brush, 0, 0, $size, $size)
    $brush.Dispose()

    # Calculate aspect ratio fitting with 10% padding
    $pad = [int]($size * 0.08)
    $availWidth = $size - (2 * $pad)
    $availHeight = $size - (2 * $pad)

    $scaleW = $availWidth / $srcImage.Width
    $scaleH = $availHeight / $srcImage.Height
    $scale = [Math]::Min($scaleW, $scaleH)

    $drawWidth = [int]($srcImage.Width * $scale)
    $drawHeight = [int]($srcImage.Height * $scale)

    $posX = [int](($size - $drawWidth) / 2)
    $posY = [int](($size - $drawHeight) / 2)

    $g.DrawImage($srcImage, $posX, $posY, $drawWidth, $drawHeight)
    $g.Dispose()

    $destBmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $destBmp.Dispose()

    Write-Host "Successfully generated icon: $destPath ($($size)x$($size))"
}

# 1. Android Mipmap App Icons (Resident App)
$residentResDir = "c:\Faisal\SocietySphere\Application\Frontend\resident_app\android\app\src\main\res"
Save-SquareAppIcon "$residentResDir\mipmap-mdpi\ic_launcher.png" 48
Save-SquareAppIcon "$residentResDir\mipmap-hdpi\ic_launcher.png" 72
Save-SquareAppIcon "$residentResDir\mipmap-xhdpi\ic_launcher.png" 96
Save-SquareAppIcon "$residentResDir\mipmap-xxhdpi\ic_launcher.png" 144
Save-SquareAppIcon "$residentResDir\mipmap-xxxhdpi\ic_launcher.png" 192

# 2. Android Mipmap App Icons (Guard App)
$guardResDir = "c:\Faisal\SocietySphere\Application\Frontend\guard_app\android\app\src\main\res"
Save-SquareAppIcon "$guardResDir\mipmap-mdpi\ic_launcher.png" 48
Save-SquareAppIcon "$guardResDir\mipmap-hdpi\ic_launcher.png" 72
Save-SquareAppIcon "$guardResDir\mipmap-xhdpi\ic_launcher.png" 96
Save-SquareAppIcon "$guardResDir\mipmap-xxhdpi\ic_launcher.png" 144
Save-SquareAppIcon "$guardResDir\mipmap-xxxhdpi\ic_launcher.png" 192

# 3. Web Favicons
Save-SquareAppIcon "c:\Faisal\SocietySphere\Application\Frontend\website\public\favicon.png" 64
Save-SquareAppIcon "c:\Faisal\SocietySphere\Application\Frontend\society_admin\public\favicon.png" 64
Save-SquareAppIcon "c:\Faisal\SocietySphere\Application\Frontend\super_admin\public\favicon.png" 64

$srcImage.Dispose()
Write-Host "All Android App Launcher icons and Web Favicons updated successfully to GateLink!"
