<!-- components/about/Experience.vue -->
<script setup>
  defineProps({
    experience: {
      type: Array,
      required: true,
      default: () => [] // Add default value
    }
  })
</script>

<template>
  <div>
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Professional Experience</h2>
      <UStepper
        v-if="experience.length"
        :steps="experience.map((exp, index) => ({
          title: exp.title,
          description: exp.company,
          icon: exp.status,
          complete: index < experience.length - 1
        }))"
      >
        <!-- Rest of the template remains the same -->
      </UStepper>
      <p v-else class="text-gray-500 text-center">
        No experience data available
      </p>
    </section>
  </div>
</template>
