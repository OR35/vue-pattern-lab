# [Pattern] 환경별 로그 레벨 제어 및 전역 로거 주입 패턴

애플리케이션 전역에서 사용되는 로그 시스템을 구축하고, 빌드 환경에 따라 출력 내용을 필터링하여 보안 리스크를 방지하고 디버깅 효율을 높이는 설계 패턴입니다.

---

## 1. 설계 의도 (Motivation)

1. 보안(Security): 운영(Production) 환경에서 민감한 데이터가 포함된 로그가 브라우저 콘솔에 노출되는 것을 차단합니다.
2. 가독성(Readability): console.table과 console.group을 활용하여 복잡한 데이터 구조를 시각화합니다.
3. 편의성(DX): 별도의 import 없이 템플릿과 스크립트 어디서든 로거에 접근할 수 있는 환경을 제공합니다.

---

## 2. 패턴 구조 (Structure)

로거는 환경 변수를 주입받아 동작하는 래퍼(Wrapper) 유틸리티와 이를 전역 객체에 바인딩하는 주입(Injection) 프로세스로 구성됩니다.

### 1단계: 유틸리티 정의 (src/assets/js/logger.js)
환경 변수(.env)를 참조하여 각 메서드의 실행 여부를 결정합니다.

```JavaScript
const envNm = import.meta.env.VITE_APP_EVN_NM;

export const logger = {
  // 로컬 전용: 일반 로그
  log: (...args) => {
    if (envNm === 'local') console.log('[LOCAL_LOG]:', ...args);
  },
  // 개발 서버까지 허용: 주요 정보 로그
  info: (...args) => {
    if (envNm === 'local' || envNm === 'dev') console.info('[INFO]:', ...args);
  },
  // 로컬 전용: 객체/배열 시각화 디버깅
  debug: (label, data) => {
    if (envNm === 'local') {
      console.group(`%c[DEBUG] ${label}`, 'color: #FF9800; font-weight: bold');
      console.table(data);
      console.groupEnd();
    }
  },
  // 공통: 에러 로그 (모든 환경 출력)
  error: (...args) => {
    console.error('[ERROR]:', ...args);
  },
  // 객체 구조 상세 확인
  dir: (obj) => {
    if (envNm === 'local') console.dir(obj);
  }
};
```

### 2단계: 전역 주입 (main.js)
Vue 인스턴스의 globalProperties와 브라우저의 window 객체에 로거를 등록합니다.

```JavaScript
import { logger } from '@/assets/js/logger';

const app = createApp(App);

// 1. Script Setup 및 일반 JS 어디서든 접근 가능하도록 설정
window.logger = logger;

// 2. Vue Template 내부에서 $logger로 접근 가능하도록 설정
app.config.globalProperties.$logger = logger;

app.mount('#app');
```

### 3. 적용 가이드 (Usage)

1. 스크립트 영역 - 전역 변수로 등록되었으므로 import 없이 즉시 호출합니다. (ESLint 설정 필요)

```JavaScript
const handleResponse = (data) => {
  logger.log('API Response 수신');
  logger.debug('Dataset 상세 정보', data);
};
```

2. 템플릿 영역 - $logger 접두사를 통해 직관적으로 사용합니다.

```HTML
<button @click="$logger.log('사용자 클릭 이벤트')">로그 남기기</button>
```

### 4. 환경 및 린트 설정
1) .env 설정

```Bash
# .env.local
VITE_APP_EVN_NM=local

# .env.production
VITE_APP_EVN_NM=prod
```

2) eslintrc.cjs 설정

전역 변수 사용 시 발생하는 no-undef 에러를 방지합니다.

```JavaScript
module.exports = {
  globals: {
    logger: 'readonly', // 전역 변수로 인식
  },
};
```

> **관련 코드:** [Logger Utils](../../components/utils/logger.js)