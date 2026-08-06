Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\faiza\.gemini\antigravity-ide\brain\080de355-bc4c-4250-bae3-3b32f5e1dae7\media__1785765193897.png"

if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image file not found at $sourcePath"
    exit 1
}

$srcImage = [System.Drawing.Image]::FromFile($sourcePath)

function Save-ResizedImage {
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

    Write-Host "Successfully generated resized icon: $destPath ($($width)x$($height))"
}

# 1. Android Mipmap App Icons (Resident & Guard)
$residentResDir = "c:\Faisal\SocietySphere\Application\Frontend\resident_app\android\app\src\main\res"
Save-ResizedImage "$residentResDir\mipmap-mdpi\ic_launcher.png" 48 48
Save-ResizedImage "$residentResDir\mipmap-hdpi\ic_launcher.png" 72 72
Save-ResizedImage "$residentResDir\mipmap-xhdpi\ic_launcher.png" 96 96
Save-ResizedImage "$residentResDir\mipmap-xxhdpi\ic_launcher.png" 144 144
Save-ResizedImage "$residentResDir\mipmap-xxxhdpi\ic_launcher.png" 192 192

$guardResDir = "c:\Faisal\SocietySphere\Application\Frontend\guard_app\android\app\src\main\res"
Save-ResizedImage "$guardResDir\mipmap-mdpi\ic_launcher.png" 48 48
Save-ResizedImage "$guardResDir\mipmap-hdpi\ic_launcher.png" 72 72
Save-ResizedImage "$guardResDir\mipmap-xhdpi\ic_launcher.png" 96 96
Save-ResizedImage "$guardResDir\mipmap-xxhdpi\ic_launcher.png" 144 144
Save-ResizedImage "$guardResDir\mipmap-xxxhdpi\ic_launcher.png" 192 192

# 2. Mobile Assets
$residentAssetsDir = "c:\Faisal\SocietySphere\Application\Frontend\resident_app\assets\images"
Save-ResizedImage "$residentAssetsDir\app_logo.png" 512 512
Save-ResizedImage "$residentAssetsDir\logo.png" 512 512

$guardAssetsDir = "c:\Faisal\SocietySphere\Application\Frontend\guard_app\assets\images"
Save-ResizedImage "$guardAssetsDir\app_logo.png" 512 512
Save-ResizedImage "$guardAssetsDir\logo.png" 512 512

# 3. Website Assets
$webPublicDir = "c:\Faisal\SocietySphere\Application\Frontend\website\public"
Save-ResizedImage "$webPublicDir\logo.png" 512 512
Save-ResizedImage "$webPublicDir\favicon.png" 64 64

# 4. Society Admin Assets
$socAdminPublicDir = "c:\Faisal\SocietySphere\Application\Frontend\society_admin\public"
Save-ResizedImage "$socAdminPublicDir\logo.png" 512 512
Save-ResizedImage "$socAdminPublicDir\favicon.png" 64 64

# 5. Super Admin Assets
$superAdminPublicDir = "c:\Faisal\SocietySphere\Application\Frontend\super_admin\public"
Save-ResizedImage "$superAdminPublicDir\logo.png" 512 512
Save-ResizedImage "$superAdminPublicDir\favicon.png" 64 64

$srcImage.Dispose()
Write-Host "All Android, Mobile, and Web App icons updated successfully!"
