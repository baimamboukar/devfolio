<script setup>
const domains = [
  { name: 'Mechanistic interpretability', icon: 'layers', summary: 'How models encode and use internal representations.', detail: 'I study probes and sparse autoencoders, with particular attention to whether their findings transfer across model families, layers, tasks, and data distributions.' },
  { name: 'Deception and situational awareness', icon: 'focus', summary: 'When models detect oversight or behave strategically.', detail: 'I investigate deception monitors and the gap between detecting a behavior and identifying an intervention that reliably changes it.' },
  { name: 'White-box control', icon: 'controls', summary: 'Whether interventions give us reliable causal control.', detail: 'I evaluate steering, activation patching, and related interventions against matched controls to separate useful effects from changes caused by intervention strength.' },
  { name: 'Evaluation science', icon: 'chart', summary: 'Measuring capabilities with careful, reproducible controls.', detail: 'My work distinguishes faithful replication from partial reproduction, and tests how conclusions change across datasets, splits, and evaluation conditions.' },
];
</script>
<template>
  <section aria-labelledby="research-focus-title">
    <div class="focus-heading"><h2 id="research-focus-title" class="section-heading">Research focus</h2><p>Understanding models, and testing what holds up.</p></div>
    <div class="focus-list">
      <details v-for="domain in domains" :key="domain.name" class="focus-item">
        <summary><span class="focus-icon"><SiteIcon :name="domain.icon" /></span><span><span class="focus-title">{{ domain.name }}</span><span class="focus-summary">{{ domain.summary }}</span></span><SiteIcon name="chevron" class="disclosure" /></summary>
        <p class="focus-detail">{{ domain.detail }}</p>
      </details>
    </div>
  </section>
</template>
<style scoped>
.focus-heading { margin-bottom: 20px; }
.focus-heading p { color: var(--muted); font-size: .86rem; margin-top: 10px; }
.focus-list { display: grid; gap: 5px; }
.focus-item { border-radius: 16px; }
.focus-item:hover, .focus-item[open] { background: var(--surface); }
summary { display: grid; grid-template-columns: 38px minmax(0,1fr) 18px; align-items: center; gap: 13px; padding: 14px 12px; list-style: none; cursor: pointer; border-radius: 16px; }
summary::-webkit-details-marker { display: none; }
.focus-icon { width: 36px; height: 36px; border-radius: 12px; display: grid; place-items: center; background: rgb(var(--primary-50)); color: rgb(var(--primary-600)); }
:global(.dark) .focus-icon { background: rgb(var(--primary-950)); color: rgb(var(--primary-300)); }
.focus-title { display: block; font-size: .95rem; font-weight: 500; }
.focus-summary { display: block; font-size: .82rem; color: var(--muted); margin-top: 4px; line-height: 1.5; }
.disclosure { color: var(--muted); transition: transform .2s; }
[open] .disclosure { transform: rotate(180deg); }
.focus-detail { padding: 0 42px 20px 63px; color: var(--muted); font-size: .86rem; line-height: 1.65; }
@media (max-width: 767px) { summary { padding-left: 4px; gap: 10px; } .focus-detail { padding-left: 52px; padding-right: 20px; } }
</style>
