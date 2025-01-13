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
      required: true
    }
  });

  const emit = defineEmits(['update:modelValue']);

  const downloadImage = (imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageUrl.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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
      <div class="p-6 border-b border-gray-200 dark:border-gray-800">
        <div class="flex items-center justify-between mb-4">
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

      <!-- Gallery Content -->
      <div class="flex-1 overflow-auto p-6">
        <div class="grid grid-cols-12 gap-4 auto-rows-[200px]">
          <!-- Highlight Image - Large Center -->
          <div class="col-span-12 md:col-span-6 md:col-start-4 row-span-2">
            <div class="relative h-full rounded-xl overflow-hidden group">
              <img
                :src="highlightImage"
                :alt="title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="downloadImage(highlightImage)"
                  class="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                >
                  <UIcon
                    name="i-heroicons-arrow-down-circle"
                    class="w-5 h-5 text-white"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Surrounding Images - Different Sizes -->
          <template v-for="(image, index) in images" :key="index">
            <div
              :class="[
                'relative group rounded-xl overflow-hidden',
                index % 3 === 0 ? 'col-span-6 md:col-span-3 row-span-2' : 
                index % 2 === 0 ? 'col-span-6 md:col-span-3 row-span-1' : 
                'col-span-6 md:col-span-3 row-span-1',
                index < images.length/2 ? 'md:col-start-1' : 'md:col-start-10'
              ]"
            >
              <img
                :src="image"
                :alt="`Gallery image ${index + 1}`"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="downloadImage(image)"
                  class="absolute bottom-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                >
                  <UIcon
                    name="i-heroicons-arrow-down-circle"
                    class="w-5 h-5 text-white"
                  />
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </UModal>
</template>
