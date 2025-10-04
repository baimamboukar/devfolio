<script setup>
const achievements = [
  {
    text: 'Currently analyzing spacecraft telemetry for anomaly detection using causal inference methods'
  },
  {
    text: 'Paper on thermography for breast cancer diagnosis under review at Medical AI Conference 2024'
  },
  {
    text: 'Presenting air quality disparities research at IEEE Remote Sensing Conference 2024'
  },
  {
    text: 'Leading research on contrail prediction models for African airspace'
  }
];

const currentIndex = ref(0);

onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % achievements.length;
  }, 5000);
});
</script>

<template>
  <section class="relative overflow-hidden bg-gradient-to-r from-sky-50 to-blue-50 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-3 mb-6">
    <div class="flex items-center space-x-3">
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {{ achievements[currentIndex].text }}
        </p>
      </div>
      <div class="flex space-x-1">
        <button
          v-for="(_, index) in achievements"
          :key="index"
          @click="currentIndex = index"
          class="w-1.5 h-1.5 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-sky-500 w-4' : 'bg-gray-300 dark:bg-gray-600'"
        />
      </div>
    </div>
  </section>
</template>