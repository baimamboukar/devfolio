---
title: Cross-Model Generalization of Mechanistic-Interpretability Probes
description: A reproduction-first audit of activation-probing methods across model families
tags:
  - Mechanistic Interpretability
  - Activation Probes
  - Generalization
  - Replication
live_url: ''
source_url: https://github.com/baimamboukar/generalizable-interpretability
image: https://placehold.co/600x400?text=Probe+Generalization
icon: pytorch
featured: true
status: Manuscript
period: '2026'
role: Research Assistant, Jinesis AI Lab
about:
  - >-
    We study when activation-probing findings generalize across model families. The audit first reproduces
    selected methods under their original conditions, then evaluates the recovered findings on additional
    models.
  - >-
    Every target model receives a newly fitted probe using activations from that model; the language-model
    weights remain fixed. The experiment tests method generalization by independently refitting probes on each
    model.
  - >-
    Targeted experiments examine how response generation and labels, activation-site selection, probe
    architecture, and operating thresholds affect the scope of a generalization claim. I contributed
    experimental implementation, model runs, result analysis, and investigation of variation across evaluation
    conditions.
stack:
  - Python
  - PyTorch
  - Hugging Face Transformers
  - Activation Probing
  - Controlled Evaluation
---
