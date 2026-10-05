<script setup>
defineProps({ modelValue: { type: String, required: true }, options: { type: Array, required: true }, label: { type: String, default: 'Filter collection' } });
defineEmits(['update:modelValue']);
</script>
<template><div class="collection-filters" role="group" :aria-label="label"><button v-for="option in options" :key="option.value" type="button" :aria-pressed="modelValue === option.value" @click="$emit('update:modelValue', option.value)">{{ option.label }}</button></div></template>
<style scoped>
.collection-filters { display:flex; flex-wrap:wrap; gap:6px; }
button { padding:7px 12px; border-radius:var(--corner-radius); color:var(--muted); font-size:.8rem; min-height:38px; line-height:1.4; background:var(--surface-alt); border:1px solid transparent; }
button:hover { color:var(--ink); border-color:var(--line); }
button[aria-pressed='true'] { color:white; background:rgb(var(--primary-600)); }
@media(max-width:600px) { button { min-height:44px; } }
</style>
