<template>
  <div ref="editorRef"></div>
</template>
<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue']);

const editorRef = ref(null);
let editor = null;

onMounted(() => {
  editor = new Editor({
    el: editorRef.value,
    height: '500px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    initialValue: props.modelValue || '',
    hooks: {
      change: () => {
        emit('update:modelValue', editor.getHTML());
      },
    },
  });
});

watch(
  () => props.modelValue,
  newVal => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((newVal || '') !== current) {
      editor.setHTML(newVal || '');
    }
  },
);

// 컴포넌트 파기 시 에디터 정리
onBeforeUnmount(() => {
  try {
    editor?.destroy();
    editor = null;
  } catch (e) {
    // 에러 발생
  }
});
</script>
