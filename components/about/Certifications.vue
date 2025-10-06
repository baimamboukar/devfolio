<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  certifications: {
    type: Array,
    required: true
  }
});

const selectedCert = ref(null);
const hoveredIndex = ref(null);
const selectedCategory = ref('all');

// Extract unique categories from certifications
const categories = computed(() => {
  const cats = new Set(['all']);
  props.certifications.forEach(cert => {
    if (cert.category) cats.add(cert.category);
  });
  return Array.from(cats);
});

// Filter certifications based on category
const filteredCertifications = computed(() => {
  if (selectedCategory.value === 'all') {
    return props.certifications;
  }
  return props.certifications.filter(cert => cert.category === selectedCategory.value);
});

const selectCert = (cert) => {
  selectedCert.value = selectedCert.value === cert ? null : cert;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

</script>

<template>
  <section class="space-y-6">
    <!-- Category Filter (if categories exist) -->
    <div v-if="categories.length > 1" class="flex gap-2 flex-wrap">
      <button
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-all',
          selectedCategory === category
            ? 'bg-sky-500 text-white dark:bg-sky-600'
            : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
        ]"
      >
        {{ category === 'all' ? 'All' : category }}
      </button>
    </div>

    <!-- Certifications Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TransitionGroup name="cert">
        <div
          v-for="(cert, index) in filteredCertifications"
          :key="cert.name"
          @click="selectCert(cert)"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
          :class="[
            'relative group cursor-pointer',
            'bg-white dark:bg-zinc-900/50 backdrop-blur-sm',
            'border border-gray-200 dark:border-zinc-700',
            'rounded-xl overflow-hidden',
            'transition-all duration-300',
            selectedCert === cert
              ? 'ring-2 ring-sky-500 dark:ring-sky-400 shadow-lg scale-[1.02]'
              : 'hover:shadow-md hover:scale-[1.01]',
            hoveredIndex === index && 'shadow-lg'
          ]"
        >
          <!-- Badge Container -->
          <div class="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900">
            <!-- View on Credly Button (shows on hover) -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div
                v-if="hoveredIndex === index && cert.credentialUrl"
                class="absolute top-2 right-2 z-10"
              >
                <a
                  :href="cert.credentialUrl"
                  target="_blank"
                  @click.stop
                  class="px-3 py-1 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm text-xs font-medium text-sky-600 dark:text-sky-400 rounded-full hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-lg"
                >
                  View on Credly →
                </a>
              </div>
            </Transition>

            <!-- Certificate Badge Image -->
            <div class="relative">
              <img
                :src="cert.badge"
                :alt="cert.name"
                class="w-24 h-24 mx-auto object-contain transition-transform duration-300"
                :class="[
                  hoveredIndex === index && 'scale-110 rotate-3'
                ]"
              />

              <!-- Glow Effect on Hover -->
              <div
                v-if="hoveredIndex === index"
                class="absolute inset-0 bg-sky-400/20 dark:bg-sky-500/20 blur-xl rounded-full animate-pulse"
              />
            </div>
          </div>

          <!-- Certificate Details -->
          <div class="p-4 space-y-2">
            <h3 class="font-semibold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2">
              {{ cert.name }}
            </h3>

            <div class="flex items-center justify-between">
              <p v-if="cert.issuer" class="text-xs text-gray-500 dark:text-gray-400">
                {{ cert.issuer }}
              </p>
              <p v-if="cert.date" class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatDate(cert.date) }}
              </p>
            </div>

            <!-- Skills/Tags -->
            <div v-if="cert.skills && cert.skills.length" class="pt-2">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in cert.skills.slice(0, 3)"
                  :key="skill"
                  class="text-xs px-2 py-0.5 bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
                >
                  {{ skill }}
                </span>
                <span
                  v-if="cert.skills.length > 3"
                  class="text-xs px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full"
                >
                  +{{ cert.skills.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Interactive Overlay (for additional actions if needed) -->
          <div
            v-if="selectedCert === cert && cert.description"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-zinc-900 dark:via-zinc-900/95 dark:to-transparent p-4"
          >
            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
              {{ cert.description }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredCertifications.length === 0"
      class="text-center py-12"
    >
      <Icon name="i-heroicons-academic-cap" class="w-16 h-16 mx-auto text-gray-300 dark:text-zinc-600 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">No certifications found</p>
      <button
        v-if="selectedCategory !== 'all'"
        @click="selectedCategory = 'all'"
        class="mt-4 text-sm text-sky-600 dark:text-sky-400 hover:underline"
      >
        Show all certifications
      </button>
    </div>

  </section>
</template>

<style scoped>
.cert-enter-active,
.cert-leave-active {
  transition: all 0.3s ease;
}

.cert-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.cert-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.cert-move {
  transition: transform 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>