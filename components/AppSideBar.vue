<template>
  <aside id="sidebar" class="profile-sidebar">
    <AppProfileCard />
    <AppNav class="desktop-navigation" />
    <div class="sidebar-bottom">
      <AppThemeToggle />
    </div>
  </aside>
</template>
<style scoped>
.profile-sidebar { position: sticky; top: 48px; min-width: 0; }
.desktop-navigation { margin-top: 28px; }
.sidebar-bottom { display: flex; align-items: center; justify-content: space-between; margin-top: 22px; gap: 10px; padding: 0 6px; }
@media (max-width: 767px) {
  .profile-sidebar { position: static; display: flex; align-items: center; justify-content: space-between; margin-bottom: 38px; gap: 12px; }
  .desktop-navigation { display: none; }
  .sidebar-bottom { margin: 0; padding: 0; }
}
</style>
