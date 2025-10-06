<script setup>
        // Static page meta (definePageMeta doesn't support async)
        definePageMeta({
          title: "Baimam Boukar Jean Jacques",
          description: "Graduate Researcher at CMU Africa | Machine Learning for Space Systems & Earth Observation | 2xAWS Certified | Open Source Contributor",
        });

        // Load centralized configuration
        const { config: siteConfig } = await useSiteConfig();
        const { content: homepageContent } = await useHomepageContent();
        const { getMessage } = await useUIMessages();

        // Dynamic head configuration
        useHead({
          titleTemplate: siteConfig?.seo.title_template || "Baimam Boukar JJ",
          title: siteConfig?.personal.name || "Baimam Boukar Jean Jacques",
          meta: [
            {
              name: 'description',
              content: siteConfig?.personal.tagline || "Graduate Researcher at CMU Africa | Machine Learning for Space Systems & Earth Observation | 2xAWS Certified | Open Source Contributor"
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


        // // Fetch latest 2 blog posts
        // const { pending: blogsPending, data: blogPosts } = await useLazyAsyncData(
        //   "featured-posts",
        //   () => queryContent("/blog").sort({ published_on: -1 }).limit(4).find()
        // );

        // Fetch featured projects (using configured limit)
        const projectsLimit = siteConfig?.featured.projects_count || 4;
        const { pending: projectsPending, data: featuredProjects } = await useLazyAsyncData(
          "featured-projects-homepage",
          () => queryContent("/projects")
            .where({ title: { $ne: "More" } })
            .limit(projectsLimit)
            .find()
        );

  // News modal state
  const isNewsModalOpen = ref(false);

  // Debug function for development
  const { refreshAllConfigs } = useConfig();
  const testConfigRefresh = async () => {
    console.log('🧪 Testing config refresh...');
    await refreshAllConfigs();
    // Force reactivity update
    await nextTick();
    console.log('🧪 Config refresh completed, page should update');
  };
</script>

<!-- Landing Page -->
<template>
  <article class="[&>*]:my-4 first:[&>*]:mt-0 [&>hr]:my-6 md:[&>hr]:my-10">
    <!-- Introduction with Photo -->
    <section class="flex flex-col md:flex-row gap-6 items-start">
      <!-- Photo Column -->
      <div class="flex-shrink-0 mx-auto md:mx-0">
        <img
          width="180"
          height="180"
          :src="siteConfig?.personal.photo || '/baimamboukar.jpeg'"
          :alt="siteConfig?.personal.name || 'Baimam Boukar JJ'"
          class="rounded-xl border-2 border-gray-200 dark:border-zinc-700"
        />
      </div>

      <!-- Content Column -->
      <div class="flex-1 space-y-4">
        <!-- Text Summary Row -->
        <div>
          <h1 class="mb-4 text-2xl font-semibold">
            {{ homepageContent?.hero.greeting || "Hi, I'm Baimam Boukar" }}
            <span id="wave">{{ homepageContent?.hero.emoji || "👋" }}</span>
          </h1>
          <p class="text-base font-medium text-zinc-700 dark:text-zinc-300">
            {{ homepageContent?.hero.introduction || "Master's student at Carnegie Mellon University Africa specializing in Machine Learning applications for Space Systems and Earth Observation. My research explores satellite telemetry analysis, remote sensing for socioeconomic assessment, and AI-driven solutions for healthcare in resource-constrained settings." }}
          </p>
        </div>

        <!-- CV Download Row -->
        <!-- <div class="pt-2">
          <UButton
            color="sky"
            variant="solid"
            size="sm"
            icon="i-heroicons-arrow-down-tray"
            to="/resume.pdf"
            target="_blank"
            external
            class="ml-auto"
          >
            Download CV
          </UButton>
        </div> -->
      </div>
    </section>

    <app-divider class="md:my-6" />

    <!-- Debug: Config Refresh Button (remove in production) -->
    <div v-if="$dev" class="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
      <p class="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
        🧪 Development Debug: Test config refresh from GitHub Gists
      </p>
      <button
        @click="testConfigRefresh"
        class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded transition-colors"
      >
        Refresh Config from Gists
      </button>
    </div>

    <!-- Recent Achievements Banner -->
    <AchievementsBanner />

    <!-- News/Updates Section -->
    <News :limit="4" @show-all="isNewsModalOpen = true" />

    <!-- News Modal -->
    <NewsModal v-model="isNewsModalOpen" />

    <app-divider class="md:my-6" />

    <!-- Quick Links Grid -->
    <section class="mb-2 space-y-2">
      <div
        class="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:grid-flow-col gap-2 lg:[&_:first-child]:row-span-2 [&_:first-child]:col-span-2 lg:[&_:first-child]:col-span-1"
      >
        <!-- Book Call Card -->
        <div
          class="flex items-center justify-center p-[1px] overflow-hidden font-medium shrink-0 relative -z-0 before:content-[''] before:absolute before:-inset-[1px] before:-z-10 before:bg-gradient-to-b before:from-sky-500 before:to-blue-600 rounded-[calc(.375rem+1px)] dark:before:opacity-70 focus-within:ring-2 ring-offset-0 focus-within:ring-sky-400 focus-within:ring-opacity-75"
        >
          <div
            class="flex flex-col items-center justify-center w-full h-full gap-6 p-6 bg-white rounded-md dark:bg-zinc-800"
          >
            <div class="text-center">
              <p class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {{ homepageContent?.quick_links.book_call.title || "Let's Connect" }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ homepageContent?.quick_links.book_call.subtitle || "Schedule a conversation" }}
              </p>
            </div>
            <nuxt-link
              class="px-6 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg focus-visible:outline-none text-white font-medium transition-colors duration-200"
              :to="homepageContent?.quick_links.book_call.url || 'https://calendly.com/baimamboukar'"
              target="_blank"
              external
              id="contact-btn"
              >{{ homepageContent?.quick_links.book_call.button_text || "Book Call" }}</nuxt-link
            >
          </div>
        </div>

        <app-link-card
          v-for="link in homepageContent?.quick_links.links || [
            { label: 'Research', icon: 'fluent-emoji:scientist', url: '/research' },
            { label: 'My Talks', icon: 'fluent-emoji:laptop', url: '/presentations', external: true },
            { label: 'Projects', icon: 'fluent-emoji:sparkles', url: '/projects' },
            { label: 'Blog', icon: 'fluent-emoji:writing-hand', url: '/blog' }
          ]"
          :key="link.label"
          :label="link.label"
          :icon="link.icon"
          :url="link.url"
          :is-external-url="link.external || false"
        ></app-link-card>
      </div>
    </section>

    <app-divider class="md:my-6" />
    <!-- Research Map -->
    <ResearchMap />
    <app-divider class="md:my-6" />
    <!-- Featured Research -->
    <FeaturedResearch />

    <app-divider class="md:my-6" />

    <!-- Featured Projects -->
    <section class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">Featured Projects</h2>

        <UButton
          color="sky"
          variant="ghost"
          size="xs"
          to="/projects"
        >
          View All
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right" />
          </template>
        </UButton>
      </div>
      <p class="mb-6 text-zinc-700 dark:text-zinc-300">
        A showcase of my favorite projects spanning mobile apps, web applications, and open-source contributions.
      </p>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <template v-if="projectsPending">
          <app-project-skeleton
            v-for="skeletonId in generateKeys(4)"
            :key="skeletonId"
          />
        </template>
        <template v-else>
          <app-project-card
            v-for="project in featuredProjects"
            :key="project.title"
            :icon="project.icon"
            :project-title="project.title"
            :project-description="project.description"
            :project-url="project._path"
          />
        </template>
      </div>
    </section>

    <!-- Latest Blog Posts -->
    <!-- <section>
      <h2 class="w-auto mb-2 text-xl font-semibold group">
        <nuxt-link
          to="/blog"
          class="flex items-center w-full py-2 rounded-lg focus-visible:global-focus"
        >
          My Articles
          <Icon
            name="heroicons:chevron-right-solid"
            class="ml-2 text-sky-500 group-hover:translate-x-1"
          />
        </nuxt-link>
      </h2>
      <p class="mb-4 text-zinc-700 dark:text-zinc-300">
        I love sharing my knowledge via blog posts and articles. I write about
        Go, AWS, Flutter, Nuxt, Google Cloud and other cool stuff.
      </p>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <template v-if="blogsPending">
          <app-blog-skeleton
            v-for="skeletonId in generateKeys(2)"
            :key="skeletonId"
          />
        </template>
        <template v-else>
          <app-blog-card
            v-for="blogPost in blogPosts"
            :key="blogPost._id"
            :tags="blogPost.tags"
            :blog-title="blogPost.title"
            :title="blogPost.title"
            :url="blogPost._path"
            :pub-date="blogPost.published_on"
            :cover-image="blogPost.image"
          />
        </template>
      </div>
    </section> -->
    <app-divider />
    <!-- Other Links -->
    <!-- <section class="mb-2 space-y-2">
      <div
        class="grid grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 lg:grid-flow-col gap-2 lg:[&_:first-child]:row-span-2 [&_:first-child]:col-span-2 lg:[&_:first-child]:col-span-1"
      >
        <div
          class="flex items-center justify-center p-[1px] overflow-hidden font-medium shrink-0 relative -z-0 before:content-[''] before:absolute before:-inset-[1px] before:-z-10 before:bg-gradient-to-b before:from-blue-500 before:to-lime-400 rounded-[calc(.375rem+1px)] dark:before:opacity-60 focus-within:ring-2 ring-offset-0 focus-within:ring-blue-400 focus-within:ring-opacity-75"
        >
          <div
            class="flex flex-col items-center justify-center w-full h-full gap-6 p-4 bg-white rounded-md dark:bg-zinc-800"
          >
            <p class="text-lg font-bold">Let's Chat.</p>
            <nuxt-link
              class="px-4 py-2 bg-sky-500 rounded-lg focus-visible:outline-none text-zinc-800"
              to="/contact"
              id="contact-btn"
              >Message</nuxt-link
            >
          </div>
        </div>
        <app-link-card
          label="LeetCode"
          icon="fluent-emoji:teacup-without-handle"
          url="/leetcode"
        ></app-link-card>
        <app-link-card
          label="Bookmarks"
          icon="fluent-emoji:bookmark"
          url="/bookmarks"
        ></app-link-card>
        <app-link-card
          label="Second Brain"
          icon="fluent-emoji:brain"
          :is-external-url="true"
          url="https://github.com/baimamboukar/notes"
        ></app-link-card>
        <app-link-card
          label="Photography"
          icon="fluent-emoji:camera"
          :is-external-url="true"
          url="https://unsplash.com/@baimamboukar"
        ></app-link-card>
      </div>
    </section> -->
    <app-footer />
  </article>
</template>

<style scoped>
  #contact-btn {
    animation: 1500ms linear 2000ms infinite pulse;
  }

  @keyframes pulse {
    0% {
      box-shadow: #4ade80 0 0 0 0;
    }
    50% {
      box-shadow: #4ade8000 0 0 0 0.5rem;
    }
  }

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
