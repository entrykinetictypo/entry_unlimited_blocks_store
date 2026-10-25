# Chrome Web Store 심사 준비 점검 (v1.14.8)

이 저장소는 **콘솔을 편하게**의 Chrome 웹 스토어 전용 버전입니다. 원본 저장소는 수정하지 않습니다.

## 2026-10-20 변경 사항

- 심사 위험이 큰 비공식 블록 8종을 웹 스토어 버전에서 제외했습니다: `etc.js`, `nyang.js`, `magnet.js`, `mint.js`, `special.js`, `npi.js`, `express.js`, `block20.js`.
- 위 8종은 `popup.js`, `content.js`, `unofficial/public-runtime.js`의 로딩 목록에서도 제거했습니다.
- 남은 선택형 비공식 블록 10종: `dummy.js`, `strong.js`, `common.js`, `newblock.js`, `right_click.js`, `kris.js`, `tecsu.js`, `video.js`, `fileio.js`, `entsave.js`.
- `manifest.json` 버전을 **1.14.7**로 올렸습니다.
- 언차티드, Groq 공유 키, 사용자 지정 커스텀 코드 실행 기능은 이 스토어 저장소에 포함되지 않습니다.

## 남은 검증 항목

- `chrome://extensions`에서 압축해제 로드 후 엔트리 작업 화면과 공개 작품에서 실행 테스트.
- 남은 10종의 원격 코드·외부 API·DOM 삽입·권한 사용 및 저작권/재배포 조건 확인.
- Chrome 웹 스토어 개인정보처리, 단일 목적, 권한 사용 설명 및 스크린샷 준비.
- Chrome 웹 스토어 승인은 검증 전 보장할 수 없습니다.

> 위 8종의 제외는 악성 코드 판정이 아닙니다. 심사 통과 가능성을 높이기 위한 보수적 조치입니다. 원본 저장소는 변경하지 않았습니다.

## v1.14.8 기본 설정

- 함수 추가: 초기 **금지** (`allowEntryFunctionCreate`가 저장되지 않았을 때)
- 변수 추가: 초기 **금지** (`allowEntryVariableCreate`가 저장되지 않았을 때)
- 새 작품 자동 저장: 초기 **금지** (`autoSaveNewProjectAllowed`가 저장되지 않았을 때)
- 기존에 저장된 사용자 선택은 그대로 유지됩니다.
- 생성 차단은 엔트리 UI 명령을 대상으로 하며 악의적인 페이지 코드의 우회를 막는 보안 경계는 아닙니다.
