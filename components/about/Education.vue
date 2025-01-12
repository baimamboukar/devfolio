<script setup>
  // Define props for education data
  const props = defineProps({
    education: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-semibold mb-6">Education</h2>
    <div class="space-y-8">
      <div v-for="(edu, index) in education" :key="index" class="relative">
        <div
          v-if="index !== education.length - 1"
          class="absolute left-12 top-24 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
        />

        <UCard class="ml-24">
          <template #header>
            <div class="flex items-center gap-6">
              <div
                class="absolute -lef-10 bg-white dark:bg-gray-900 rounded-full p-1"
                style="transform: translateX(-130%)"
              >
                <UAvatar
                  :src="edu.icon"
                  :alt="edu.institution"
                  size="3xl"
                  class="border-1 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div>
                <h3 class="text-xl font-semibold">{{ edu.degree }}</h3>
                <p class="text-base text-gray-600 dark:text-gray-400">
                  {{ edu.institution }} ●•
                  <UBadge
                    color="niagara"
                    variant="soft"
                    size="lg"
                    >{{ edu.period }}</UBadge
                  >
                </p>
                <p class="text-gray-700 dark:text-gray-300">
                  {{ edu.specialization }}
                </p>
              </div>
            </div>
          </template>
          <i
            >Intensive 24-month master degree program in Carnegie Mellon
            University's College of Engineering, CMU Africa.</i
          >
        </UCard>
      </div>
    </div>
  </section>
</template>
