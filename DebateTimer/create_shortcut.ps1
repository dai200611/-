# ============================================================
#  辩论赛计时器 · 创建桌面快捷方式
#  用法：由「创建桌面快捷方式.bat」调用，也可直接右键用 PowerShell 运行
# ============================================================
$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  高校辩论赛计时器 - 快捷方式创建工具" -ForegroundColor Cyan
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""

$dir = $PSScriptRoot
if (-not $dir) { $dir = Split-Path -Parent $MyInvocation.MyCommand.Path }

$candidates = @(
    "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    "C:\Program Files\Google\Chrome\Application\chrome.exe",
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
)
$browser = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $browser) {
    Write-Host "  [X] 没找到 Edge 或 Chrome 浏览器。" -ForegroundColor Red
    Write-Host "      请先安装浏览器，或直接双击 index.html 使用。" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ("  使用浏览器: " + (Split-Path $browser -Leaf)) -ForegroundColor Gray

$lnk = Join-Path ([Environment]::GetFolderPath("Desktop")) "辩论赛计时器.lnk"
$url = "file:///" + (($dir -replace "\\", "/").TrimEnd("/")) + "/index.html"

$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($lnk)
$sc.TargetPath = $browser
$sc.Arguments = '--app="' + $url + '"'
$sc.WorkingDirectory = $dir
$ico = Join-Path $dir "icons\icon.ico"
if (Test-Path $ico) { $sc.IconLocation = $ico + ",0" }
$sc.Description = "高校辩论赛计时器（独立窗口）"
$sc.Save()

if (Test-Path $lnk) {
    Write-Host ""
    Write-Host "  [OK] 快捷方式已创建！" -ForegroundColor Green
    Write-Host ("       位置: " + $lnk) -ForegroundColor Gray
    Write-Host "       双击桌面图标即可打开独立窗口" -ForegroundColor Gray
} else {
    Write-Host "  [X] 创建失败，请尝试手动创建快捷方式。" -ForegroundColor Red
}
Write-Host ""
