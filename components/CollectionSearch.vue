<script setup>
defineProps({ modelValue: { type: String, default: '' }, label: { type: String, default: 'Search' } });
defineEmits(['update:modelValue']);
</script>
<template><label class="collection-search"><SiteIcon name="search" /><span class="sr-only">{{ label }}</span><input type="search" :value="modelValue" :placeholder="label" @input="$emit('update:modelValue', $event.target.value)" /></label></template>
<style scoped>
.collection-search { display:flex; align-items:center; gap:9px; min-height:42px; padding:0 12px; border-radius:var(--corner-radius); background:var(--surface-alt); border:1px solid transparent; color:var(--muted); flex:1; min-width:0; }
.collection-search .site-icon { width:15px; height:15px; flex:none; }
input { font:inherit; font-size:.85rem; color:var(--ink); background:transparent; width:100%; min-width:0; padding:10px 0; border:0; outline:none; }
.collection-search:focus-within { border-color:rgb(var(--primary-400)); background:var(--surface); }
input:focus-visible { outline:none; } input::placeholder { color:var(--muted); }
</style>
