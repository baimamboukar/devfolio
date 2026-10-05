<script setup>
defineProps({ kind: { type: String, default: 'refit' }, compact: { type: Boolean, default: false } });
const descriptions = {
  refit: 'Study design: fit a probe on the original model, independently fit a new probe on each target model, then evaluate findings across models. Model weights remain fixed.',
  selection: 'Study design: detect deceptive choices using a linear probe, compare probe-derived and contrastive steering candidates, then evaluate held-out behavior and selection regret under limits on capability loss.',
  alignment: 'Study design: distinguish coordinate mismatch from concept mismatch using alignment evaluated on held-out tasks.',
  support: 'Study design: evaluate responses to direct and indirect user cues, distinguishing affective support from epistemic agreement.',
  sae: 'Study design: compare Matryoshka and standard sparse autoencoders for feature recovery; reconstruction quality alone is not feature recovery.',
};
</script>
<template>
  <figure class="study-sketch" :class="['sketch-' + kind, { 'sketch-compact': compact }]" role="img" :aria-label="descriptions[kind] || descriptions.refit">
    <figcaption class="sketch-label" aria-hidden="true">Study design</figcaption>
    <div class="sketch-canvas" aria-hidden="true">
      <template v-if="kind === 'refit'">
        <svg class="diagram-wide refit-diagram" :viewBox="compact ? '0 -15 640 238' : '0 0 640 208'" fill="none">
          <rect class="blue-fill" x="0" y="18" width="138" height="76" rx="14"/><text x="69" y="49" class="node-title"><tspan x="69">Original</tspan><tspan x="69" dy="23">model</tspan></text>
          <rect class="blue-outline" x="201" y="18" width="156" height="76" rx="14"/><text x="279" y="49" class="node-title"><tspan x="279">Fit probe</tspan><tspan x="279" dy="22" class="node-note">on original model</tspan></text>
          <path class="blue-line" d="M151 56H187M180 49l8 7-8 7"/>
          <rect class="teal-fill" x="0" y="118" width="138" height="76" rx="14"/><text x="69" y="149" class="node-title"><tspan x="69">Target</tspan><tspan x="69" dy="23">model</tspan></text>
          <rect class="teal-outline" x="201" y="118" width="156" height="76" rx="14"/><text x="279" y="149" class="node-title"><tspan x="279">Fit new probe</tspan><tspan x="279" dy="22" class="node-note">on target model</tspan></text>
          <path class="teal-line" d="M151 156H187M180 149l8 7-8 7"/>
          <path class="blue-line" d="M357 56C398 56 393 94 420 102M412 93l9 10-13 1"/>
          <path class="teal-line" d="M357 156C398 156 393 118 420 110M408 108l13 1-9 10"/>
          <circle cx="425" cy="106" r="5" class="merge-point"/><path class="blue-line" d="M431 106H449M442 99l8 7-8 7"/>
          <rect class="violet-fill" x="464" y="56" width="176" height="100" rx="14"/><text x="552" y="87" class="node-title"><tspan x="552">Evaluate</tspan><tspan x="552" dy="23">across models</tspan><tspan x="552" dy="25" class="node-note">method generalization</tspan></text>
        </svg>
        <div class="diagram-narrow refit-narrow"><div class="narrow-branch"><span class="blue-box">Original<br>model</span><span class="branch-arrow">→</span><span class="blue-edge">Fit probe</span></div><div class="narrow-branch"><span class="teal-box">Target<br>model</span><span class="branch-arrow teal-text">→</span><span class="teal-edge">Fit new<br>probe</span></div><div class="narrow-merge"><svg viewBox="0 0 160 35" fill="none"><path class="blue-line" d="M25 0C25 23 80 8 80 31M73 24l7 8 7-8"/><path class="teal-line" d="M135 0C135 23 80 8 80 25"/></svg></div><div class="violet-box">Evaluate across models</div></div>
        <p class="method-note">Fixed model weights. Probes fit independently.</p>
      </template>
      <template v-else-if="kind === 'selection'">
        <svg class="diagram-wide selection-diagram" viewBox="0 0 640 238" fill="none">
          <text x="88" y="18" class="stage-title">Detect signal</text><text x="319" y="18" class="stage-title">Choose intervention</text><text x="548" y="18" class="stage-title">Test behavior</text>
          <rect class="stage-frame" x="1" y="34" width="174" height="178" rx="5"/><rect class="stage-frame" x="228" y="34" width="182" height="178" rx="5"/><rect class="stage-frame" x="462" y="34" width="177" height="178" rx="5"/>
          <rect class="blue-fill" x="17" y="52" width="142" height="55" rx="8"/><text x="88" y="74" class="node-title small"><tspan x="88">Model</tspan><tspan x="88" dy="19">activations</tspan></text><path class="blue-line" d="M88 111v21M82 126l6 7 6-7"/>
          <rect class="blue-outline" x="17" y="141" width="142" height="53" rx="8"/><text x="88" y="164" class="node-title small"><tspan x="88">Linear</tspan><tspan x="88" dy="18">deception probe</tspan></text>
          <path class="ink-line" d="M184 124H216M209 117l8 7-8 7"/>
          <rect class="blue-fill" x="242" y="55" width="154" height="57" rx="8"/><text x="319" y="80" class="node-title small"><tspan x="319">Probe-derived</tspan><tspan x="319" dy="19">steering</tspan></text><rect class="teal-fill" x="242" y="135" width="154" height="57" rx="8"/><text x="319" y="160" class="node-title small"><tspan x="319">Contrastive</tspan><tspan x="319" dy="19">steering</tspan></text>
          <path class="ink-line" d="M418 124H450M443 117l8 7-8 7"/>
          <rect class="blue-fill" x="476" y="55" width="149" height="57" rx="8"/><text x="550" y="80" class="node-title small"><tspan x="550">Held-out</tspan><tspan x="550" dy="19">behavior</tspan></text><rect class="violet-fill" x="476" y="135" width="149" height="57" rx="8"/><text x="550" y="160" class="node-title small"><tspan x="550">Selection</tspan><tspan x="550" dy="19">regret</tspan></text>
        </svg>
        <div class="diagram-narrow selection-narrow"><div class="narrow-stage"><strong>Detect signal</strong><span class="blue-box">Activations → linear probe</span></div><span class="stage-down">↓</span><div class="narrow-stage"><strong>Choose intervention</strong><div class="narrow-pair"><span class="blue-box">Probe-derived<br>steering</span><span class="teal-box">Contrastive<br>steering</span></div></div><span class="stage-down">↓</span><div class="narrow-stage"><strong>Test behavior</strong><span class="violet-box">Held-out behavior<br>Selection regret</span></div></div>
        <p class="method-note">Compare interventions within capability-loss limits.</p>
      </template>
      <template v-else-if="kind === 'alignment'">
        <div class="comparison-diagram"><div class="comparison-branches"><span class="blue-box">Coordinate<br>mismatch?</span><span class="teal-box">Concept<br>mismatch?</span></div><svg class="comparison-merge" viewBox="0 0 180 160" fill="none"><path class="blue-line" d="M0 30C90 30 70 80 148 80M138 70l11 10-11 10"/><path class="teal-line" d="M0 130C90 130 70 80 140 80"/></svg><span class="violet-box">Evaluate alignment<br>on held-out tasks</span></div><p class="method-note">Alignment and generalization are separate questions.</p>
      </template>
      <template v-else-if="kind === 'support'">
        <div class="support-diagram"><div class="cue-spectrum"><span class="blue-box">Direct cues</span><span>→</span><span class="teal-box">Indirect cues</span></div><span class="stage-down">↓</span><div class="narrow-pair"><span class="blue-edge">Affective<br>support</span><span class="teal-edge">Epistemic<br>agreement</span></div></div><p class="method-note">Separate supportive responses from reinforced beliefs.</p>
      </template>
      <template v-else>
        <div class="sae-diagram"><div class="narrow-pair"><div class="blue-edge nested-features"><strong>Matryoshka</strong><span>Nested feature spaces<span>Features</span></span></div><div class="teal-edge nested-features"><strong>Standard SAE</strong><span>Feature space</span></div></div><span class="stage-down">↓</span><div class="violet-box">Compare feature recovery</div></div><p class="method-note">Reconstruction quality alone is not feature recovery.</p>
      </template>
    </div>
  </figure>
