<script setup>
const route = useRoute();
const { data, pending } = await useAsyncData('about', () => queryContent('about').findOne());

const tab = computed(() => route.params.tab);

// SEO
useSeoMeta({
  title: () => {
    const t = tab.value;
    return t ? `${t.charAt(0).toUpperCase() + t.slice(1)} | About` : 'About';
  },
  description: () => `Learn about my ${tab.value}.`
});
</script>

<template>
  <div>
    <template v-if="pending">
        <USkeleton class="h-64" />
    </template>
    <template v-else-if="data">
        <!-- Education -->
        <template v-if="tab === 'education'">
            <Education :education="data.education" />
        </template>

        <!-- Experience -->
        <template v-else-if="tab === 'experience'">
            <Experience :experience="data.experience" />
        </template>

        <!-- Credentials -->
        <template v-else-if="tab === 'credentials'">
            <div class="space-y-12">
                <div>
                  <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                    Certifications
                    <span class="flex-grow h-px ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-zinc-700"></span>
                  </h3>
                  <Certifications :certifications="data.certifications" />
                </div>
                
                <div>
                  <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
                    Achievements
                    <span class="flex-grow h-px ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-zinc-700"></span>
                  </h3>
                  <AchievementsExpandable :achievements="data.achievements" />
                </div>
            </div>
        </template>

        <!-- Leadership -->
        <template v-else-if="tab === 'leadership'">
            <Leadership :leadership="data.leadership" />
        </template>

        <!-- Events -->
        <template v-else-if="tab === 'events'">
            <Events 
              :conferences="data.conferences" 
              :hackathons="data.hackathons" 
            />
        </template>
        
        <!-- 404 for unknown tab -->
        <div v-else class="text-center py-12">
            <p class="text-gray-500">Section not found.</p>
        </div>
    </template>
  </div>
</template>
