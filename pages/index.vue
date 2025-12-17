<script setup>
// Static page meta
definePageMeta({
  title: "Baimam Boukar Jean Jacques",
  description: "Graduate Researcher, CMU Africa. Interrested in Interdisciplinary research at the intersection AI and Space Exploration.",
});

// Load centralized configuration
const { config: siteConfig } = await useSiteConfig();
const { content: homepageContent } = await useHomepageContent();
const { getMessage } = await useUIMessages();

// Dynamic head configuration (SEO)
useHead({
  titleTemplate: siteConfig?.seo.title_template || "Baimam Boukar JJ",
  title: siteConfig?.personal.name || "Baimam Boukar Jean Jacques",
  meta: [
    {
      name: 'description',
      content: 'Graduate Researcher, CMU Africa. Interrested in Interdisciplinary research at the intersection AI and Space Exploration.'
    }
  ]
});

const route = useRoute();

useSeoMeta({
  ogTitle: () => siteConfig?.personal.name || route.meta.title,
  twitterTitle: () => siteConfig?.personal.name || route.meta.title,
  ogDescription: () => siteConfig?.personal.tagline,
  twitterDescription: () => siteConfig?.personal.tagline,
  twitterCreator: () => siteConfig?.seo.twitter_creator,
});

// Fetch featured projects (limit 5)
const { data: featuredProjects } = await useLazyAsyncData(
  "homex-projects",
  () => queryContent("/projects")
    .where({ title: { $ne: "More" }, featured: true })
    .limit(5)
    .find()
);

// Fetch featured research (limit 3)
const { data: featuredResearchData } = await useLazyAsyncData(
  "homex-research",
  () => queryContent("/research").findOne()
);
const featuredResearch = computed(() => {
  return featuredResearchData.value?.research?.filter(r => r.featured).slice(0, 3) || [];
});

// Tech Stack Data
const techStack = [
  { name: 'Python', icon: 'logos:python' },
  { name: 'NumPy', icon: 'logos:numpy' },
  { name: 'PyTorch', icon: 'logos:pytorch-icon' },
  { name: 'TensorFlow', icon: 'logos:tensorflow' },
  { name: 'CUDA', icon: 'simple-icons:nvidia' },
  { name: 'FastAPI', icon: 'simple-icons:fastapi' },
  { name: 'Vue', icon: 'logos:vue' },
  { name: 'Nuxt', icon: 'logos:nuxt-icon' },
  { name: 'Flutter', icon: 'logos:flutter' },
  { name: 'Dart', icon: 'logos:dart' },
  { name: 'Go', icon: 'logos:go' },
  { name: 'Google Cloud', icon: 'logos:google-cloud' },
  { name: 'AWS', icon: 'logos:aws' },
  { name: 'Docker', icon: 'logos:docker-icon' },
  { name: 'K8s', icon: 'logos:kubernetes' },
  { name: 'GitHub', icon: 'simple-icons:github' },
  { name: 'GitHub Actions', icon: 'logos:github-actions' },
  { name: 'Hugging Face', icon: 'simple-icons:huggingface' },
  // { name: 'Kaggle', icon: 'simple-icons:kaggle' },
  { name: 'Linux', icon: 'logos:linux-tux' },
  { name: 'Google Play', icon: 'simple-icons:googleplay' },
  // { name: 'LaTeX', icon: 'file-icons:latex' },
  { name: 'Overleaf', icon: 'simple-icons:overleaf' },
];

// Debug function for development
</script>

