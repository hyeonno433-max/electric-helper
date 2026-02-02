$env:PGUSER = "postgres"
$env:PGPASSWORD = "postgres"
$env:PATH = "$env:PATH;C:\Program Files\PostgreSQL\17\bin;C:\Program Files\PostgreSQL\16\bin;C:\Program Files\PostgreSQL\15\bin" 

# psql로 데이터베이스 생성 시도
# 먼저 postgres DB에 접속해서 생성
Write-Host "Creating database 'electric_helper'..."
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -h localhost -U postgres -d postgres -c "CREATE DATABASE electric_helper;"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database created successfully."
}
else {
    Write-Host "Database creation failed or already exists. (Exit Code: $LASTEXITCODE)"
    # 버전 문제로 경로가 다를 수 있으니 일반 psql로도 시도
    psql -h localhost -U postgres -d postgres -c "CREATE DATABASE electric_helper;"
}
