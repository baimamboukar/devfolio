<script setup>
  // Define props for the summary section
  const props = defineProps({
    overview: {
      type: String,
      required: true
    }
  });

  // Define hero links for the summary section
  const heroLinks = ref([
    {
      label: 'Download CV',
      to: '/',
      icon: 'i-heroicons-document-arrow-down',
      color: 'primary',
    },
    {
      label: 'Get in Touch',
      to: '/contact',
      color: 'gray',
      variant: 'subtle',
      trailingIcon: 'i-heroicons-arrow-right'
    }
  ]);
</script>

<template>
  <div>
    <UPageHero
      title="Baimam Boukar"
      :description="overview"
      headline="Software Engineer"
      orientation="horizontal"
      :links="heroLinks"
      class="mb-12"
    >
      <nuxt-img
        src="/self.jpg"
        alt="Baimam Boukar"
        class="rounded-full w-64 h-64 object-cover shadow-2xl ring-4 ring-primary-500/30"
      />
    </UPageHero>
  </div>
</template>
