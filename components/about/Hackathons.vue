<script setup>
  // Define props for hackathons data
  const props = defineProps({
    hackathons: {
      type: Array,
      required: true
    }
  });
</script>

<template>
  <section class="mb-12">
    <h2 class="text-2xl font-bold mb-8">Hackathons</h2>
    <div class="space-y-6">
      <div
        v-for="(hackathon, index) in hackathons"
        :key="hackathon.name"
        class="relative"
      >
        <!-- Dashed connector line -->
        <div
          v-if="index !== hackathons.length - 1"
          class="absolute left-20 top-28 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 dark:border-gray-700"
        />
        <UCard class="bg-gray-50 dark:bg-gray-900/50 cursor-pointer">
          <div class="relative">
            <nuxt-img
              :src="hackathon.icon"
              :alt="hackathon.name"
              width="100"
              height="100"
              sizes="200px sm:100px md:150px"
              placeholder="[50, 25, 75, 5]"
              class="absolute bg-white dark:bg-gray-800 rounded-lg"
            />
            <div class="ml-32 min-h-[160px]">
              <UBadge
                color="sky"
                variant="subtle"
                class="absolute top-0 right-4"
              >
                {{ hackathon.date }}
              </UBadge>
              <div class="space-y-1 pt-0">
                <h3 class="text-xl font-semibold">{{ hackathon.name }}</h3>
                <div class="space-y-1 text-gray-600 dark:text-gray-400">
                  <p>Organized by {{ hackathon.by }}</p>
                  <p class="text-blue-400">{{ hackathon.place }}</p>
                </div>
              </div>
              <UButton
                color="sky"
                variant="ghost"
                size="sm"
                class="absolute bottom-4 right-4"
              >
                View Details
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </section>
</template>
