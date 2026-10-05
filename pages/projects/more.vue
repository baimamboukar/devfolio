<script setup>
import { workRedirect } from '~/utils/workRedirect';
const route = useRoute();
await navigateTo({ ...workRedirect(route), query: { ...workRedirect(route).query, view: 'archive' } }, { redirectCode: 302, replace: true });
</script>
<template><div /></template>
