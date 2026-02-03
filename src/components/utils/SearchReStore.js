import { nextTick } from 'vue';
import { useSearchStore } from './SearchStore';

/**
 * 메뉴별 검색 조건 및 페이지 상태를 복구하는 Composable
 * @param {string} MENU_KEY - 스토어에서 데이터를 식별할 고유 키 (예: 'SENSOR', 'OPTIMIZATION')
 * @returns {Object}
 * @returns {Function} returns.restore - 상태 복구를 수행하는 비동기 함수
 * @example
 * const { restore } = useSearchRestore('SENSOR');
 * * onMounted(async () => {
 * await restore({
 * pageInfo,           // 복구될 페이지 정보 ref
 * searchInfoRef,      // 자식 검색 폼 ref
 * extraFields: ['statusCd'] // pageInfo에 담긴 추가 필드명 배열
 * });
 * });
 */
export function useSearchRestore(MENU_KEY) {
    const searchStore = useSearchStore();

    const restore = async ({ pageInfo, searchInfoRef, extraFields = [] }) => {
        const saved = searchStore.getCondition(MENU_KEY);
        if (!saved) return false;

        // 공통 검색조건
        if (saved.pageInfo) {
            Object.assign(pageInfo.value, saved.pageInfo);
        }

        // 메뉴별 상이한 검색조건 복원
        extraFields.forEach(field => {
            if (saved[field] !== undefined) {
                pageInfo.value[field] = saved[field];
            }
        });

        // 자식 컴포넌트 필드 복원
        await nextTick();
        if (searchInfoRef.value) {
            if (saved.searchInfo) Object.assign(searchInfoRef.value.searchInfo, saved.searchInfo);

            Object.keys(saved).forEach(key => {
                if (key !== 'pageInfo' && key !== 'searchInfo') {
                    const target = searchInfoRef.value[key];
                    // 자식에게 해당 키가 있고, 그게 함수가 아닐 때만 값을 대입
                    if (target !== undefined && typeof target !== 'function') {
                        searchInfoRef.value[key] = saved[key];
                    }
                }
            });
        }
        searchStore.resetCondition(MENU_KEY);
        return true;
    };

    return { restore };
}
