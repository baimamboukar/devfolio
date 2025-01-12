<script setup>
  // Define props for certifications data
  const props = defineProps({
    certifications: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Certifications</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <UCard
        v-for="cert in certifications"
        :key="cert.name"
        class="flex flex-col items-center p-4 hover:bg-gray-900/50 transition-colors duration-300"
      >
        <nuxt-img
          :src="cert.badge"
          :alt="cert.name"
          class="w-24 h-24 mb-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
        <h3 class="text-center font-medium">{{ cert.name }}</h3>
      </UCard>
    </div>
  </section>
</template>
