# SOOROOH — Fashion, reimagined with AI

패션 소상공인을 위한 창업 전 AI 콘텐츠 서비스 MVP입니다. Maison Meta의 비주얼 중심 편집 디자인을 참고하되 자체 레이아웃·콘텐츠·이미지로 제작했습니다.

## 실행

Node.js 22 이상에서 별도 패키지 설치 없이 실행합니다.

```sh
node scripts/serve.mjs
```

브라우저에서 http://127.0.0.1:4173 을 엽니다. HTML을 직접 열어도 페이지·필터·대화상자는 동작하지만, 영상 자막 등은 HTTP 환경을 권장합니다.

```sh
node scripts/build.mjs
node scripts/check.mjs
```

`build`는 `data/content.mjs`와 공통 템플릿에서 6개의 독립 HTML을 생성하고, 배포에 필요한 파일만 `dist/`에 복사합니다. `check`는 페이지·링크·이미지·대화상자·내비게이션 순서를 확인합니다. Node.js는 개발 및 빌드에만 사용되며 사이트에는 서버나 외부 라이브러리가 필요하지 않습니다.

## 페이지

| 메뉴 | 파일 | 기능 |
|---|---|---|
| HOME | index.html | 화보 히어로, 대표 작업, 서비스 영역, 기사 |
| ARTICLE | article.html | 대표 기사, 에디토리얼 읽기 대화상자 |
| IMAGE | image.html | 카테고리 필터, 이미지 확대와 프로젝트 설명 |
| VIDEO | video.html | 8초 MP4 재생, 자막, 플레이어 닫을 때 일시 정지 |
| TEXTILE | textile.html | 5개 필터, 패턴·스타일·질감·컬러 상세 |
| FASHION DESIGN | fashion.html | 키보드와 터치를 지원하는 스케치/비주얼 비교 |

공통 스타일은 `css/style.css`, 동작은 `js/main.js`입니다. 메뉴 순서는 HOME → ARTICLE → IMAGE → VIDEO → TEXTILE → FASHION DESIGN을 유지합니다.

## 편집

- 프로젝트·기사 내용: `data/content.mjs`
- 섹션, 메뉴, 공통 헤더·푸터: `scripts/build.mjs`
- 글꼴·컬러·간격·반응형: `css/style.css`
- 이미지: `assets/images/`
- 영상: `assets/videos/quiet-form.mp4`

내용 수정 후 `node scripts/build.mjs`를 실행합니다. 생성된 HTML을 직접 수정하면 다음 빌드에서 덮어쓰므로 생성 원본을 수정하세요. 스크립트가 없어도 페이지의 주요 콘텐츠와 링크는 표시됩니다. 필터·확대·비교·영상 모달에는 JavaScript가 필요합니다.

## GitHub → Vercel 배포

1. 이 폴더를 GitHub 저장소에 올립니다. 저장소·계정은 소유자가 선택합니다.
2. Vercel에서 해당 저장소를 Import합니다.
3. Framework Preset은 **Other**, Build Command는 **node scripts/build.mjs**, Output Directory는 **dist**입니다. `vercel.json`에 저장되어 있습니다.
4. 환경 변수·데이터베이스·API 키는 필요하지 않습니다. 배포 후 6개 메뉴와 모바일 메뉴, 영상 재생을 확인합니다.
5. 도메인 확정 후 필요하면 절대주소의 OG 이미지·canonical·sitemap을 추가합니다. 현재는 미확정 주소를 넣지 않았습니다.

GitHub Pages에서도 `dist/`를 배포할 수 있습니다. 링크와 자산 경로는 모두 상대경로입니다. `dist/`에는 원본 PNG, 개발 스크립트와 문서가 포함되지 않습니다.

현재 결과는 로컬 제작 및 배포 준비 상태입니다. 실제 GitHub 업로드와 Vercel 공개 배포는 아직 수행하지 않았습니다.

## 콘텐츠의 범위

- 사진 2장은 Imagegen 내장 도구로 새로 만든 AI 콘셉트 이미지입니다. 고객 작업·실제품·실제 모델 촬영으로 표시하지 않습니다.
- 텍스타일 4종과 스케치는 코드로 제작한 SVG 디자인 스터디입니다. AI 생성 텍스타일로 표시하지 않습니다.
- 비교 슬라이더는 동일 아이디어의 두 표현을 보여줍니다. 자동 스케치 변환 기능이 아닙니다.
- 영상은 AI 스틸 이미지에 느린 확대를 적용한 무음 MP4 모션 스터디입니다. AI 영상 생성 API 결과가 아닙니다.
- 기사는 자체 작성한 서비스 관점의 에디토리얼입니다. 외부 기사·고객 성과·평가 수치를 만들지 않았습니다.
- 회원가입·로그인·결제·문의 수집·CMS·실제 생성 API는 구현 범위에 포함되지 않습니다.

이미지 프롬프트와 파일 출처는 `ASSETS.md`를 확인하세요. 공개 전 실제 브랜드 소개와 자체 포트폴리오가 준비되면 샘플을 교체할 수 있습니다.
