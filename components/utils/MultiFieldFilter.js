import { computed } from 'vue';

/**
 * 여러 필드에 대해 조건별 필터링 함수
 * @param {Ref<Array>} listRef - 필터할 리스트 ref
 * @param {Object} filterCriteria - 필터 조건 객체, { 필드명: 필터값, ... }
 * @returns {ComputedRef<Array>} 필터된 리스트
 */

// 단일 키워드
export const filterByKeyword = (listRef, keywordRef, field) => {
  return computed(() => {
    const keyword = keywordRef.value.toLowerCase();
    return listRef.value.filter(item => (item[field] || '').toLowerCase().includes(keyword));
  });
};

// 다중 키워드
export const filterByKeywords = (listRef, keywords) => {
  return computed(() => {
    const list = listRef.value || [];
    const keywordObj = keywords || {};

    return list.filter(item => {
      return Object.entries(keywordObj).every(([field, keywordRef]) => {
        const kw = (keywordRef?.value || '').toString().toLowerCase().trim();
        if (!kw) return true;
        const val = (item[field] || '').toString().toLowerCase();
        return val.includes(kw);
      });
    });
  });
};
