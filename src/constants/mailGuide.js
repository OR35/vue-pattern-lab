/**
 * @description 메일 템플릿 작성 가이드용 상수 데이터
 * @property {string} key - 템플릿에서 치환될 키워드명
 * @property {string} value - 키워드의 실제 설정 값 (고정값인 경우)
 * @property {string} desc - 키워드에 대한 설명
 */

/**
 * 공통으로 사용하는 기본 키워드
 */
export const COMMON_KEYWORDS = [
    { key: 'platform_name', value: 'Platform Name', desc: '플랫폼명' },
    { key: 'platform_url', value: 'http://platform.co.kr', desc: '플랫폼 접속 주소' },
    { key: 'username', value: '', desc: '회원 명' },
    { key: 'user_email', value: '', desc: '회원 이메일' },
];

/**
 * 메일 유형 별 추가 키워드
 * @enum {Array<{key: string, value: string, desc: string}>}
 */
export const TYPE_KEYWORDS = {
    /** 가입 환영 */
    MT_WELCOME: [{ key: 'password', value: '', desc: '임시 발급 비밀번호' }],
    /** 가입 탈퇴 */
    MT_LEAVE: [],
    /** 데이터셋 수집 완료 */
    MT_DATASET_COMP: [
        { key: 'dataset_name', value: '', desc: '데이터셋 명' },
        { key: 'sensor_info', value: '', desc: '센서 정보' },
        // ...
    ],
    /** 모델 학습 완료 */
    MT_MODELLEARNING_COMP: [
        { key: 'ml_name', value: '', desc: '모델학습 명' },
        { key: 'ml_st_time', value: '', desc: '모델학습 시작 시간' },
        { key: 'ml_ed_time', value: '', desc: '모델학습 종료 시간' },
        { key: 'ml_run_time', value: '', desc: '모델학습 수행 시간' },
        { key: 'metric_info', value: '', desc: '평가정보' },
        // ...
    ],
    /** 최적화 완료 */
    MT_OPTIMIZATION_COMP: [
        { key: 'opt_name', value: '', desc: '최적화 명' },
        { key: 'opt_st_time', value: '', desc: '최적화 시작 시간' },
        { key: 'opt_ed_time', value: '', desc: '최적화 종료 시간' },
        { key: 'opt_run_time', value: '', desc: '최적화 수행 시간' },
        { key: 'best_iteration', value: '', desc: '최적회차' },
        { key: 'metric_name', value: '', desc: '평가항목 명' },
        { key: 'metric_value', value: '', desc: '평가항목 값' },
        // ...
    ],
    /** 문의 접수 */
    MT_QNA_RECEIPT: [
        { key: 'qna_username', value: '', desc: '접수자 명' },
        { key: 'qna_regdate', value: '', desc: '접수일' },
        { key: 'qna_title', value: '', desc: '문의 제목' },
        { key: 'qna_content', value: '', desc: '문의 내용' },
    ],
    /** 문의 답변 */
    MT_QNA_ANSWER: [
        { key: 'qna_username', value: '', desc: '접수자 명' },
        { key: 'qna_regdate', value: '', desc: '접수일' },
        { key: 'qna_title', value: '', desc: '문의 제목' },
        { key: 'qna_content', value: '', desc: '문의 내용' },
        { key: 'qna_access_url', value: '', desc: '문의 상세 페이지 주소' },
    ],
    /** 비밀번호 초기화 */
    MT_RESETPASSWORD: [{ key: 'reset_password', value: '', desc: '초기화 발급 비밀번호' }],
};
