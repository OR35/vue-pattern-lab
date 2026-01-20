# ComnPagination

공통 페이징 컴포넌트

## Purpose
- 서버 사이드 페이징 UI 통합
- 페이지/사이즈 변경 이벤트 표준화

## Props
- page
- size
- total

## Emits
- change(page, size)

## Usage
```vue

const state = reactive({
  pageInfo: {
    sensorNm: '',
    sensorTypeCd: '',
    useYn: '',
    curPage: 1,
    totalPage: 0,
    totalCount: 0,
    itemsPerPage: 6,
  },
});

<ComnPagination
    :current-page="state.pageInfo.curPage"
    :total-pages="state.pageInfo.totalPage"
    :total-count="state.pageInfo.totalCount"
    @handle-click-page-move="pageMove"
    @handle-click-change-per-page="changePerPage"
/>

const pageMove = page => {
  pageInfo.value.currentPage = page;
  getList();
};

const changePerPage = itemsPerPage => {
  pageInfo.value.itemsPerPage = itemsPerPage;
  pageInfo.value.currentPage = 1;
  getList();
};
```

