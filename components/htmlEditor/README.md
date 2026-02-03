# [HtmlEditor](./HtmlEditor.vue)

공통 HTML 편집 컴포넌트

## Purpose
- 관리자 화면에서 HTML 콘텐츠 입력
- 외부 에디터 의존성 최소화
- 폼 상태와의 분리

## Design
- uncontrolled 방식
- 내부 상태는 editor가 관리
- 외부에서는 get/set API만 노출

## Exposed API
- setContent(html)
- getContent()
- reset()

## Usage
```vue

<HtmlEditor v-model="mailTemplatemailtemplateContent" />
```