<script setup>
defineProps({ title: { type: String, required: true }, description: { type: String, default: '' } });
</script>
<template>
  <header class="page-heading"><h1>{{ title }}</h1><p v-if="description">{{ description }}</p><div v-if="$slots.default" class="page-heading-links"><slot /></div></header>
</template>
<style scoped>
.page-heading { margin-bottom:var(--section-gap); }
h1 { margin:0; font-size:var(--name-size); line-height:1.25; }
p { max-width:74ch; margin-top:8px; color:var(--muted); font-size:1rem; line-height:var(--content-leading); text-wrap:pretty; }
.page-heading-links { display:flex; align-items:center; flex-wrap:wrap; gap:6px 16px; margin-top:12px; font-size:.85rem; color:var(--link-color); }
.page-heading-links :deep(a) { display:inline-flex; align-items:center; min-height:36px; }
</style>
