<script setup>
  // Define props for the interests data
  const props = defineProps({
    interests: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-6">Interests</h2>
    <UPageGrid>
      <UPageCard
        v-for="interest in interests"
        description="Interest"
        :key="interest.name"
        :title="interest.name"
        :icon="interest.icon"
        :ui="{ icon: { base: 'w-10 h-10 flex-shrink-0 text-sky' } }"
        class="cursor-pointer group-hover:scale-110 transition-transform duration-300"
      />
    </UPageGrid>
  </section>
</template>
