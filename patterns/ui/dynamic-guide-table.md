# [Pattern] 데이터 주도형 동적 가이드 테이블 (Dynamic Guide Table)

UI에 표시되는 가이드 정보를 하드코딩하지 않고, 상수 데이터와 유형(Type)별 매핑을 통해 동적으로 렌더링하는 패턴입니다.

---

## 1. 설계 의도 (Motivation)
1. 유지보수성: 가이드 키워드가 추가되거나 수정될 때 HTML 마크업을 건드리지 않고 상수 파일만 수정합니다.
2. 확장성: 메일 유형, 알림 유형 등 조건에 따라 변화하는 가이드 데이터를 유연하게 처리합니다.
3. 가독성: 템플릿의 복잡도를 낮추고 데이터 흐름을 명확히 분리합니다.

---

## 2. 패턴 구조 (Structure) 및 적용 가이드
- 1단계: 가이드 데이터 정의 (constants/mailGuide.js)
공통 키워드와 유형별 특화 키워드를 분리하여 관리합니다.

```JavaScript
export const COMMON_KEYWORDS = [
  { key: 'platform_name', value: 'Platform Name', desc: '플랫폼명' },
  { key: 'platform_url', value: 'http://platform.co.kr', desc: '플랫폼 접속 주소' },
  { key: 'username', value: '', desc: '회원 명' },
  { key: 'user_email', value: '', desc: '회원 이메일' },
];

export const TYPE_KEYWORDS = {
  MT_WELCOME: [{ key: 'password', value: '', desc: '임시 발급 비밀번호' }],
  MT_DATASET_COMP: [
    { key: 'dataset_name', value: '', desc: '데이터셋 명' },
    { key: 'bulkfile_count', value: '', desc: 'Bulkfile 수' },
  ],
  // ... 기타 유형 정의
};
```

- 2단계: 로직 주입 및 렌더링 (Vue Component)
computed를 활용해 선택된 유형에 맞는 최종 데이터셋을 생성합니다.

```JavaScript
import { COMMON_KEYWORDS, TYPE_KEYWORDS } from '@/constants/mailGuide';

const keywordType = ref('MT_WELCOME'); //ex

const guideData = computed(() => {
  const base = [...COMMON_KEYWORDS];
  const extra = TYPE_KEYWORDS[keywordType.value] || [];
  return [...base, ...extra];
});
```

```HTML
<Table class="table-fixed w-full border">
  <TableHeader>
    <TableRow>
      <TableHead class="w-40 text-center">키워드</TableHead>
      <TableHead class="w-48 text-center">설정값</TableHead>
      <TableHead class="text-center">설명</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow v-for="item in guideData" :key="item.key">
      <TableCell class="font-mono font-bold text-blue-600">{{ item.key }}</TableCell>
      <TableCell>{{ item.value }}</TableCell>
      <TableCell>{{ item.desc }}</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
---

## 3. 핵심 기술 포인트
- Spread Operator: [...base, ...extra]를 통해 원본 데이터를 훼손하지 않고 새로운 배열을 병합합니다.
- Computed Property: keywordType이 변경될 때마다 테이블이 즉각적으로 반응하여 업데이트됩니다.

---

## 참고 자료

| 구분 | 항목 | 경로 |
| :--- | :--- | :--- |
| **Logic** | 가이드 데이터 상수 | [MailGuide.js](../../src/constants/mailGuide.js) |
