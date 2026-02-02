$InstallerPath = "C:\Users\이후\Downloads\postgresql-17.7-2-windows-x64.exe"
$TempDir = "C:\pgtemp"

# 임시 디렉토리 생성 (이미 존재하면 무시)
if (!(Test-Path -Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir | Out-Null
}

# 환경 변수 임시 변경
$env:TEMP = $TempDir
$env:TMP = $TempDir

Write-Host "Running Installer with TEMP set to $TempDir..."
Start-Process -FilePath $InstallerPath -Wait

Write-Host "Installation process finished."
