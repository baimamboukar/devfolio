<script setup>
  definePageMeta({
    title: "Presentations",
    description: "Discover my different talks and interventions at Tech events",
  });

  // Fetch all featured projects
  const { pending, data: allPresentations } = await useLazyAsyncData(
    "talks",
    () =>
      queryContent("/presentations")
       .sort({ date: -1 }) // Sort by date in descending order
        // .where({ title: { $ne: "More" } })
        .find()
  );
</script>

<!-- Projects Page -->
<template>
  <article>
    <h1 class="mb-4 text-3xl font-bold text-left">Presentations</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      I love sharing what I know with a broad and diverse audience at tech
      events.
    </p>
    <!-- Featured Presentation -->
    <section
      class="grid grid-cols-1 lg:grid-cols-2 gap-x-auto gap-y-10 mb-6 w-full justify-evently"
    >
      <!-- <template v-if="error"> Something occurred ooooh</template> -->
      <template v-if="pending">
        <app-project-skeleton
          v-for="skeletonId in generateKeys(5)"
          :key="skeletonId"
        />
      </template>
      <template v-else>
        <app-presentation-card
          v-for="presentation in allPresentations"
          :key="presentation.id"
          :cover="presentation.cover"
          :icon="presentation.icon"
          :presentation-title="presentation.title"
          :presentation-community="presentation.community"
          :presentation-date="presentation.date"
          :presentation-url="presentation.url"
        />
      </template>
    </section>
    <!-- Link to More Projects -->
    <!-- <nuxt-link
      to="/projects/more"
      class="flex items-center justify-center w-24 py-2 font-semibold no-underline duration-150 bg-blue-500 rounded-md focus-visible:global-focus text-zinc-800 group/hover-effect"
      >More
      <Icon
        name="heroicons:chevron-right-20-solid"
        class="ml-1 group-hover/hover-effect:translate-x-1"
      />
    </nuxt-link> -->
  </article>
</template>
