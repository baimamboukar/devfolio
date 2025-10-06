<script setup>
  definePageMeta({
    layout: "project-layout",
  });

  useHead({
    titleTemplate: "%s (Project) · Baimam Boukar",
  });

  const route = useRoute();

  // Get project slug from route
  const projectSlug = computed(() => {
    const pathSegments = route.path.split('/').filter(Boolean);
    return pathSegments[pathSegments.length - 1];
  });

  // Fetch project data from the new configurable structure
  const { data: projectData } = await useAsyncData("get-project", () =>
    queryContent(route.path).findOne()
  );

  const project = computed(() => projectData.value);

  const serverMeta = {
    ogType: "article",
    ogLocale: "en_US",
    twitterCard: "summary",
    twitterCreator: "@baimamboukar",
  };

  useSeoMeta({
    title: () => project.value?.title,
    description: () => project.value?.description,
    ogTitle: () => `${project.value?.title} (Project) · Baimam Boukar`,
    twitterTitle: () => `${project.value?.title} (Project) · Baimam Boukar`,
    ogDescription: () => project.value?.description,
    twitterDescription: () => project.value?.description,
    ogImage: () => project.value?.image,
    twitterImage: () => project.value?.image,
    ogUrl: () => `https://baimamboukar.dev${route.path}`,
    ...serverMeta,
  });

  // Image loading state
  const imageRef = ref(null);
  const imageLoaded = ref(false);
  const imageError = ref(false);
  const imageInView = ref(false);

  // Image handlers
  const handleImageLoad = () => {
    imageLoaded.value = true;
    imageError.value = false;
  };

  const handleImageError = () => {
    imageLoaded.value = false;
    imageError.value = true;
  };

  // Intersection Observer for lazy loading
  onMounted(() => {
    if (imageRef.value && project.value?.image) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              imageInView.value = true;
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '100px',
          threshold: 0.1
        }
      );

      observer.observe(imageRef.value);
    } else {
      // If no image element or image URL, set as in view immediately
      imageInView.value = true;
    }
  });

  // Helper function to get icon based on tech stack
  const getTechIcon = (tech) => {
    const techIcons = {
      'Flutter': 'logos:flutter',
      'Vue': 'logos:vue',
      'React': 'logos:react',
      'Next.js': 'logos:nextjs-icon',
      'Nuxt': 'logos:nuxt-icon',
      'TailwindCSS': 'logos:tailwindcss-icon',
      'TypeScript': 'logos:typescript-icon',
      'JavaScript': 'logos:javascript',
      'Python': 'logos:python',
      'Firebase': 'logos:firebase',
      'Vercel': 'logos:vercel-icon',
      'GitHub': 'logos:github-icon',
      'Node.js': 'logos:nodejs-icon',
      'Express': 'logos:express',
      'MongoDB': 'logos:mongodb-icon',
      'PostgreSQL': 'logos:postgresql',
      'Docker': 'logos:docker-icon',
      'AWS': 'logos:aws',
      'Dart': 'logos:dart',
      'Flask': 'logos:flask',
    };
    return techIcons[tech] || 'heroicons:code-bracket';
  };
</script>

