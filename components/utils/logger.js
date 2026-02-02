/**
 * console.log() 설정
 * 개발환경에 따라 log 표현
 */
const envNm = import.meta.env.VITE_APP_EVN_NM;

export const logger = {
    // 로컬 환경에서만 출력
    log: (...args) => {
        if (envNm === 'local') {
            console.log('[LOCAL_LOG]:', ...args);
        }
    },
    // 개발 서버 이상에서도 확인하고 싶은 중요 로그 (dev, local 출력)
    info: (...args) => {
        if (envNm === 'local' || envNm === 'dev') {
            console.info('[INFO]:', ...args);
        }
    },
    // 디버깅 전용: 객체나 배열을 테이블 형태로 시각화 (local 출력)
    debug: (label, data) => {
        if (envNm === 'local') {
            console.group(`%c[DEBUG] ${label}`, 'color: #FF9800; font-weight: bold');
            console.table(data);
            console.groupEnd();
        }
    },
    // 에러:: 모든 환경에서 출력
    error: (...args) => {
        console.error('[ERROR]:', ...args);
    },
    dir: obj => {
        if (envNm === 'local') {
            console.dir(obj);
        }
    },
};
