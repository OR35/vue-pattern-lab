# [Pattern] Composable을 활용한 검색 조건 및 페이징 상태 유지 패턴

상세 페이지 이동 후 목록으로 복귀할 때, 이전 검색 필터와 페이지 번호를 자동으로 복원하여 최적의 UX를 제공하는 설계 패턴입니다.

---

## 1. 설계 의도 (Motivation)
- UX 향상: 사용자가 설정한 검색 조건이 페이지 이동 시 휘발되지 않도록 하여 재입력의 번거로움을 제거합니다.
- 선언적 개발: 복잡한 복구 로직을 Composable로 추상화하여, 각 페이지에서는 한 줄의 코드로 상태를 복원합니다.
- 안정성 확보: nextTick을 통해 자식 컴포넌트의 마운트 시점을 보장하며 데이터 주입 시 발생할 수 있는 참조 에러를 방지합니다.

---

## 2. 패턴 구조 (Structure)
이 패턴은 Pinia Store(상태 저장), Utility(로직 정의), **Composable(로직 캡슐화)**의 협력으로 동작합니다.

- 1단계: 검색 상태 저장소 (SearchStore.js)
메뉴별 고유 키를 사용하여 독립적인 검색 환경을 저장합니다.

```JavaScript
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSearchStore = defineStore('search', () => {
  const conditions = ref({});

  const setCondition = (menuKey, data) => {
    conditions.value[menuKey] = { ...data };
  };

  const getCondition = (menuKey) => {
    return conditions.value[menuKey] || null;
  };

  const resetCondition = (menuKey) => {
    if (menuKey) delete conditions.value[menuKey];
    else conditions.value = {};
  };

  return { conditions, setCondition, getCondition, resetCondition };
});
```

- 2단계: 상태 복구 Composable (useSearchRestore.js)
복구 로직을 공통화하여 재사용성을 극대화합니다.

```JavaScript
import { nextTick } from 'vue';
import { useSearchStore } from './SearchStore';

export function useSearchRestore(MENU_KEY) {
  const searchStore = useSearchStore();

  const restore = async ({ pageInfo, searchInfoRef, extraFields = [] }) => {
    const saved = searchStore.getCondition(MENU_KEY);
    if (!saved) return false;

    // 1. 공통 페이징/기본 정보 복원
    if (saved.pageInfo) {
      Object.assign(pageInfo.value, saved.pageInfo);
    }

    // 2. 메뉴별 특수 필드 자동 매핑
    extraFields.forEach(field => {
      if (saved[field] !== undefined) {
        pageInfo.value[field] = saved[field];
      }
    });

    // 3. 자식 컴포넌트(DOM/Ref) 렌더링 대기 후 주입
    await nextTick();
    if (searchInfoRef.value) {
      if (saved.searchInfo) Object.assign(searchInfoRef.value.searchInfo, saved.searchInfo);
      if (saved.displayRegrNm) searchInfoRef.value.displayRegrNm = saved.displayRegrNm;
    }

    searchStore.resetCondition(MENU_KEY); // 복구 후 초기화
    return true;
  };

  return { restore };
}
```
---

## 3. 적용 가이드 (Usage)
1. 목록 페이지: 상태 복원
onMounted 시점에 restore 함수를 호출합니다.

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
이동 직전 현재 상태를 스토어에 기록합니다.

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

## 4. 확장 팁 (Pro-tips)
1. 지속성 유지: 새로고침 시에도 유지가 필요하면 Pinia의 persist 옵션을 활성화합니다.
2. 참조 안전성: Object.assign을 사용하여 반응형 객체의 메모리 주소를 유지하면서 내부 값만 동기화합니다.
3. 타이밍 제어: 자식 컴포넌트의 내부 데이터(ref)를 복구할 때는 반드시 await nextTick() 이후에 접근해야 합니다.

---

## 참고 자료

| 구분 | 항목 | 경로 |
| :--- | :--- | :--- |
| **History** | 리팩토링 사례 | [검색 조건 중복 로직 추상화](../../dev-notes/state/search-condition-refactoring.md) |
| **Logic** | 상태 관리 저장소 (Store) | [SearchStore.js](../../components/utils/SearchStore.js) |
| **Logic** | 캡슐화 Composable | [SearchRestore.js](../../components/utils/SearchRestore.js) |
