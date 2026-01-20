# Utils

## MultiFieldFilter

Vue Composition API 환경에서  
**단일 필드 / 다중 필드에 대한 키워드 필터링을 공통 로직으로 분리한 유틸 함수 모음**입니다.

목록 화면에서 반복되는 검색 로직을 줄이고,  
필터 조건이 늘어나도 코드 복잡도가 증가하지 않도록 설계되었습니다.

---

### 🎯 Purpose

- 목록 페이지의 검색 / 필터 로직 공통화
- 필드 수가 늘어나도 v-for + if 지옥 방지
- computed 기반으로 반응형 필터링 유지

---

### Usage

``` vue

-- 단일
const filteredTrainDatasets = filterByKeyword(datasets, datasetKeyword, 'datasetNm');

-- 다중
const filteredAgents = filterByKeywords(toRef(props, 'agents'), {
  agentNm: keywordAgentNm,
  activeYn: keywordStatus,
  agentTypeCd: keywordType,
});
```

## UseCodeUtils

### Usage

``` vue

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