<template>
  <div v-if="project" class="max-w-6xl mx-auto px-4">
    <!-- Breadcrumb Navigation -->
    <nav class="mb-6">
      <ul class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 list-none">
        <li>
          <nuxt-link
            to="/projects"
            class="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            Projects
          </nuxt-link>
        </li>
        <Icon name="i-heroicons-chevron-right" class="w-4 h-4" />
        <li class="text-gray-900 dark:text-gray-100 font-medium">{{ project.title }}</li>
      </ul>
    </nav>

    <!-- Project Header -->
    <header class="mb-8">
      <!-- Project Title -->
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        {{ project.title }}
      </h1>

      <!-- Project Description -->
      <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
        {{ project.description }}
      </p>
    </header>

    <!-- Project Image -->
    <section v-if="project.image" ref="imageRef" class="mb-8">
      <div class="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 min-h-64">
        <!-- Skeleton Loading -->
        <div
          v-if="!imageLoaded && !imageError"
          class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <div class="flex flex-col items-center gap-4">
            <!-- Skeleton bars -->
            <div class="space-y-3 w-full max-w-sm px-8">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded-full w-5/6"></div>
              </div>
            </div>
            <!-- Loading text with spinner -->
            <div v-if="imageInView" class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <div class="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-sky-500 rounded-full animate-spin"></div>
              <span class="text-sm">Loading image...</span>
            </div>
            <!-- Waiting for scroll -->
            <div v-else class="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Icon name="i-heroicons-photo" class="w-4 h-4" />
              <span class="text-sm">Image will load when scrolled into view</span>
            </div>
          </div>
        </div>

        <!-- Actual Image -->
        <img
          v-if="imageInView"
          :src="project.image"
          :alt="`${project.title} preview`"
          :class="[
            'w-full h-auto max-h-96 object-cover transition-all duration-700 ease-out',
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          ]"
          @load="handleImageLoad"
          @error="handleImageError"
        />

        <!-- Error State -->
        <div
          v-if="imageError"
          class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800"
        >
          <div class="text-center">
            <Icon name="i-heroicons-photo" class="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500 dark:text-gray-400 text-sm">Failed to load image</p>
            <button
              @click="imageError = false; imageInView = true"
              class="mt-2 text-xs text-sky-500 hover:text-sky-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Actions and Tags -->
    <div class="mb-8">
      <!-- Project Actions -->
      <div class="flex flex-wrap gap-3 mb-6">
        <a
          v-if="project.live_url"
          :href="project.live_url"
          target="_blank"
          class="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
        >
          <Icon name="i-heroicons-arrow-top-right-on-square" class="w-4 h-4 mr-2" />
          Live Demo
        </a>
        <a
          v-if="project.source_url"
          :href="project.source_url"
          target="_blank"
          class="inline-flex items-center px-4 py-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
        >
          <Icon name="i-heroicons-code-bracket" class="w-4 h-4 mr-2" />
          Source Code
        </a>
      </div>

      <!-- Project Tags -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="px-3 py-1 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded-full"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Project Content Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-3 space-y-6">
        <!-- About the Project -->
        <section class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
            About the Project
          </h2>
          <div class="prose dark:prose-invert max-w-none">
            <p v-for="paragraph in project.about" :key="paragraph" class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ paragraph }}
            </p>
          </div>
        </section>
      </div>

      <!-- Sidebar -->
      <div class="lg:col-span-2">
        <!-- Project Info & Stack -->
        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1.5">Project Details</h3>
          <div class="space-y-4">
            <!-- Status -->
            <div v-if="project.status">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</span>
              <span class="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                {{ project.status }}
              </span>
            </div>

            <!-- Role -->
            <div>
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Role</span>
              <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-gray-100">{{ project.role || 'Solo Developer' }}</span>
                <a
                  v-if="project.team && project.team.name && project.team.url"
                  :href="project.team.url"
                  target="_blank"
                  class="text-sky-500 hover:text-sky-600 dark:text-sky-400 dark:hover:text-sky-300 text-sm transition-colors"
                >
                  ({{ project.team.name }})
                </a>
                <span v-else-if="project.team && project.team.name" class="text-gray-600 dark:text-gray-400 text-sm">
                  ({{ project.team.name }})
                </span>
              </div>
            </div>

            <!-- Stack -->
            <div v-if="project.stack">
              <span class="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Stack</span>
              <div class="flex flex-wrap gap-2">
                <div
                  v-for="tech in project.stack"
                  :key="tech"
                  class="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <Icon :name="getTechIcon(tech)" class="w-4 h-4" />
                  <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ tech }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Milestones - Full Width -->
    <section v-if="project.milestones" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mt-8">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1.5">
        Milestones
      </h2>
      <ul class="space-y-2">
        <li
          v-for="milestone in project.milestones"
          :key="milestone.title"
          class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
        >
          <div class="w-2 h-2 rounded-full bg-sky-500 mt-2 flex-shrink-0"></div>
          <div>
            <span class="font-medium">{{ milestone.title }}</span>
            <span class="text-gray-500 dark:text-gray-400 text-sm"> - {{ milestone.date }}</span>
            <p v-if="milestone.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ milestone.description }}</p>
          </div>
        </li>
      </ul>
    </section>
  </div>

  <!-- Not Found State -->
  <div v-else class="text-center py-12">
    <Icon name="i-heroicons-exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Project Not Found</h1>
    <p class="text-gray-600 dark:text-gray-400 mb-6">The project you're looking for doesn't exist.</p>
    <nuxt-link
      to="/projects"
      class="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
    >
      <Icon name="i-heroicons-arrow-left" class="w-4 h-4 mr-2" />
      Back to Projects
    </nuxt-link>
  </div>
</template>
