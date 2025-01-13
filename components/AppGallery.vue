<script setup>
  defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    highlightImage: {
      type: String,
      required: true
    },
    images: {
      type: Array,
      required: true,
      validator: (value) => value.length === 6
    }
  });

  const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <UModal
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    fullscreen
    :ui="{
      container: 'flex flex-col h-screen',
      overlay: { background: 'bg-gray-900/95' },
      base: 'h-screen'
    }"
  >
    <div class="h-full flex flex-col">
      <!-- Header -->
      <div class="p-3 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-1">
          <h2 class="text-2xl font-bold">{{ title }}</h2>
          <UButton
            icon="i-heroicons-x-mark"
            color="gray"
            variant="ghost"
            @click="emit('update:modelValue', false)"
          />
        </div>
        <p class="text-gray-600 dark:text-gray-400">{{ description }}</p>
      </div>

      <!-- Gallery Grid -->
      <div class="flex-1 flex items-center justify-center">
        <div class="staggered-grid">
          <!-- Left Column -->
          <div class="grid-column">
            <nuxt-img :src="images[0]" class="grid-item tall" loading="lazy" />
            <nuxt-img :src="images[1]" class="grid-item" loading="lazy" />
          </div>

          <!-- Center Column -->
          <div class="grid-column">
            <nuxt-img :src="images[2]" class="grid-item" loading="lazy" />
            <nuxt-img :src="highlightImage" class="grid-item" loading="lazy" />
            <nuxt-img :src="images[3]" class="grid-item" loading="lazy" />
          </div>

          <!-- Right Column -->
          <div class="grid-column">
            <nuxt-img :src="images[4]" class="grid-item tall" loading="lazy" />
            <nuxt-img :src="images[5]" class="grid-item" loading="lazy" />
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

<style scoped>
  .staggered-grid {
    display: flex;
    gap: 4px;
    width: min(800px, 90%);
    height: calc(100vh - 100px);
    padding: 4px;
  }

  .grid-column {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .grid-item {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    cursor: pointer; /* Added cursor pointer */
    transition: transform 0.3s ease-out; /* Added transition for smooth animation */
  }

  .grid-item.tall {
    aspect-ratio: 3/5;
  }

  .grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Added hover animation */
  .grid-item:hover {
    transform: scale(1.03);
    z-index: 1; /* Ensures the scaled image appears above others */
  }

  @media (max-width: 768px) {
    .staggered-grid {
      width: 95%;
    }
  }
</style>
