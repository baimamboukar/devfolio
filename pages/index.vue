<script setup>
// Static page meta
definePageMeta({
  title: "Baimam Boukar Jean Jacques",
  description: "AI Safety Researcher working on mechanistic interpretability and AI alignment. Research Assistant at Jinesis AI Lab, University of Toronto. Carnegie Mellon University alum.",
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
      content: 'AI Safety Researcher working on mechanistic interpretability and AI alignment. Research Assistant at Jinesis AI Lab, University of Toronto. Carnegie Mellon University alum.'
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

const publicationAuthors = (paper) => paper.authors?.length
  ? paper.authors
  : [{ name: 'Baimam Boukar Jean Jacques' }, ...(paper.contributors || [])];

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

          <p class="hero-intro text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl mx-auto md:mx-0 text-justify">
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

        <!-- Publications Column (citation style) -->
        <div class="space-y-6 lg:pl-8">
          <h3 class="text-sm font-bold capitalize tracking-wider text-sky-600 dark:text-sky-400">
             Selected Research
          </h3>
          <div class="divide-y divide-gray-100 dark:divide-zinc-800">
            <NuxtLink
              v-for="paper in featuredResearch"
              :key="paper.title"
              :to="'/research/' + slugify(paper.title)"
              class="block group py-4 first:pt-0"
            >
              <h4 class="font-semibold text-base leading-snug mb-1.5 group-hover:text-sky-600 transition-colors">
                {{ paper.title }}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ publicationAuthors(paper)[0].name }}</span><span v-if="publicationAuthors(paper).length > 1" class="text-gray-500 dark:text-gray-400">, {{ publicationAuthors(paper).slice(1).map(author => author.name).join(', ') }}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-500">
                <span class="italic">{{ paper.venue }}</span>
                <span class="mx-1.5 text-gray-300 dark:text-zinc-700">•</span>
                <span class="text-sky-600 dark:text-sky-400 font-medium">{{ paper.status }}</span>
              </p>
            </NuxtLink>
          </div>
        </div>

      </div>
    </section>

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