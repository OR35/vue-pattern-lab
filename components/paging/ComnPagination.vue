<template>
  <Card>
    <CardContent class="pt-5">
      <div class="flex flex-row gap-4 justify-between">
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-2">
            <span class="font-medium text-foreground whitespace-nowrap">페이지당:</span>
            <Select v-model="itemsPerPage" @update:model-value="handleItemsPerPageChange">
              <SelectTrigger class="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent v-if="gridType === false">
                <SelectItem :value="Number(3)">3개</SelectItem>
                <SelectItem :value="Number(6)">6개</SelectItem>
                <SelectItem :value="Number(9)">9개</SelectItem>
                <SelectItem :value="Number(10)">10개</SelectItem>
                <SelectItem :value="Number(12)">12개</SelectItem>
              </SelectContent>
              <SelectContent v-else>
                <SelectItem :value="Number(5)">5개</SelectItem>
                <SelectItem :value="Number(10)">10개</SelectItem>
                <SelectItem :value="Number(15)">15개</SelectItem>
                <SelectItem :value="Number(20)">20개</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="text-muted-foreground whitespace-nowrap">
            총 {{ totalCount }} 개 중 {{ (currentPage - 1) * itemsPerPage + 1 }} -
            {{ Math.min(totalCount, currentPage * itemsPerPage) }}
            개 표시
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2 text-sm mr-4">
            <span class="font-medium text-foreground whitespace-nowrap">페이지</span>
            <Input
              v-model="pageInput"
              type="number"
              min="1"
              :max="totalPages"
              class="w-16 h-8 text-center"
              @change="handleClickPageMove($event.target.value)"
            />
            <span class="text-muted-foreground whitespace-nowrap">/ {{ totalPages }}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="handleClickPageMove(currentPage - 1)"
          >
            <ChevronLeft class="h-4 w-4" />이전
          </Button>
          <Button
            v-for="pageNumber in pageNumbers"
            :key="pageNumber"
            :variant="currentPage === pageNumber ? 'default' : 'outline'"
            :class="{
              'border border-blue-500 font-bolder': currentPage === pageNumber,
            }"
            size="sm"
            @click="handleClickPageMove(pageNumber)"
          >
            {{ pageNumber }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="handleClickPageMove(currentPage + 1)"
          >
            다음<ChevronRight class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const emit = defineEmits(['handleClickPageMove', 'handleClickChangePerPage']);

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
  itemsPerPage: {
    type: Number,
    required: false,
    default: 6,
  },
  gridType: {
    type: Boolean,
    default: false,
  },
});

// const itemsPerPage = ref(6);
const itemsPerPage = ref(props.itemsPerPage);
const pageInput = ref(1);
const pageNumbers = ref([]);
const startIndex = ref(0);
const endIndex = ref(0);

const handleClickPageMove = page => {
  pageInput.value = page;
  movePage(page);
};

const movePage = page => {
  var format = /^-[0-9]+g/;
  let pageNo = 1;

  if (Number(page) <= 0 || format.test(page)) {
    pageNo = 1;
  } else if (Number(page) >= props.totalCount) {
    pageNo = props.totalCount;
  } else {
    pageNo = Number(page);
  }
  // 스크롤 최상단 이동
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth', // 부드럽게 'smooth', 즉시 'auto'
  });
  emit('handleClickPageMove', pageNo);
};

// 페이지당 항목 수 변경 핸들러
const handleItemsPerPageChange = async itemsPerPage => {
  emit('handleClickChangePerPage', itemsPerPage); // totalPages 변경
};

// itemsPerPage 변경 => GET 요청 => 응답 받은 후 totalPages 바뀌었으면 pages 배열 수정
watch(
  () => props.totalPages,
  () => {
    pageInput.value = props.currentPage;
    getPageNumbers();
  },
);

watch(
  () => props.currentPage,
  crr => {
    if (!pageNumbers.value.includes(crr)) {
      pageInput.value = crr;
      getPageNumbers();
    }
  },
);

watch(
  () => pageInput.value,
  (crr, pre) => {
    if (
      crr &&
      Number(crr) &&
      (crr < 1 || props.totalPages < crr) &&
      pageNumbers.value.includes(pre)
    ) {
      pageInput.value = pre;
    }
  },
);

// 페이지 번호 배열 생성 (최대 5개 페이지 번호 표시)
const getPageNumbers = async () => {
  pageNumbers.value = [];
  let maxVisiblePages = 5;
  let startPage = Math.max(1, props.currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(props.totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.value.push(i);
  }
};
</script>
