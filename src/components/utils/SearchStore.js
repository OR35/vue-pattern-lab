import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 메뉴별 검색 조건 및 페이지 상태를 설정하는 Composable
 * @example
 * const searchStore = useSearchStore();
 * const MENU_KEY = 'SENSOR';
 * const savePayload = {
 * searchInfo: { ...searchInfoRef.value.searchInfo },
 * displayRegrNm: searchInfoRef.value.displayRegrNm, // pageInfo에 담긴 추가 필드명
 * pageInfo: {
 * currentPage: pageInfo.value.currentPage,
 * itemsPerPage: pageInfo.value.itemsPerPage,
 * sensorTypeCd: pageInfo.value.sensorTypeCd,
 * },
 * };
  searchStore.setCondition(MENU_KEY, savePayload);
 */
export const useSearchStore = defineStore(
    'search',
    () => {
        const conditions = ref({});

        const setCondition = (menuKey, data) => {
            conditions.value[menuKey] = { ...data };
        };

        const getCondition = menuKey => {
            return conditions.value[menuKey] || null;
        };

        const resetCondition = menuKey => {
            if (menuKey) {
                delete conditions.value[menuKey];
            } else {
                conditions.value = {};
            }
        };

        return { conditions, setCondition, getCondition, resetCondition };
    },
    //   {
    //     persist: true, // 새로고침해도 유지되도록 설정
    //   },
);
