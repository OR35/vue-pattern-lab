# [Pattern] 데이터 전처리를 통한 템플릿 렌더링 최적화 패턴
Vue 템플릿의 가독성과 렌더링 성능을 확보하기 위해 리스트 데이터를 출력 전 가공하는 설계 패턴입니다.

---

## 1. 문제 상황 (Before)
리스트(v-for) 내부에서 메서드를 호출하여 스타일이나 텍스트를 변환하는 경우.

컴포넌트 업데이트 시마다 리스트의 모든 행에서 메서드가 재실행되어 성능 이슈를 야기함.

---

## 2. 해결 방안 (After): Data Mapping Pattern
API로부터 받은 원본 데이터(Raw Data)를 뷰 모델(View Model)에 최적화된 형태로 변환한 뒤 템플릿에 전달합니다.

-> Computed 대신 Mapping을 쓰는 이유

단순 필터링이 아니라 각 리스트 아이템별로 복잡한 가공이 필요한 경우, computed보다 map을 통한 전처리가 데이터 구조를 파악하기에 더 직관적입니다.

### 핵심 로직
1. **Raw Data 수신:** API 통신으로 원본 배열 획득.
2. **Transform:** Array.prototype.map()을 활용하여 UI 전용 필드(variant, formattedDate 등) 주입.
3. **Binding:** 템플릿에서는 계산 없이 필드값만 바인딩.

---

## 3. 구현 코드 (Vue 3)

```JavaScript
// 1. 변환 로직의 분리 (Pure Function)
const getDatasetStatusVariant = status => {
  if (!status) return 'secondary';
  switch (status) {
    case 'DS_COLLECTING':
      return 'info'; // 수집중 (파란색)
    case 'DS_SUCCESS':
      return 'completed'; // 성공 (초록색)
    case 'DS_REQUEST':
      return 'tip'; // 수집 요청 (오렌지색)
    case 'DS_FAIL':
    case 'DS_REQUEST_FAIL':
      return 'failure'; // 실패 (빨간색)
    case 'DS_COLLECTING_STOP':
      return 'gray'; // 수집중지 (회색)
    default:
      return 'secondary'; // 기본
  }
};

// 2. 데이터 수신 시점의 매핑 처리
const fetchData = async () => {
  const { data } = await api.getList();
  
  items.value = data.map(item => ({
    ...item,
    // UI 렌더링을 위한 필드 미리 계산
    statusVariant: getStatusVariant(item.statusCd)
  }));
};
```

---

## 참고 자료

| 구분 | 항목 | 경로 |
| :--- | :--- | :--- |
| **History** | 리팩토링 사례 | [템플릿 내 함수 호출 최적화](../../dev-notes/state/rendering-optimization-log.md) |
