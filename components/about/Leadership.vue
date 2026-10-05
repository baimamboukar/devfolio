<script setup>
const props = defineProps({ leadership: { type: Array, required: true } });
const groups = computed(() => [
  { title: 'Research Service', roles: props.leadership.filter(role => role.role.startsWith('Reviewer')) },
  { title: 'Community and Leadership', roles: props.leadership.filter(role => !role.role.startsWith('Reviewer')) },
].filter(group => group.roles.length));
const roleLabel = role => role.replace('●•', ' · ');
</script>
<template>
  <div class="service-groups"><section v-for="group in groups" :key="group.title" class="service-group"><h3>{{ group.title }}</h3><ul class="community-records"><li v-for="role in group.roles" :key="role.role + role.community"><img v-if="role.icon" :src="role.icon" :alt="role.community" width="46" height="46" loading="lazy" decoding="async"><div class="community-copy"><h4>{{ role.community }}</h4><p class="community-role">{{ roleLabel(role.role) }}</p><p class="community-period">{{ role.period.replace(/-/g, ' – ') }}</p><p v-if="role.description" class="community-description">{{ role.description }}</p></div></li></ul></section></div>
</template>
<style scoped>
.service-groups { display: grid; gap: var(--section-gap); }
.service-group > h3 { margin-bottom: 15px; font-size: 1rem; font-weight: var(--heading-weight); }
.community-records { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 0 24px; list-style: none; margin: 0; padding: 0; }
.community-records > li { display: flex; gap: 14px; align-items: start; padding: var(--row-gap) 0; border-top: 1px solid var(--line); min-width: 0; }
.community-records img { width: 46px; height: 46px; padding: 4px; border-radius: 8px; background: #fff; object-fit: contain; flex-shrink: 0; }
.community-copy { min-width: 0; }
.community-copy h4 { font-size: .88rem; line-height: 1.5; font-weight: var(--heading-weight); }
.community-role { color: var(--muted); font-size: .81rem; line-height: 1.55; margin-top: 3px; }
.community-period { color: var(--muted); font-size: .72rem; margin-top: 5px; }
.community-description { color: var(--muted); font-size: .8rem; line-height: var(--content-leading); margin-top: 8px; }
@media (max-width: 800px) { .community-records { grid-template-columns: minmax(0,1fr); } }
@media (max-width: 600px) { .community-records > li { gap: 10px; } .community-records img { width: 36px; height: 36px; } .community-copy h4 { font-size: .84rem; } }
</style>
