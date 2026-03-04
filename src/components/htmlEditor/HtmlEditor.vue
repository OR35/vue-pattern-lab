<template>
  <div>
    <div ref="editorRef"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
let quill = null;
let isUpdating = false;
let selectedImg = null;

// 이미지 정렬을 위한 Attributor 등록
const ImageAlign = Quill.import('attributors/style/align');
Quill.register(ImageAlign, true);

onMounted(() => {
  quill = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ size: ['small', false, 'large', 'huge'] }], // 글씨 크기
          [{ color: [] }, { background: [] }], // 글씨 색상 / 배경색
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ align: [] }],
          ['link', 'image'],
          ['clean'],
        ],
        handlers: {
          align: value => {
            if (selectedImg) {
              selectedImg.style.display = 'block';
              selectedImg.style.float = '';
              selectedImg.style.marginLeft = '';
              selectedImg.style.marginRight = '';
              selectedImg.style.margin = '';

              if (value === 'center') {
                selectedImg.style.margin = '0 auto';
              } else if (value === 'right') {
                selectedImg.style.marginLeft = 'auto';
              }

              emit('update:modelValue', quill.root.innerHTML);
            } else {
              quill.format('align', value);
            }
          },
        },
      },
    },
  });

  // 초기값 설정
  if (props.modelValue) {
    quill.root.innerHTML = props.modelValue;
  }

  // 이미지 클릭 감지
  quill.root.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      selectedImg = e.target;
      document.querySelectorAll('.ql-editor img').forEach(img => {
        img.style.outline = '';
      });
      selectedImg.style.outline = '2px solid #4096ff';
    } else {
      if (selectedImg) {
        selectedImg.style.outline = '';
        selectedImg = null;
      }
    }
  });

  // 변경 감지
  quill.on('text-change', () => {
    if (isUpdating) return;
    emit('update:modelValue', quill.root.innerHTML);
  });
});

watch(
  () => props.modelValue,
  newVal => {
    if (!quill) return;
    if (quill.root.innerHTML === (newVal || '')) return;
    isUpdating = true;
    quill.root.innerHTML = newVal || '';
    isUpdating = false;
  },
);

onBeforeUnmount(() => {
  quill = null;
});
</script>

<style>
.ql-editor {
  min-height: 500px;
  font-size: 16px;
}
.ql-editor img {
  max-width: 100%;
  height: auto;
}
</style>
