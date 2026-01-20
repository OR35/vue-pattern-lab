<template>
  <div class="flex items-center justify-between">
    <div class="text-sm text-muted-foreground whitespace-nowrap">
      {{ startIndex }}~{{ endIndex }} / 총 {{ totalCount }}건
    </div>
    <div class="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="movePage(currentPage - 1)"
      >
        &lt;
      </Button>
      <Button
        v-for="page in pageNumbers"
        :key="page"
        size="sm"
        :variant="currentPage === page ? 'default' : 'outline'"
        @click="movePage(page)"
      >
        {{ page }}
      </Button>
      <Button
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="movePage(currentPage + 1)"
      >
        &gt;
      </Button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';

const emit = defineEmits(['handleClickPageMove', 'handleClickChangePerPage']);

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  totalCount: Number,
  itemsPerPage: {
    type: Number,
    default: 10,
  },
});

const startIndex = computed(() => {
  if (props.totalCount === 0) return 0;
  return (props.currentPage - 1) * props.itemsPerPage + 1;
});

const endIndex = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalCount);
});

const pageNumbers = computed(() => {
  const pages = [];
  if (props.totalPages <= 1) return [1];

  const maxVisible = 5; // 보여줄 페이지 개수

  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(props.totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const movePage = page => {
  if (page < 1 || page > props.totalPages) return;
  emit('handleClickPageMove', page);
};
</script>
