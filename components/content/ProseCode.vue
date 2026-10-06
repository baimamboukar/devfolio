<script setup>
const props = defineProps({
  code: { type: String, default: '' },
  filename: { type: String, default: null },
  language: { type: String, default: null },
  highlights: { type: Array, default: () => [] },
  meta: { type: String, default: null },
});
const copied = ref(false);
const message = ref('');
let resetTimer;
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    message.value = 'Code copied.';
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => { copied.value = false; message.value = ''; }, 2000);
  } catch { message.value = 'Select the code to copy it.'; }
};
onBeforeUnmount(() => clearTimeout(resetTimer));
</script>
<template>
  <div class="content-code">
    <div v-if="filename" class="code-filename">{{ filename }}</div>
    <button type="button" class="copy-code" :aria-label="copied ? 'Code copied' : 'Copy code to clipboard'" @click="copyCode"><UIcon :name="copied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" aria-hidden="true" /></button>
    <slot />
    <span class="sr-only" role="status">{{ message }}</span>
  </div>
</template>
<style scoped>
.content-code { position:relative; }
.copy-code { position:absolute; top:10px; right:10px; display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; padding:6px; border:0; border-radius:6px; color:rgb(107 114 128); background:transparent; font-size:12px; font-weight:500; line-height:16px; }
.copy-code:hover { color:rgb(55 65 81); }
.copy-code :deep(.icon),.copy-code :deep(span) { width:16px; height:16px; flex:none; }
.code-filename { padding:8px 16px; background:var(--surface-alt); color:var(--muted); font-size:.8rem; }
:global(html.dark .copy-code) { color:rgb(156 163 175); }
:global(html.dark .copy-code:hover) { color:rgb(229 231 235); }
</style>
