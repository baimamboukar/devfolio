---
title: 'Selection Regret: Auditing Deception Probes as Intervention Selectors'
description: Testing whether accurate deception probes can select useful interventions
tags:
  - Mechanistic Interpretability
  - Linear Probing
  - Activation Steering
  - Behavioral Evaluation
  - AI Safety
live_url: ''
source_url: https://github.com/baimamboukar/mechanistic-audit-of-deception-detection-in-llms
image: https://placehold.co/600x400?text=Deception+Audit
icon: pytorch
featured: true
status: Under Review
period: '2026'
role: Lead Researcher
about:
  - >-
    We investigate whether internal signals that detect deception also guide effective behavioral
    interventions. The audit evaluates linear deception probes across four instruction-tuned language models
    using controlled, task-defined deceptive decisions.
  - >-
    At each transformer block, we compare a probe-weight steering direction with a contrastive direction built
    from honest-minus-deceptive activations. Intervention layers and strengths are selected on held-out
    validation scenarios and evaluated on untouched test groups under explicit limits on capability loss.
  - >-
    Selection regret measures useful intervention benefit forgone when a probe-guided selection misses a
    better feasible intervention. Accurate detection and effective intervention require separate evidence:
    predictive performance does not consistently identify useful steering directions or layers.
  - >-
    I led the experimental design, implementation, and empirical evaluation, built the main research workflow,
    ran most experiments, and coordinated the analysis. This work began through the BlueDot Technical AI
    Safety Project Sprint.
stack:
  - Python
  - PyTorch
  - Linear Probes
  - Activation Steering
  - Held-out Behavioral Evaluation
---
