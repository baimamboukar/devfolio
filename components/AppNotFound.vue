<template><section class="missing-page"><span>404</span><h1>This page isn't here.</h1><p>You can return to the work collection or start from the home page.</p><nav aria-label="Find a page"><NuxtLink to="/">Home</NuxtLink><NuxtLink to="/work">Work</NuxtLink></nav></section></template>
<style scoped>
.missing-page { padding:var(--section-gap) 0; }
span { font-size:.8rem; color:var(--muted); }
h1 { margin:8px 0; } p { color:var(--muted); }
nav { display:flex; gap:20px; margin-top:18px; color:var(--link-color); }
nav a { min-height:44px; display:inline-flex; align-items:center; }
</style>
