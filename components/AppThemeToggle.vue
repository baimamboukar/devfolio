<script setup>
const { $colorMode } = useNuxtApp();

const toggleTheme = () => {
  $colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark';
};

const isDark = computed(() => $colorMode.preference === 'dark');
</script>

<!-- Theme Toggle -->
<template>
  <button
    @click="toggleTheme"
    class="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none transition-colors duration-200"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Icon
      :name="isDark ? 'heroicons:sun-20-solid' : 'heroicons:moon-20-solid'"
      class="w-4 h-4"
    />
  </button>
</template>
