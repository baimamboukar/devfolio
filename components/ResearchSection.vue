<script setup>
const selectedProject = ref(null);
const isModalOpen = ref(false);

// Handle project selection
const handleProjectOpen = (project) => {
  selectedProject.value = project;
  isModalOpen.value = true;
};

</script>

<template>
  <div>
    <!-- Research Projects List -->
    <ResearchProjects @open-project="handleProjectOpen" />

    <!-- Project Detail Modal -->
    <ResearchProjectModal
      v-model="isModalOpen"
      :project="selectedProject || {}"
    />
  </div>
</template>