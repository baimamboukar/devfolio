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
        My core research interest is in Deep Learning, particularly the fundamental capabilities of Foundation Models.
        I aim to understand the limitations of Large Language Models (LLMs), especially in information retrieval and
        long-context execution, and develop methods for their improvement. At the application level, I leverage these
        techniques in high-impact, interdisciplinary domains like Earth Observation, Healthcare, and Space Research and Exploration.
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