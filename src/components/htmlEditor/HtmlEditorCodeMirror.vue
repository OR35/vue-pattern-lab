<template>
  <div ref="editorContainer" class="h-96 border rounded"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits(['update:modelValue']);

const editorContainer = ref(null);
let editorView;

onMounted(() => {
  editorView = new EditorView({
    doc: props.modelValue || '',
    extensions: [
      basicSetup,
      html(),
      EditorView.lineWrapping,
      EditorView.updateListener.of(update => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString());
        }
      }),
    ],
    parent: editorContainer.value,
  });
});

watch(
  () => props.modelValue,
  val => {
    if (editorView && editorView.state.doc.toString() !== val) {
      editorView.dispatch({
        changes: { from: 0, to: editorView.state.doc.length, insert: val || '' },
      });
    }
  },
);
</script>
<style scoped>
:deep(.cm-editor) {
  height: 100%;
}
:deep(.cm-scroller) {
  overflow: auto;
}
</style>
