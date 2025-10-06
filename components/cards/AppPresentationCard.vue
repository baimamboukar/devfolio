<script setup>
  const props = defineProps({
    presentationTitle: {
      type: String,
      default: "",
    },
    presentationCommunity: {
      type: String,
      default: "",
    },
    presentationUrl: {
      type: String,
      default: "#",
    },
    presentationDate: {
      type: String,
      default: "",
    },
    cover: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  });

  const isExternalUrl = computed(() => {
    return props.presentationUrl.startsWith("https://");
  });

  const lastUpdateTime = computed(() => {
    const dateObj = new Date(props.presentationDate);

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  const truncatedTitle = computed(() => {
    const words = props.presentationTitle.split(" ");
    return words.length > 10
      ? words.slice(0, 8).join(" ") + "..."
      : props.presentationTitle;
  });

  const imageRef = ref(null);
  const imageLoaded = ref(false);
  const imageVisible = ref(false);

  const handleImageError = (event) => {
    console.log('Image failed to load:', props.cover);
    // You could set a fallback image here if needed
    // event.target.src = '/fallback-image.jpg';
  };

  const handleImageLoad = () => {
    imageLoaded.value = true;
  };

  // Intersection Observer for lazy loading
  onMounted(() => {
    if (imageRef.value) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              imageVisible.value = true;
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      observer.observe(imageRef.value);
    }
  });
</script>

<template>
  <nuxt-link
    :to="presentationUrl"
    target="_blank"
    class="relative flex flex-col w-[90%] overflow-hidden duration-200 bg-white border focus-visible:global-focus rounded-xl transition border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800/50 hover:ring-2 hover:ring-offset-0 hover:ring-blue-400 hover:ring-opacity-75"
  >
    <div ref="imageRef" class="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
      <!-- Loading placeholder -->
      <div
        v-if="!imageLoaded && imageVisible"
        class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
      >
        <div class="animate-pulse">
          <Icon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <!-- Lazy loaded image -->
      <img
        v-if="imageVisible"
        :src="cover"
        :alt="`${presentationTitle} Talk cover page`"
        :title="presentationTitle"
        :class="[
          'object-cover w-full h-full transition-all duration-300 hover:scale-105',
          imageLoaded ? 'opacity-100' : 'opacity-0'
        ]"
        @load="handleImageLoad"
        @error="handleImageError"
      />

      <!-- Icon overlay -->
      <div
        class="absolute top-2 right-2 p-2 bg-white/30 backdrop-blur-md rounded-lg w-10 h-10 flex justify-center items-center"
      >
        <Icon name="heroicons:arrow-up-right-20-solid" class="text-sky-500" />
      </div>
    </div>
    <div class="flex flex-col items-start justify-center p-4">
      <h3 class="font-semibold">
        {{ truncatedTitle }}
      </h3>

      <!-- <p class="text-[.825rem] text-zinc-600 dark:text-zinc-400">
        {{ presentationDescription }}
      </p> -->
      <div
        class="flex items-center mt-2 text-[.825rem] text-zinc-600 dark:text-zinc-400"
      >
        <span class="text-[.825rem] text-zinc-600 dark:text-zinc-400"
          >{{ presentationCommunity }} | {{ lastUpdateTime }}</span
        >
      </div>
    </div>
  </nuxt-link>
</template>

<style>
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
