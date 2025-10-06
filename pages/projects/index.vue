<script setup>
  definePageMeta({
    title: "Projects",
    description: "Projects that I am currently working on and have worked on.",
  });

  // Fetch all featured projects
  const { pending: featuredPending, data: featuredProjects } = await useLazyAsyncData("featured-projects", () =>
    queryContent("/projects")
      .where({ title: { $ne: "More" } })
      .find()
  );

  // Fetch all other projects from 'more'
  const { pending: morePending, data: moreProjects } = await useLazyAsyncData(
    "more-projects",
    () => queryContent("/projects/more").findOne(),
    {
      transform: (projects) => {
        return {
          visual: projects.body.filter((project) => project.visual),
          nonVisual: projects.body.filter((project) => !project.visual),
        };
      },
    }
  );

  const pending = computed(() => featuredPending.value || morePending.value);

  // Filter state
  const searchQuery = ref('');
  const selectedCategory = ref('all');
  const selectedType = ref('all');

  // Combine all projects into one array
  const allProjects = computed(() => {
    if (!featuredProjects.value || !moreProjects.value) return [];

    const featured = featuredProjects.value.map(project => ({
      ...project,
      name: project.title,
      liveUrl: project._path,
      category: 'featured'
    }));

    const more = [
      ...moreProjects.value.visual.map(project => ({ ...project, category: 'web' })),
      ...moreProjects.value.nonVisual.map(project => ({ ...project, category: 'system' }))
    ];

    return [...featured, ...more];
  });

  // Extract unique categories and types
  const availableCategories = computed(() => {
    const categories = new Set();
    allProjects.value.forEach(project => {
      if (project.tags) {
        project.tags.forEach(tag => {
          // Filter out URLs and unwanted values
          if (!tag.includes('http') && !tag.includes('www.') && !tag.includes('.com') && !tag.includes('.dev') && !tag.includes('.app')) {
            categories.add(tag);
          }
        });
      }
      if (project.stack) {
        project.stack.forEach(tech => {
          // Filter out URLs and unwanted values
          if (!tech.includes('http') && !tech.includes('www.') && !tech.includes('.com') && !tech.includes('.dev') && !tech.includes('.app')) {
            categories.add(tech);
          }
        });
      }
      if (project.icon) {
        // Map icon names to readable tech names
        const iconTechMap = {
          'vuedotjs': 'Vue',
          'javascript': 'JavaScript',
          'cplusplus': 'C++',
          'alpinedotjs': 'Alpine.js'
        };
        const tech = iconTechMap[project.icon] || project.icon;
        if (!tech.includes('http') && !tech.includes('www.') && !tech.includes('.com') && !tech.includes('.dev') && !tech.includes('.app')) {
          categories.add(tech);
        }
      }
    });
    return Array.from(categories).sort();
  });

  const availableTypes = computed(() => {
    return ['featured', 'web', 'system'];
  });

  // Filtered projects
  const filteredProjects = computed(() => {
    let filtered = allProjects.value;

    // Search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (project.stack && project.stack.some(tech => tech.toLowerCase().includes(query)))
      );
    }

    // Category filter (technologies/topics)
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(project => {
        const hasInTags = project.tags && project.tags.includes(selectedCategory.value);
        const hasInStack = project.stack && project.stack.includes(selectedCategory.value);
        const hasInIcon = project.icon && (
          (project.icon === 'vuedotjs' && selectedCategory.value === 'Vue') ||
          (project.icon === 'javascript' && selectedCategory.value === 'JavaScript') ||
          (project.icon === 'cplusplus' && selectedCategory.value === 'C++') ||
          (project.icon === 'alpinedotjs' && selectedCategory.value === 'Alpine.js')
        );
        return hasInTags || hasInStack || hasInIcon;
      });
    }

    // Type filter (featured/web/system)
    if (selectedType.value !== 'all') {
      filtered = filtered.filter(project => project.category === selectedType.value);
    }

    return filtered;
  });

  // Reset filters
  const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = 'all';
    selectedType.value = 'all';
  };
</script>

<!-- Projects Page -->
<template>
  <article>
    <h1 class="mb-4 text-3xl font-bold text-left">Projects</h1>
    <p class="mb-6 text-zinc-700 dark:text-zinc-300">
      I build things in the open. Check out
      <nuxt-link
        to="https://github.com/baimamboukar"
        class="border-b-[.1rem] border-b-blue-500/75 focus-visible:global-focus"
        external
        >my GitHub profile</nuxt-link
      >.
    </p>

    <!-- Filters Section -->
    <div class="mb-8 space-y-4">
      <!-- Search Bar and Filters in same line -->
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search Bar -->
        <div class="relative flex-1">
          <Icon name="i-heroicons-magnifying-glass" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search projects..."
            class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <!-- Category Filter -->
        <div class="min-w-48">
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option v-for="category in availableCategories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Type Filter -->
        <div class="min-w-48">
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="featured">Featured</option>
            <option value="web">Web Apps</option>
            <option value="system">System/Tools</option>
          </select>
        </div>

        <!-- Reset Button -->
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
        >
          Reset
        </button>
      </div>

      <!-- Results Count -->
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ filteredProjects.length }} of {{ allProjects.length }} projects
      </div>
    </div>

    <!-- Filtered Projects Grid -->
    <section v-if="!pending && filteredProjects.length > 0" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <app-project-card
        v-for="project in filteredProjects"
        :key="project.name || project.title"
        :icon="project.icon"
        :project-title="project.name || project.title"
        :project-description="project.description"
        :project-url="project.liveUrl || project._path"
      />
    </section>

    <!-- Loading State -->
    <section v-else-if="pending" class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <app-project-skeleton
        v-for="skeletonId in generateKeys(6)"
        :key="skeletonId"
      />
    </section>

    <!-- No Results -->
    <div v-else-if="!pending && filteredProjects.length === 0" class="text-center py-12">
      <Icon name="i-heroicons-funnel" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No projects found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters to see more results.</p>
      <button
        @click="resetFilters"
        class="inline-flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
      >
        <Icon name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
        Reset Filters
      </button>
    </div>
  </article>
</template>
