<script setup>
definePageMeta({
  middleware: [
    function (to) {
      const section = Array.isArray(to.params.tab) ? to.params.tab[0] : to.params.tab;
      return navigateTo({ path: '/about', query: { section } }, { redirectCode: 301 });
    },
  ],
});
</script>

<template>
  <div />
</template>
