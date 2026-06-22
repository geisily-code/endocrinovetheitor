$src = "C:\Users\gusta\OneDrive\Documents\GitHub\lpheiitor\heitor-jaleco-mobile.jpg"
$dst = "C:\Users\gusta\OneDrive\Documents\GitHub\lpheiitor\assets\heitor-jaleco-mobile.png"
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)
$thumb = New-Object System.Drawing.Bitmap -ArgumentList 420,720
$g = [System.Drawing.Graphics]::FromImage($thumb)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.DrawImage($img,0,0,420,720)
$thumb.Save($dst,[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$thumb.Dispose()
$img.Dispose()
Write-Host "Saved $dst"
