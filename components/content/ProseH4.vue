<script setup>
import ContentHeading from './ContentHeading.vue';
defineProps({ id: { type: String, default: undefined } });
</script>
<template><ContentHeading tag="h4" :id="id"><slot /></ContentHeading></template>
