<script setup>
import { computed } from 'vue';

// Define props for leadership data
const props = defineProps({
  leadership: {
    type: Array,
    required: true
  }
});

// Keywords to identify service/volunteering roles
const serviceKeywords = ['Reviewer', 'Volunteer', 'Contributor', 'Builder', 'Member'];

const leadershipRoles = computed(() => {
  return props.leadership.filter(item => 
    !serviceKeywords.some(keyword => item.role.includes(keyword))
  );
});

const serviceRoles = computed(() => {
  return props.leadership.filter(item => 
    serviceKeywords.some(keyword => item.role.includes(keyword))
  );
});
</script>

<template>
  <section class="mb-12">
    <div class="space-y-12">
      <!-- Leadership Section -->
      <div v-if="leadershipRoles.length > 0">
        <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          Community Leadership
          <span class="flex-grow h-px ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-zinc-700"></span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="leader in leadershipRoles"
            :key="leader.role + leader.community"
            class="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div class="flex items-start gap-4">
              <!-- Icon Container -->
              <div class="flex-shrink-0 w-14 h-14 rounded-lg bg-gray-50 dark:bg-zinc-800 p-2 border border-gray-100 dark:border-zinc-700 flex items-center justify-center">
                <NuxtImg
                  v-if="leader.icon && leader.icon.startsWith('http')"
                  :src="leader.icon"
                  :alt="leader.role"
                  width="56"
                  height="56"
                  format="webp"
                  loading="lazy"
                  class="w-full h-full object-contain"
                />
                <img
                  v-else-if="leader.icon && leader.icon.startsWith('/')"
                  :src="leader.icon"
                  :alt="leader.role"
                  class="w-full h-full object-contain"
                />
                <Icon v-else :name="leader.icon || 'i-heroicons-user-group'" class="w-8 h-8 text-gray-500" />
              </div>
              
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {{ leader.role }}
                </h4>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ leader.community }}
                </p>
                <div class="mt-2 flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700">
                    {{ leader.period }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Volunteering & Service Section -->
      <div v-if="serviceRoles.length > 0">
        <h3 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center">
          Volunteering and Service 
          <span class="flex-grow h-px ml-4 bg-gradient-to-r from-gray-200 to-transparent dark:from-zinc-700"></span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="volunteer in serviceRoles"
            :key="volunteer.role + volunteer.community"
            class="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 hover:border-sky-400 dark:hover:border-sky-500 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <div class="flex items-start gap-4">
              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h4 class="text-base font-bold text-gray-900 dark:text-gray-100 leading-tight mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {{ volunteer.role }}
                </h4>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ volunteer.community }}
                </p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-zinc-700">
                    {{ volunteer.period }}
                  </span>
                </div>
                <p v-if="volunteer.description" class="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-zinc-800 pt-2">
                  {{ volunteer.description }}
                </p>
              </div>
              
               <!-- Optional Icon for Volunteering too -->
               <div v-if="volunteer.icon" class="flex-shrink-0">
                  <NuxtImg
                    v-if="volunteer.icon.startsWith('http')"
                    :src="volunteer.icon"
                    :alt="volunteer.role"
                    width="40"
                    height="40"
                    format="webp"
                    loading="lazy"
                    class="w-10 h-10 object-contain opacity-80"
                  />
                  <img
                    v-else-if="volunteer.icon.startsWith('/')"
                    :src="volunteer.icon"
                    :alt="volunteer.role"
                    class="w-10 h-10 object-contain opacity-80"
                  />
                  <Icon v-else :name="volunteer.icon" class="w-6 h-6 text-gray-400" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
