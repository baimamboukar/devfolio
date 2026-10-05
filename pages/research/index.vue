<script setup>
import { workRedirect } from '~/utils/workRedirect';
const route = useRoute();
await navigateTo(workRedirect(route), { redirectCode: 302, replace: true });
</script>
<template><div class="legacy-work-index" /></template>
<style scoped>
.legacy-work-index { min-width:0; }
</style>
