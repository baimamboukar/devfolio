---
title: Cross-model Transfer of Matryoshka Sparse Autoencoders
description: Replicating and extending Matryoshka SAEs across model families
tags:
  - Mechanistic Interpretability
  - Sparse Autoencoders
  - PyTorch
  - Replication
live_url: "https://www.lesswrong.com/posts/EpLj8FTBdGvt44TTF/how-matryoshka-sparse-autoencoders-recover-feature"
source_url: "https://github.com/baimamboukar/replicating-matryoshka-sparse-autoencoders-paper"
image: "/matryoshka-saes-cover.png"
icon: "huggingface"
featured: true
# Project Details
status: "Published Writeup (LessWrong)"
period: "May 2026 - June 2026"
role: "Independent Researcher"

# About the Project
about:
  - "A replication and extension of Matryoshka Sparse Autoencoders. I reproduced the paper's core result on the synthetic hierarchy and at scale on Gemma-2-2B, confirming that Matryoshka SAEs avoid the feature-absorption failure mode that vanilla SAEs exhibit."
  - "I then transferred the setup to other model families — Llama-3.1-8B and Gemma-3-12B — to test how well the result generalizes beyond the original setting, and documented the full replication in a public writeup on LessWrong."
  - "This project is part of my broader research direction on the generalizability of mechanistic interpretability methods: understanding when results established on one model transfer to others."

# Stack
stack:
  - "PyTorch"
  - "Sparse Autoencoders"
  - "Gemma-2-2B / Llama-3.1-8B / Gemma-3-12B"
---
