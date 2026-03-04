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
- 등록
```vue

<HtmlEditor v-model="mailTemplatemailtemplateContent" />
```

- 상세
```vue
<template>
    <div
    class="news-content-area text-lg leading-relaxed text-foreground/90"
    v-html="newsData.newsContent"
    ></div>
</template>

<style scoped>
.news-content-area :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  margin: 2rem 0;
}
.news-content-area :deep(p) {
  margin-bottom: 0.75rem;
  word-break: keep-all;
}
/* 정렬 */
.news-content-area :deep(.ql-align-center) {
  text-align: center;
}
.news-content-area :deep(.ql-align-right) {
  text-align: right;
}
.news-content-area :deep(.ql-align-justify) {
  text-align: justify;
}
/* 간격 */
.news-content-area :deep(.ql-size-small) {
  font-size: 0.75em;
}
.news-content-area :deep(.ql-size-large) {
  font-size: 1.5em;
}
.news-content-area :deep(.ql-size-huge) {
  font-size: 2.5em;
}
h1 {
  font-family: 'Pretendard', sans-serif;
  word-break: keep-all;
}
p {
  word-break: break-all;
}
</style>
```