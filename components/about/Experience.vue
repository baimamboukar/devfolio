<script setup>
  // Define props for experience data
  const props = defineProps({
    experience: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Professional Experience</h2>
    <div class="grid gap-8">
      <div v-for="(exp, index) in experience" :key="index">
        <UCard
          class="overflow-hidden hover:ring-2 hover:ring-primary-500 transition-all duration-300"
          :ui="{ body: { padding: 'p-0' } }"
        >
          <!-- Main Content -->
          <div class="p-6">
            <!-- Header with Logo and Title -->
            <div class="flex flex-col md:flex-row gap-6 items-start">
              <UAvatar
                :src="exp.icon"
                :alt="exp.company"
                size="2xl"
                class="rounded-lg bg-white dark:bg-gray-800 p-2"
              />
              <div class="flex-1">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3
                      class="text-xl font-bold text-primary-600 dark:text-primary-400"
                    >
                      {{ exp.title }}
                    </h3>
                    <p class="text-lg font-medium">{{ exp.company }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <UIcon name="i-heroicons-map-pin" class="text-gray-500" />
                    <span
                      class="text-gray-600 dark:text-gray-400"
                      >{{ exp.location }}</span
                    >
                  </div>
                </div>
                <UBadge color="gray" variant="soft" class="mt-2">
                  {{ exp.period }}
                </UBadge>
              </div>
            </div>
            <!-- Expandable Responsibilities Button -->
            <UButton
              v-if="exp.responsibilities"
              color="gray"
              variant="ghost"
              class="mt-4 w-full justify-between group"
              @click="exp.isOpen = !exp.isOpen"
            >
              <span>Key Responsibilities</span>
              <UIcon
                :name="exp.isOpen ? 'i-heroicons-minus-small' : 'i-heroicons-plus-small'"
                class="transition-transform"
              />
            </UButton>
          </div>

          <!-- Responsibilities Section -->
          <UCollapsible :model-value="exp.isOpen">
            <div class="px-6 pb-6 space-y-3">
              <div
                v-for="(resp, rIndex) in exp.responsibilities"
                :key="rIndex"
                class="flex gap-3 items-start"
              >
                <UIcon
                  name="i-heroicons-arrow-right"
                  class="flex-shrink-0 mt-1 text-primary-500"
                />
                <p class="text-gray-700 dark:text-gray-300">{{ resp }}</p>
              </div>
            </div>
          </UCollapsible>
        </UCard>
      </div>
    </div>
  </section>
</template>
