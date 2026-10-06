<script setup>
import ContentHeading from './ContentHeading.vue';
defineProps({ id: { type: String, default: undefined } });
</script>
<template><ContentHeading tag="h2" :id="id"><slot /></ContentHeading></template>
