# 원팬요리의 모든것 — 작업 안내

여러 요리 인플루언서의 원팬 레시피를 한곳에 모은 앱. '냉장고를 맡겨줘'(저장소 onepan-fridge)를 바탕으로 만들었고, 그 앱은 건드리지 않는다.

## 파일
- dev/app-source.html : 앱 원본. 레시피(R), 인플루언서(CR), 재료 묶기, 손질법, 사진 목록이 모두 들어 있다.
- dev/build.sh : `bash dev/build.sh <버전번호> <버전이름>` (예: 2 1.1). index.html, onepan-all.apk, install.html을 다시 만든다.
- dev/android : 안드로이드 껍데기(패키지 com.onepan.all). 기존 앱과 따로 설치된다.


## 인플루언서 넣는 법
- app-source.html의 `const CR = [...]`에 한 명씩 넣는다: id, n(이름), d(한 줄 소개), nat(나라), col(동그라미 색), ch(채널 [이름, 주소] 목록).
- 레시피에 `"c": "<인플루언서 id>"`를 붙이면 그 사람 레시피가 된다. 없으면 '출처 정리 중'으로 보인다.
- 지금은 레시피와 인플루언서가 비어 있다(2026-11-12에 기존 레시피·메뉴 사진 모두 삭제). 협업한 인플루언서 레시피만 새로 넣는다.
- 협업이 확정된 인플루언서는 채널(인스타그램·유튜브·블로그 등)을 ch에 더 넣는다.

## 버전
- 1.0 (버전번호 1): 첫 출시. 버전번호는 매번 1씩 올린다. 서명 키는 uber-apk-signer 기본 디버그 키를 계속 쓴다.

## 올리기
- 깃허브 저장소: lkj56497/onepan-everthing. 사이트는 gh-pages 브랜치에서 나온다.
- 고친 뒤 `git push origin main` 과 `git push origin main:gh-pages` 를 둘 다 한다. 1~3분 뒤 https://lkj56497.github.io/onepan-everthing/install.html 에서 확인.
