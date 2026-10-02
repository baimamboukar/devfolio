---
title: Replicating Matryoshka Sparse Autoencoders
description: Replicating feature recovery and comparing Matryoshka and standard sparse autoencoders
tags:
  - Mechanistic Interpretability
  - Sparse Autoencoders
  - PyTorch
  - Replication
live_url: https://www.lesswrong.com/posts/EpLj8FTBdGvt44TTF/how-matryoshka-sparse-autoencoders-recover-feature
source_url: https://github.com/baimamboukar/replicating-matryoshka-sparse-autoencoders-paper
image: /matryoshka-saes-cover.png
icon: huggingface
featured: true
status: Published Writeup (LessWrong)
period: May 2026 - June 2026
role: Independent Researcher
about:
  - >-
    I independently replicated Matryoshka Sparse Autoencoders, reproducing controlled synthetic experiments that compare
    feature recovery with standard sparse autoencoders and extending the implementation to transformer activations.
  - >-
    The experiments examine feature splitting and absorption, and show why strong reconstruction performance does not
    necessarily establish faithful recovery of the underlying features. The public writeup documents the replication,
    implementation, results, and lessons from the tested settings.
  - >-
    I also investigated additional model settings to understand the scope of the method’s advantages over standard
    sparse autoencoders. The replication code and technical writeup are public.
stack:
  - PyTorch
  - Sparse Autoencoders
  - Synthetic feature hierarchies / Transformer activations
---
