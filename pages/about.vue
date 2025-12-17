<script setup>
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const route = useRoute();

definePageMeta({
  title: "About",
  description: "Learn more about Baimam Boukar, his interests, education, experience, and achievements.",
});

const tabs = [
  {
    label: 'Education',
    icon: 'arcticons:china-university-mooc',
    to: '/about/education',
    description: 'Academic background and qualifications'
  },
  {
    label: 'Experience',
    icon: 'hugeicons:new-job',
    to: '/about/experience',
    description: 'Professional work experience'
  },
  {
    label: 'Credentials',
    icon: 'heroicons:check-badge',
    to: '/about/credentials',
    description: 'Professional certifications and achievements'
  },
  {
    label: 'Leadership',
    icon: 'material-symbols-light:social-leaderboard-outline-rounded',
    to: '/about/leadership',
    description: 'Leadership roles and responsibilities'
  },
  {
    label: 'Events',
    icon: 'heroicons:calendar',
    to: '/about/events',
    description: 'Hackathons, conferences and achievements'
  }
];

// Helper to determine if a tab is active
const isTabActive = (path) => route.path.includes(path);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4">
    <!-- Custom Tab Navigation -->
    <div class="flex flex-col sm:flex-row gap-2 mb-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="flex items-center gap-2 px-4 py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border"
        :class="[
          isTabActive(tab.to)
            ? 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800'
            : 'text-gray-600 border-transparent dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        ]"
      >
        <Icon :name="tab.icon" class="w-5 h-5" />
        {{ tab.label }}
      </NuxtLink>
    </div>

    <!-- Content Area (Child Routes) -->
    <NuxtPage />
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>