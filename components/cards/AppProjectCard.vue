<script setup>
import WorkCard from '~/components/WorkCard.vue';
const props = defineProps({ projectTitle: { type: String, default: '' }, projectDescription: { type: String, default: '' }, projectUrl: { type: String, default: '#' }, icon: { type: String, default: '' }, status: { type: String, default: '' }, tags: { type: Array, default: () => [] }, index: { type: Number, default: 0 } });
const method = computed(() => props.projectTitle.startsWith('Cross-Model') ? 'refit' : props.projectTitle.startsWith('Selection Regret') ? 'selection' : props.projectTitle.startsWith('Coordinate') ? 'alignment' : props.projectTitle.startsWith('Measuring Delusion') ? 'support' : props.projectTitle.includes('Matryoshka') ? 'sae' : null);
</script>
<template>
  <WorkCard :title="projectTitle" :description="projectDescription" :url="projectUrl" :status="status" :tags="tags" :kind="method" class="project-exhibit" />
</template>
<style scoped>
.project-exhibit { min-width:0; }
</style>
