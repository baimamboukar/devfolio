<script setup>
const colorMode=useColorMode(); const mounted=ref(false);
onMounted(()=> { mounted.value=true; });
const isDark=computed(()=>mounted.value&&colorMode.value==='dark');
const toggleTheme=()=> { colorMode.preference=isDark.value?'light':'dark'; };
</script>
<template><button type="button" class="theme-switch" :title="isDark?'Switch to light mode':'Switch to dark mode'" :aria-label="isDark?'Switch to light mode':'Switch to dark mode'" @click="toggleTheme"><SiteIcon :name="isDark?'sun':'moon'" /></button></template>
<style scoped>
.theme-switch { display:grid; place-items:center; width:36px; height:36px; border-radius:8px; color:var(--muted); background:transparent; }
.theme-switch:hover { color:var(--link-color); background:var(--surface-alt); }
</style>
