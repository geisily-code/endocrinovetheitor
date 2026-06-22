$port = 8000
$prefix = "http://localhost:$port/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Host "Serving $PWD at $prefix"
while ($listener.IsListening) {
  $context = $listener.GetContext()
  try {
    $req = $context.Request
    $raw = $req.Url.AbsolutePath.TrimStart('/')
    if ($raw -eq '') { $raw = 'index.html' }
    $path = Join-Path $PWD $raw
    if (-not (Test-Path $path)) {
      $context.Response.StatusCode = 404
      $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      $context.Response.ContentLength64 = $buffer.Length
      $context.Response.OutputStream.Write($buffer,0,$buffer.Length)
      $context.Response.Close()
      continue
    }
    $bytes = [System.IO.File]::ReadAllBytes($path)
    $ext = [System.IO.Path]::GetExtension($path).ToLower()
    $mime = 'application/octet-stream'
    switch ($ext) {
      '.html' { $mime = 'text/html; charset=utf-8' }
      '.css' { $mime = 'text/css' }
      '.js' { $mime = 'application/javascript' }
      '.png' { $mime = 'image/png' }
      '.jpg' { $mime = 'image/jpeg' }
      '.jpeg' { $mime = 'image/jpeg' }
      '.svg' { $mime = 'image/svg+xml' }
      '.json' { $mime = 'application/json' }
    }
    $context.Response.ContentType = $mime
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes,0,$bytes.Length)
    $context.Response.Close()
  } catch {
    Write-Host "Error: $_"
  }
}
///////////////////