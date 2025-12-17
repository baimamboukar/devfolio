<script setup>
import { slugify } from '~/utils/slugify';

const route = useRoute();
const router = useRouter();
const { data: researchData } = await useAsyncData('research', () => queryContent('research').findOne());

const project = computed(() => {
  if (!researchData.value?.research) return null;
  return researchData.value.research.find(p => slugify(p.title) === route.params.slug);
});

// Modal state - Open immediately on mount
const isOpen = ref(true);

const handleClose = () => {
  isOpen.value = false;
  setTimeout(() => {
    router.push('/research');
  }, 200);
};

// SEO
useSeoMeta({
  title: () => project.value ? `${project.value.title} | Research` : 'Research Project Not Found',
  description: () => project.value?.abstract || 'Research project details.',
  ogTitle: () => project.value?.title,
  ogDescription: () => project.value?.abstract,
  ogImage: () => project.value?.cover,
});

// JSON-LD Schema
useHead(() => {
  if (!project.value) return {};
  
  return {
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ScholarlyArticle',
          headline: project.value.title,
          image: project.value.cover,
          abstract: project.value.abstract,
          author: {
            '@type': 'Person',
            name: 'Baimam Boukar JJ'
          },
          datePublished: project.value.date || '2024',
        })
      }
    ]
  }
});
</script>

<template>
  <div>
    <!-- Render the modal if project exists -->
    <ResearchProjectModal
      v-if="project"
      :model-value="isOpen"
      :project="project"
      @update:model-value="handleClose"
    />
  </div>
</template>