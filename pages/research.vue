<script setup>
definePageMeta({
  title: "Research",
  description: "Academic research projects, publications, and scholarly work by Baimam Boukar JJ at Carnegie Mellon University Africa.",
});
</script>

<template>
  <div class="max-w-6xl mx-auto px-4">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Research
      </h1>
      <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
        My academic research focuses on applying machine learning and remote sensing technologies
        to address critical challenges in environmental monitoring, healthcare, and space systems.
        Below you'll find my current working papers and published conference proceedings.
      </p>
    </div>

<!-- Research Focus Areas -->
    <div class="mb-8">
      <ResearchMap />
    </div>

    <!-- Research Section -->
    <ResearchSection />
  </div>
</template>