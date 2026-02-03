# [Pattern] 효율적인 Form 상태 관리 및 초기화 로직 설계

코드 중복을 최소화하고 필드 추가 시 유지보수성을 높이기 위해 적용한 패턴입니다.

---

## 1. 문제 상황 (Before)
- Form 초기 상태를 정의하는 부분과, 초기화(Reset)를 수행하는 함수에서 동일한 객체 구조를 중복 관리.
- 새로운 입력 필드가 추가될 때마다 두 곳 이상의 코드를 동시에 수정해야 하므로 누락 발생 가능성이 높음.

---

## 2. 해결 방안 (After): Initial State 기반 객체 관리
초기 상태를 별도의 상수로 선언하고, 이를 **전개 연산자(Spread Operator)**를 통해 할당하여 데이터 구조를 단일화했습니다.

* 전개 연산자 사용 이유
 - JavaScript에서 객체는 참조(Reference) 방식으로 동작.
 그냥 agentForm.value = initialAgentForm이라고 쓰면, 두 변수가 같은 박스를 가리키게 되어 한쪽을 수정하면 다른 쪽도 같이 변해버립니다.
 -> ...(전개 연산자)를 쓰면 **내용물만 똑같이 복사해서 "완전히 새로운 박스"**를 만듭니다.

### 핵심 로직
1. **Initial Object 선언:** Form의 기본 구조를 담은 `initialAgentForm` 상수를 정의.
2. **반응형 데이터 할당:** `ref` 선언 시 해당 상수를 복사하여 초기화.
3. **Deep Copy 기반 Reset:** Reset 시 상수를 다시 복사하여 할당함으로써 참조 관계를 끊고 초기 상태로 복구.

---

## 3. 구현 코드 (Vue 3 Composition API)

```javascript
// 1. Form의 표준 구조를 한 곳에서 관리 (Single Source of Truth)
const initialAgentForm = {
  agentId: '',
  agentNm: '',
  agentDesc: '',
  agentTypeCd: 'learning',
  // ... 기타 많은 필드들
  agentDestination: 'local',
};

// 2. 초기값 할당 (얕은 복사/전개 연산자 활용)
const agentForm = ref({ ...initialAgentForm });

// 3. 폼 초기화 로직의 단순화
const resetAgentForm = () => {
  // 새로운 객체를 할당함으로써 기존 반응형 연결을 유지한 채 값만 초기화
  agentForm.value = { ...initialAgentForm };
};
```

---

## 참고 자료

| 구분 | 항목 | 경로 |
| :--- | :--- | :--- |
| **History** | 리팩토링 사례 | [반복적인 Form 초기화 로직의 구조화](../../dev-notes/form/agentform-refactoring-log.md) |
