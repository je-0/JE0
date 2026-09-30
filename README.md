# CRAFT WELL CREATIVE

[Sleep Well Creatives](https://sleep-well-creatives.com/) 의 스크롤 내러티브 플로우를 Vue로 옮긴 포트폴리오 경험입니다. jQuery 없이 바닐라 JavaScript + Vue 3로 구성되어 있습니다.

## 스택

- **Vue 3** (Composition API, SFC)
- **Vite 8**
- **GSAP 3** + ScrollTrigger
- **Three.js** (셰이더 파티클, 조각 오브젝트, 스크롤 연동 카메라)
- **Lenis** (스무스 스크롤)
- jQuery 없음

## 플로우

1. 로딩 카운터 → **Enter Site**
2. **THE NOTE** 오버레이 (제작 노트)
3. **Play insight** 앰비언트 오디오
4. 00–06 챕터 HUD + 우측 인사이트 네비
5. 히어로 → 크래프트 / 리듬 / 스킬 클락 / 작업 / 노이즈 / 레이어 / 가이드
6. 푸터

원본의 수면 가이드 서사를, 만드는 사람의 작업 리듬 이야기로 바꿨습니다. 메인 컬러는 네이비/블루 대신 **테라코타 `#E36A3A`**.

## 시작하기

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
npm run preview
```

## 커스터마이즈

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 이름, 카피, 작업, 소셜 | `src/data/content.js` |
| 메인 컬러 / 배경 / 서체 | `src/styles/tokens.css` (`--accent`, `--bg`, `--fg`) |
| 3D 장면 | `src/three/Experience.js` |

## 구조

```
src/
  components/          로더, HUD, 노트, 챕터 섹션
  composables/         Lenis, 스크롤 스토리, 오디오
  data/content.js      모든 텍스트
  three/Experience.js  Three.js 씬
  styles/              토큰 / 리셋 / 베이스
```
