# Popup


## DeleteComfirmPopup

삭제와 같이 **되돌릴 수 없는 액션을 수행하기 전 사용자 확인을 받기 위한 공통 팝업 컴포넌트**입니다.  
삭제 사유 입력을 포함하며, 화면별 로직과 분리된 형태로 설계되었습니다.

---

### 🎯 Purpose

- 삭제 / 비활성화 / 종료 등 위험한 액션 전 확인 UX 제공
- 삭제 사유 입력을 공통 패턴으로 재사용
- 팝업 UI와 실제 삭제 로직을 분리

---

### Usage
``` vue

  <DeleteConfirmPopup
    :title="confirmDeleteTitle"
    :desc="confirmDeleteDesc"
    :open="deleteConfirmDialogOpen"
    @update:open="deleteConfirmDialogOpen = $event"
    @close-confirm="handleCloseDeleteConfirm"
    @update-delete-reason="deleteForm"
  />

const handleOpenDeleteConfirm = () => {
  deleteConfirmDialogOpen.value = true;
};

const handleCloseDeleteConfirm = () => {
  deleteConfirmDialogOpen.value = false;
};
```