<template>
  <div class="space-y-16 py-8">
    
    <!-- 1. Hero Section: 2-Column Layout -->
    <section class="max-w-5xl mx-auto px-4">
      <div class="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16">
        
        <!-- Text Column (Left) -->
        <div class="flex-1 space-y-6 text-center md:text-left">
          <div>
            <h1 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
              {{ homepageContent?.hero.greeting || "Hi, I'm Baimam Boukar" }}
              <span class="inline-block ml-1 origin-[70%_70%] animate-[10s_ease_2s_infinite_wave] hover:animate-[1.5s_ease_hoverwave]">{{ homepageContent?.hero.emoji || "👋" }}</span>
            </h1>
          </div>

          <p class="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0 text-justify">
            {{ homepageContent?.hero.introduction }}
          </p>
        </div>

        <!-- Image Column (Right) -->
        <div class="flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 relative">
          <img
            :src="siteConfig?.personal.photo || '/self.jpg'"
            alt="Profile"
            class="w-full h-full object-cover rounded-2xl shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500"
          />
          <!-- Decorative element behind -->
          <div class="absolute inset-0 bg-sky-100 dark:bg-sky-900/30 rounded-2xl -z-10 -rotate-6 scale-95"></div>
        </div>

      </div>
    </section>

    <AppDivider />

    <section class="max-w-5xl mx-auto px-4 mb-2">
      <!-- Latest Update Ticker -->
      <NewsTicker />
    </section>

    <AppDivider />

    <!-- 2. Research Interests -->
    <ResearchInterests />

    <AppDivider />

    <!-- 3. Selected Work: Split Columns with Vertical Divider -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">Selected Work</h2>
        <UButton to="/research" variant="ghost" color="gray">View All <span aria-hidden="true">&rarr;</span></UButton>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        
        <!-- Projects Column -->
        <div class="space-y-6">
          <h3 class="text-sm font-bold capitalize tracking-wider text-sky-600 dark:text-sky-400">
             Featured Projects
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <div v-for="project in featuredProjects" :key="project.title">
              <AppProjectCard
                :project-title="project.title"
                :project-description="project.description"
                :icon="project.icon"
                :project-url="project._path"
              />
            </div>
          </div>
        </div>

        <!-- Vertical Divider (Visible on LG screens) -->
        <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-200 dark:via-zinc-700 to-transparent"></div>

        <!-- Research Column -->
        <div class="space-y-6 lg:pl-8">
          <h3 class="text-sm font-bold capitalize tracking-wider text-sky-600 dark:text-sky-400">
             Recent Research
          </h3>
          <div class="space-y-4">
            <NuxtLink 
              v-for="paper in featuredResearch" 
              :key="paper.title"
              :to="'/research/' + slugify(paper.title)" 
              class="block group"
            >
              <div class="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 hover:border-sky-400 dark:hover:border-sky-500 transition-all hover:shadow-sm">
                <div class="flex items-start justify-between mb-2">
                  <UBadge color="gray" variant="soft" size="xs">{{ paper.venue }}</UBadge>
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-sky-500 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <h4 class="font-bold text-base mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                  {{ paper.title }}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ paper.abstract }}
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

    <!-- 4. Technologies and Tools -->
    <section>
      <h2 class="text-2xl font-bold mb-6">
        Technologies and Tools
      </h2>
      <div class="flex flex-wrap gap-6 justify-start">
        <div 
          v-for="tech in techStack" 
          :key="tech.name"
          class="flex flex-col items-center gap-2 group"
        >
          <div class="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 group-hover:scale-110 transition-transform">
            <Icon :name="tech.icon" class="w-6 h-6" />
          </div>
          <span class="text-[10px] font-medium text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
            {{ tech.name }}
          </span>
        </div>
      </div>
    </section>

    <AppDivider />
    
    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<style scoped>
  #wave {
    @apply inline-block ml-1 origin-[70%_70%] animate-[10s_ease_2s_infinite_wave] hover:animate-[1.5s_ease_hoverwave];
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    2.5%,
    7.5% {
      transform: rotate(14deg);
    }
    5% {
      transform: rotate(-8deg);
    }
    10% {
      transform: rotate(-4deg);
    }
    12.5% {
      transform: rotate(10deg);
    }
    15% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  @keyframes hoverwave {
    0% {
      transform: rotate(0deg);
    }
    10% {
      transform: rotate(14deg);
    }
    20% {
      transform: rotate(-8deg);
    }
    30% {
      transform: rotate(14deg);
    }
    40% {
      transform: rotate(-4deg);
    }
    50% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
</style>