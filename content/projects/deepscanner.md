---
title: IBM DeepScanner
description: A scalable framework for detecting anomalies in LLM activations
tags:
  - Python
  - PyTorch
  - Ray
  - IBM Cloud
  - LLMs
live_url: "#"
source_url: "#"
image: "https://placehold.co/600x400?text=IBM+DeepScanner"
icon: "/icons/ibm.png"
featured: true
# Project Details
status: "Internal Tool"
role: "Research Engineer"

# About the Project
about:
  - "DeepScanner is a scalable infrastructure designed to reverse-engineer foundation models by analyzing their internal activation states. It enables researchers to detect anomalous patterns—such as hallucinations or toxic outputs—before they manifest in the generated text."
  - "I engineered the distributed workflow for this framework, optimizing the pipeline to run parallel experiments on the IBM Cloud Cognitive Cluster. This significantly reduced the time required to analyze large-scale models like Llama 3 and Granite."
  - "The system supports modular probing of different model layers and integrates seamlessly with existing training pipelines, making it a critical tool for AI safety and interpretability research."

# Stack
stack:
  - "Python"
  - "PyTorch"
  - "Ray (Distributed Computing)"
  - "IBM Cloud Cognitive Cluster"
  - "Hugging Face Transformers"
  - "Weights & Biases"

# Milestones
milestones:
  - title: "Architecture Design"
    date: "June 2025"
    description: "Designed the modular architecture for extracting and analyzing model activations"
  - title: "Distributed Pipeline"
    date: "July 2025"
    description: "Implemented Ray-based distributed processing to handle large-scale model data"
  - title: "Optimization"
    date: "August 2025"
    description: "Optimized data loading and tensor processing, achieving a 3x speedup in analysis time"
  - title: "Paper Submission"
    date: "August 2025"
    description: "Results contributed to a paper submission at AAAI 2026"
---
