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
      to: '#',
      icon: 'i-heroicons-document-arrow-down',
      color: 'primary',
    },
    {
      label: 'Get in Touch',
      to: '#',
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
      class="mb-4 !pt-0"
      reverse
    >
      <nuxt-img
        src="/bbjj.jpg"
        alt="Baimam Boukar"
        class="rounded-lg shadow-2xl ring ring-[var(--ui-border)] w-64 h-72 object-cover objec"
      />
    </UPageHero>
  </div>
</template>
