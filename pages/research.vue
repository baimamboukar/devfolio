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
        My research focuses on understanding and improving Foundation Models and their applications in various high-impact domains, including Space, Healthcare, and Earth Observation.
      </p>
    </div>

    <!-- Research Focus Areas -->
    <!--
    <div class="mb-8">
      <ResearchMap />
    </div>
    -->

    <!-- Research Section -->
    <ResearchSection />

    <!-- Nested Route (Modal) -->
    <NuxtPage :transition="false" />
  </div>
</template>
