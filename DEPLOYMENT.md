# 일렉트릭 헬퍼 배포 가이드 (Deployment Guide)

이 문서는 '일렉트릭 헬퍼' 서비스를 실제 인터넷 상에 배포하기 위한 단계별 가이드입니다.

## 1. 사전 준비 (Prerequisites)

- **GitHub 계정**: `hyeonno433-max`
- **Vercel 계정**: 프론트엔드 배포를 위해 필요합니다.
- **Render 계정**: 백엔드와 데이터베이스 배포를 위해 필요합니다.

## 2. GitHub에 코드 업로드 (수정됨)

터미널에서 아래 명령어들을 **한 줄씩 복사해서 실행**해주세요.

### 2-1. 사용자 정보 설정 (최초 1회 필수)

Git이 누가 코드를 작성했는지 알 수 있도록 이메일과 이름을 설정해야 합니다. 본인의 이메일 주소를 입력해주세요.

```bash
git config --global user.email "본인의_이메일_주소@example.com"
git config --global user.name "hyeonno433-max"
```

### 2-2. 원격 저장소 연결 및 푸시

```bash
# 1. 기존에 잘못 연결된 저장소 주소를 수정합니다.
git remote set-url origin https://github.com/hyeonno433-max/electric-helper.git

# 2. 코드를 커밋합니다. (아직 커밋이 안 된 경우)
git add .
git commit -m "First commit"

# 3. GitHub에 코드를 올립니다.
git push -u origin main
```

만약 `git remote set-url` 명령어가 에러가 난다면, 아래 명령어를 대신 사용하세요:

```bash
git remote add origin https://github.com/hyeonno433-max/electric-helper.git
```

## 3. 백엔드 배포 (Render.com 이용)

1. [Render 대시보드](https://dashboard.render.com/) 접속 -> **New +** -> **Blueprint**.
2. GitHub 연결 후 `electric-helper` 저장소 선택.
3. **Branch**가 **`main`**인지 확인! (중요)
4. `render.yaml` 인식 확인 후 **Apply**.
5. 배포 완료 후 백엔드 URL 복사.

## 4. 프론트엔드 배포 (Vercel 이용)

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속 -> **Add New...** -> **Project**.
2. `electric-helper` Import.
3. **Root Directory**: `Edit` -> `frontend` 폴더 선택.
4. **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: 복사한 백엔드 URL 입력.
5. **Deploy**.

---

## 문제 해결

- **"fatal: unable to auto-detect email address"**: 위 2-1번의 `git config` 명령어를 실행하지 않아서 발생하는 오류입니다. 이메일 설정을 먼저 해주세요.
- **"remote origin already exists"**: 이미 저장소 주소가 등록되어 있어서 발생하는 오류입니다. `git remote add` 대신 `git remote set-url`을 사용하면 됩니다.
