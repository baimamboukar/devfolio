<script setup>
defineProps({
  engagement: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      How I am building my foundations in AI safety research — through
      mentored research, structured training, and hands-on replications.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <component
        :is="item.link ? 'a' : 'div'"
        v-for="item in engagement"
        :key="item.title"
        :href="item.link || undefined"
        :target="item.link ? '_blank' : undefined"
        class="group bg-white dark:bg-zinc-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-sky-400 dark:hover:border-sky-500 transition-all"
      >
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
            <Icon :name="item.icon" class="w-5 h-5 text-sky-600 dark:text-sky-400" />
          </div>
          <div class="min-w-0">
            <div class="flex items-start justify-between gap-2">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {{ item.title }}
              </h3>
              <Icon
                v-if="item.link"
                name="heroicons:arrow-up-right-20-solid"
                class="w-4 h-4 text-sky-500 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <p class="text-xs text-gray-400 dark:text-gray-500 mb-2">{{ item.period }}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </component>
    </div>
  </section>
</template>
