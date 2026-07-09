---
title: Mechanistic Audit of Deception Detection in LLMs
description: Do interpretability methods actually localize deception? A model-agnostic audit
tags:
  - Interpretability
  - Linear Probing
  - Activation Patching
  - Steering
  - AI Safety
live_url: "https://github.com/baimamboukar/mechanistic-audit-of-deception-detection-in-llms"
source_url: "https://github.com/baimamboukar/mechanistic-audit-of-deception-detection-in-llms"
image: "https://placehold.co/600x400?text=Deception+Audit"
icon: "pytorch"
featured: true
# Project Details
status: "Active Research"
period: "March 2026 - Present"
role: "Researcher (BlueDot Technical AI Safety Sprint)"

# About the Project
about:
  - "A mechanistic audit of whether popular interpretability methods actually localize deception in large language models. I built a model-agnostic interpretability pipeline — activation extraction, linear probing, activation patching, and steering — and ran multi-seed experiments across four open-weights models spanning 2B to 32B parameters."
  - "The project introduces a selection-regret evaluation with norm-matched controls. Current results show that high probe AUROC fails to localize effective steering: the layers where deception is most linearly decodable are not the layers where interventions most change deceptive behavior."
  - "This work started as a BlueDot Impact Technical AI Safety Project Sprint under expert mentorship, probing for deceptive alignment in LLMs, and continues as an independent research project."

# Stack
stack:
  - "PyTorch"
  - "TransformerLens"
  - "Linear Probes"
  - "Activation Patching & Steering"
---
