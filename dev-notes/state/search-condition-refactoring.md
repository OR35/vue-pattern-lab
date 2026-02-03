# [Refactoring] 검색 조건 복구 로직: Composable 도입을 통한 가독성 개선

목록 페이지의 onMounted에 밀집되어 있던 복잡한 상태 복구 로직을 Composable로 분리하여 재사용성과 가독성을 높인 리팩토링 기록입니다.

---

## 1. 문제 상황 (As-Is)
상세 페이지에서 목록으로 돌아올 때 검색 조건을 유지하기 위해 onMounted 내부에 수동으로 데이터를 할당하는 코드가 비대해졌습니다.

1. 코드 중복: 메뉴가 추가될 때마다 유사한 if문 블록을 계속 복사해서 사용.
2. 가독성 저하: 상태 복구 로직이 비즈니스 로직(API 호출 등)보다 길어져 코드 파악이 힘듦.
3. 타이밍 이슈: 자식 컴포넌트(searchInfoRef)의 DOM 렌더링 시점과 데이터 주입 시점이 맞지 않아 가끔 에러 발생.

onMounted 시점에 저장된 데이터를 하나씩 확인하며 ref 변수에 수동으로 할당하는 방식입니다.

```JavaScript
// 각 페이지의 onMounted 내부
onMounted(() => {
  const saved = searchStore.getCondition(MENU_KEY);
  if (saved) {
    if (saved.pageInfo) {
      pageInfo.value = { ...pageInfo.value, ...saved.pageInfo };
    }
    if (saved.searchInfo && searchInfoRef.value) {
      Object.assign(searchInfoRef.value.searchInfo, saved.searchInfo);
    }
    if (saved.displayRegrNm) {
      searchInfoRef.value.displayRegrNm = saved.displayRegrNm;
    }
    if (saved.optimizationStatus) {
      pageInfo.value.optimizationStatus = saved.optimizationStatus;
    }
    searchStore.resetCondition(MENU_KEY);
  }
  getCodeList();
});
```
---

## 2. 해결 과정 및 개선 (To-Be)
useSearchRestore라는 전용 Composable을 개발하여 복구 로직을 캡슐화했습니다.

주요 개선 사항
1. 추상화: 메뉴별로 다른 필드명을 extraFields 배열로 전달받아 자동 처리.
2. 안정성: nextTick을 사용하여 자식 컴포넌트가 마운트된 후 데이터를 주입하도록 보장.
3. 간결함: 페이지 컴포넌트의 복구 로직을 약 15줄에서 1줄의 함수 호출로 단축.

```JavaScript
const { restore } = useSearchRestore('OPTIMIZATION');

onMounted(async () => {
  // 한 줄의 비동기 함수 호출로 상태 복구 완료
  await restore({
    pageInfo,
    searchInfoRef,
    extraFields: ['displayRegrNm', 'optimizationStatus'],
  });

  getCodeList();
});
```
---

## 3. 리팩토링 핵심 포인트

1. Object.assign 활용: 반응형 객체의 참조 주소를 유지하면서 값만 덮어씌워 Vue의 반응성 시스템을 안정적으로 활용했습니다.
2. nextTick의 중요성: 자식 컴포넌트(검색 폼)가 완전히 마운트된 시점에 데이터를 주입하기 위해 비동기 처리를 도입하여 null 참조 에러를 방지했습니다.
3. 추상화 레벨: 구체적인 필드명을 하드코딩하는 대신 extraFields 배열로 넘겨줌으로써 유연한 구조를 확보했습니다.

---

## 4. 성과 및 회고
동작하는 코드를 만드는 것은 쉽지만, 유지보수하기 좋은 코드를 만드는 것은 끊임없는 추상화 고민이 필요하다는 것을 깨달았습니다. 이번 리팩토링을 통해 신규 메뉴 추가 시 개발 속도가 향상되었습니다.

---

> **연관 패턴:** [검색 조건 유지 패턴](../../patterns/state/search-condition-persistence.md)

