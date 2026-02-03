import { useI18n } from 'vue-i18n';

export function useCodeUtils() {
  //   const { locale } = useI18n();

  const getCodeNm = (list, val) => {
    if (!val || val === 'all') return '전체';
    const found = list?.find(item => item.cdVal === val);
    return found ? found.cdNm : val;
  };

  return { getCodeNm };
}
