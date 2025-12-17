# Variables
PM := pnpm

.PHONY: all help install dev build start lint clean push

# Default target
all: help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  install    Install dependencies"
	@echo "  dev        Start development server"
	@echo "  build      Build for production"
	@echo "  start      Start production server"
	@echo "  lint       Run linter"
	@echo "  clean      Clean build artifacts"
	@echo "  push       Git add (untracked), commit individually, and push"

# Dependencies
install:
	$(PM) install

# Development
dev:
	$(PM) run dev

# Production
build:
	$(PM) run build

start:
	$(PM) run start

# Quality Control
lint:
	$(PM) run lint

# Maintenance
clean:
	rm -rf .nuxt .output dist

# Deployment / Git
push:
	@for file in $$(git ls-files --other --exclude-standard); do \
		git add "$$file"; \
		git commit -m "chore: add $$file"; \
	done
	git push origin main

deploy: build push
	@echo "Deploying to Vercel..."
	vercel --prod
	@echo "Deployment complete..."