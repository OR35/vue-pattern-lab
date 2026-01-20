<template>
  <Dialog v-model:open="localOpen">
    <DialogContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
      </DialogHeader>
      <div class="space-y-6">
        <p class="text-center font-medium text-gray-700 mb-6">
          {{ props.desc }}
        </p>
        <div class="space-y-2">
          <Label>사유</Label>
          <Textarea v-model="deleteReason" placeholder="삭제 사유를 입력하세요" class="h-60" />
        </div>
        <div class="flex justify-end gap-2 pt-4">
          <Button variant="destructive" @click="handleUpdateDeleteReason"> 삭제 </Button>
          <Button variant="outline" @click="handleCloseDeleteConfirm"> 취소 </Button>
        </div>
        <!-- <div class="flex justify-center gap-2">
            <Button variant="destructive" @click="handleUpdateDeleteReason">삭제</Button>
            <Button variant="outline" @click="handleCloseDeleteConfirm">취소</Button>
        </div> -->
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';

import Dialog from '@/components/ui/dialog/Dialog.vue';
import DialogContent from '@/components/ui/dialog/DialogContent.vue';
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
import Button from '@/components/ui/button/Button.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import Label from '../ui/label/Label.vue';

const props = defineProps({
  open: Boolean,
  title: String,
  desc: String,
});

const emit = defineEmits(['update:open', 'closeConfirm', 'updateDeleteReason']);

const localOpen = ref(props.open);
const deleteReason = ref(null);

watch(
  () => props.open,
  val => {
    localOpen.value = val;
  },
);

watch(localOpen, val => {
  emit('update:open', val);
  if (!val) {
    handleCloseDeleteConfirm();
  }
});

const handleUpdateDeleteReason = () => {
  emit('updateDeleteReason', deleteReason.value);
};

const handleCloseDeleteConfirm = () => {
  emit('closeConfirm');
};
</script>
