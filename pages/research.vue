<script setup>
  definePageMeta({
    title: "Research",
    description: "Mechanistic interpretability and AI safety research by Baimam Boukar Jean Jacques.",
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
        I study the generalization and reliability of activation probes and interventions.
        My work combines reproduction, controlled experiments, and held-out evaluation
        across models, tasks, and distribution shifts.
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
