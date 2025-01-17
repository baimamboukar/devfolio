<script setup>
  // Define page metadata for SEO purposes
  definePageMeta({
    title: "About",
    description: "Learn more about Baimam Boukar, his interests, education, experience, and achievements.",
  });

  // Fetch the content data from the `about.yaml` file using Nuxt Content
  const { data, pending } = await useAsyncData('about', () => queryContent('about').findOne());
  const orientation = ref('horizontal');
  // Define tabs for different sections
  const tabs = [
    {
      label: 'Overview',
      icon: 'i-heroicons-user',
      slot: 'overview',
      description: 'Personal information and interests'
    },
    {
      label: 'Education',
      icon: 'i-heroicons-academic-cap',
      slot: 'education',
      description: 'Academic background and qualifications'
    },
    {
      label: 'Experience',
      icon: 'i-heroicons-briefcase',
      slot: 'experience',
      description: 'Professional work experience'
    },
    {
      label: 'Certifications',
      icon: 'i-heroicons-document-check',
      slot: 'certifications',
      description: 'Professional certifications and badges'
    },
    {
      label: 'Leadership',
      icon: 'i-heroicons-user-group',
      slot: 'leadership',
      description: 'Leadership roles and responsibilities'
    },
    {
      label: 'Events',
      icon: 'i-heroicons-calendar',
      slot: 'events',
      description: 'Hackathons, conferences and achievements'
    }
  ];
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Show skeleton while loading -->
    <template v-if="pending">
      <USkeleton class="h-32 mb-12" />
      <USkeleton v-for="i in 5" :key="i" class="h-64 mb-12" />
    </template>

    <template v-else>
      <UTabs
        :items="tabs"
        variant="pills"
        class="gap-4 w-full"
        :orientation="orientation.value"
      >
        <!-- Overview Tab -->
        <template #overview="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <Summary :overview="data.overview" />
          <Interests :interests="data.interests" />
        </template>

        <!-- Education Tab -->
        <template #education="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <Education :education="data.education" />
        </template>

        <!-- Experience Tab -->
        <template #experience="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <Experience :experience="data.experience" />
        </template>

        <!-- Certifications Tab -->
        <template #certifications="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <Certifications :certifications="data.certifications" />
        </template>

        <!-- Leadership Tab -->
        <template #leadership="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <Leadership :leadership="data.leadership" />
        </template>

        <!-- Events Tab -->
        <template #events="{ item }">
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            {{ item.description }}
          </p>
          <div class="space-y-12">
            <Conferences :conferences="data.conferences" />
            <Hackathons :hackathons="data.hackathons" />
            <Achievements :achievements="data.achievements" />
          </div>
        </template>
      </UTabs>
    </template>
  </div>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
