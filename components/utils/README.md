# Utils

## MultiFieldFilter

Vue Composition API 환경에서  
**단일 필드 / 다중 필드에 대한 키워드 필터링을 공통 로직으로 분리한 유틸 함수 모음**입니다.

목록 화면에서 반복되는 검색 로직을 줄이고,  
필터 조건이 늘어나도 코드 복잡도가 증가하지 않도록 설계되었습니다.

### Purpose

- 목록 페이지의 검색 / 필터 로직 공통화
- 필드 수가 늘어나도 v-for + if 지옥 방지
- computed 기반으로 반응형 필터링 유지

---

### Usage

```JavaScript

-- 단일
const filteredTrainDatasets = filterByKeyword(datasets, datasetKeyword, 'datasetNm');

-- 다중
const filteredAgents = filterByKeywords(toRef(props, 'agents'), {
  agentNm: keywordAgentNm,
  activeYn: keywordStatus,
  agentTypeCd: keywordType,
});
```
---

## UseCodeUtils

### Usage

```JavaScript

const { getCodeNm } = useCodeUtils();


-- 코드 목록 List / 조회할 코드 값 전달하여 코드 명 반환
const displayNames = computed(() => {
  return {
    optimizationStatus: getCodeNm(
      props.optimizationStatusList,
      searchInfo.value.optimizationStatus,
    ),
    templateTypCd: getCodeNm(props.templateTypCdList, searchInfo.value.templateTypCd),
    inferencingTypeCd: getCodeNm(props.inferencingTypeCdList, searchInfo.value.inferencingTypeCd),
    shareYn: getCodeNm(props.shareYnCdList, searchInfo.value.shareYn),
  };
});

```
---

## Logger

### Usage

```JavaScript
const handleResponse = (data) => {
  logger.log('API Response 수신');
  logger.debug('Dataset 상세 정보', data);
};
```

```HTML
<button @click="$logger.log('사용자 클릭 이벤트')">로그 남기기</button>
```
---

## SearchStore & SearchReStore

### Usage

1. 목록 페이지: 상태 복원

```JavaScript
const { restore } = useSearchRestore('SENSOR_LIST');

onMounted(async () => {
  // 복구 로직 실행
  await restore({
    pageInfo,
    searchInfoRef,
    extraFields: ['displayRegrNm', 'optimizationStatus'],
  });

  fetchDataList(); // 복구된 정보로 목록 조회
});
```

2. 상세 이동: 상태 저장

```JavaScript
const goToDetail = (id) => {
  const savePayload = {
    searchInfo: { ...searchInfoRef.value.searchInfo },
    pageInfo: { ...pageInfo.value }, // 현재 페이지 및 사이즈 포함
    displayRegrNm: searchInfoRef.value.displayRegrNm,
    optimizationStatus: pageInfo.value.optimizationStatus,
  };

  searchStore.setCondition('SENSOR_LIST', savePayload);
  router.push({ name: 'DetailPage', query: { id } });
};
```
---
