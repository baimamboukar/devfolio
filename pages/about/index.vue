<script setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo('/about/education');
    },
  ],
});
</script>