</template>
<style scoped>
.study-sketch { --diagram-blue:rgb(var(--primary-500)); --diagram-teal:#11a886; --diagram-violet:#8e81e8; container:study-sketch / inline-size; min-width:0; width:100%; margin:0; padding:0; color:var(--ink); font-family:var(--font-body); }
.sketch-label { color:var(--muted); font-size:.875rem; margin-bottom:16px; }
.sketch-canvas { min-width:0; }
.diagram-wide { display:block; width:100%; height:auto; overflow:visible; }
.diagram-narrow { display:none; }
.node-title { fill:var(--ink); text-anchor:middle; font-size:18px; font-weight:600; font-family:var(--font-body); }
.node-title.small { font-size:17px; font-weight:500; }
.node-note { font-size:14px; font-weight:400; fill:var(--muted); }
.stage-title { font-size:17px; font-weight:700; text-anchor:middle; fill:var(--ink); font-family:var(--font-body); }
.blue-fill { fill:color-mix(in srgb,var(--diagram-blue) 11%,var(--page)); }
.teal-fill { fill:color-mix(in srgb,var(--diagram-teal) 13%,var(--page)); }
.blue-outline { fill:color-mix(in srgb,var(--diagram-blue) 3%,var(--page)); stroke:color-mix(in srgb,var(--diagram-blue) 55%,transparent); stroke-width:1.3; }
.teal-outline { fill:color-mix(in srgb,var(--diagram-teal) 4%,var(--page)); stroke:color-mix(in srgb,var(--diagram-teal) 55%,transparent); stroke-width:1.3; }
.violet-fill { fill:color-mix(in srgb,var(--diagram-violet) 10%,var(--page)); stroke:color-mix(in srgb,var(--diagram-violet) 65%,transparent); stroke-width:1.3; }
.blue-line,.teal-line,.ink-line { stroke:var(--diagram-blue); stroke-width:2.1; stroke-linecap:round; stroke-linejoin:round; }
.teal-line { stroke:var(--diagram-teal); }
.ink-line { stroke:var(--ink); stroke-width:1.6; }
.merge-point { fill:var(--muted); }
.stage-frame { stroke:color-mix(in srgb,var(--muted) 70%,transparent); stroke-width:1; stroke-dasharray:3 3; }
.method-note { margin-top:10px; color:var(--muted); font-size:.72rem; line-height:1.5; text-align:center; }
.sketch-compact .sketch-label { display:none; }
.blue-box,.teal-box,.blue-edge,.teal-edge,.violet-box { display:flex; justify-content:center; align-items:center; text-align:center; min-width:0; padding:13px 9px; border-radius:11px; font-size:.8rem; font-weight:500; line-height:1.5; }
.blue-box { background:color-mix(in srgb,var(--diagram-blue) 11%,var(--page)); }
.teal-box { background:color-mix(in srgb,var(--diagram-teal) 13%,var(--page)); }
.blue-edge { background:color-mix(in srgb,var(--diagram-blue) 3%,var(--page)); border:1px solid color-mix(in srgb,var(--diagram-blue) 45%,transparent); }
.teal-edge { background:color-mix(in srgb,var(--diagram-teal) 4%,var(--page)); border:1px solid color-mix(in srgb,var(--diagram-teal) 45%,transparent); }
.violet-box { background:color-mix(in srgb,var(--diagram-violet) 10%,var(--page)); border:1px solid color-mix(in srgb,var(--diagram-violet) 55%,transparent); }
.narrow-branch { display:grid; grid-template-columns:minmax(0,1fr) 22px minmax(0,1fr); gap:6px; align-items:center; }
.narrow-branch + .narrow-branch { margin-top:15px; }
.branch-arrow,.stage-down { color:var(--diagram-blue); font-size:1.3rem; text-align:center; }
.teal-text { color:var(--diagram-teal); }
.narrow-merge { height:35px; margin:2px 0; }
.narrow-merge svg { width:100%; height:100%; }
.narrow-stage > strong { display:block; text-align:center; font-weight:600; font-size:.79rem; margin-bottom:10px; }
.stage-down { display:block; margin:7px 0; }
.narrow-pair { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; }
.comparison-diagram { display:grid; grid-template-columns:minmax(0,1fr) .45fr minmax(0,1fr); gap:10px; align-items:center; min-height:180px; }
.comparison-branches { display:grid; gap:28px; }
.comparison-merge { width:100%; }
.support-diagram,.sae-diagram { min-height:180px; display:flex; flex-direction:column; justify-content:center; }
.cue-spectrum { display:grid; grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr); gap:10px; align-items:center; text-align:center; }
.cue-spectrum > span:nth-child(2) { color:var(--diagram-blue); font-size:1.25rem; }
.nested-features { display:block; padding:12px; }
.nested-features > strong { font-size:.77rem; }
.nested-features span { display:block; margin-top:8px; padding:8px 4px; border:1px solid color-mix(in srgb,var(--diagram-blue) 20%,transparent); border-radius:7px; font-size:.68rem; }
@container study-sketch (max-width:360px) { .diagram-wide { display:none; } .diagram-narrow { display:block; } .blue-box,.teal-box,.blue-edge,.teal-edge,.violet-box { font-size:12px; padding:11px 7px; } .method-note { font-size:11px; } .comparison-diagram { grid-template-columns:1fr; gap:0; } .comparison-branches { display:grid; grid-template-columns:1fr 1fr; gap:10px; } .comparison-merge { width:65px; height:55px; transform:rotate(90deg); margin:0 auto; } .cue-spectrum { grid-template-columns:minmax(0,1fr) 17px minmax(0,1fr); gap:5px; } .narrow-pair { gap:8px; } .nested-features { padding:8px 5px; } .nested-features > strong { font-size:11px; } .nested-features span { font-size:10px; } }
</style>
