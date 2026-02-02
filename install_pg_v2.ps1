$InstallerPath = "C:\pgtemp\postgresql-18.1-2-windows-x64.exe"
$TempDir = "C:\pgtemp"

# 1. 관리자 권한 확인 및 재실행
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Requesting Administrator privileges..."
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

# 2. 임시 디렉토리 생성
if (!(Test-Path -Path $TempDir)) {
    New-Item -ItemType Directory -Path $TempDir | Out-Null
}

# 3. 환경 변수 강제 설정 (현재 프로세스 및 하위 프로세스용)
$env:TEMP = $TempDir
$env:TMP = $TempDir

Write-Host "=========================================="
Write-Host " PostgreSQL Installer Helper (Robust)"
Write-Host "=========================================="
Write-Host "TEMP setup to: $env:TEMP"
Write-Host "Installer: $InstallerPath"
Write-Host "Launching installer... Please wait."

# 4. 설치 프로그램 실행
# -Wait: 설치가 끝날 때까지 대기
# -PassThru: 프로세스 객체 반환 (디버깅용)
$proc = Start-Process -FilePath $InstallerPath -Wait -PassThru

if ($proc.ExitCode -eq 0) {
    Write-Host "Installation completed successfully."
}
else {
    Write-Host "Installation finished with exit code: $($proc.ExitCode)"
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
