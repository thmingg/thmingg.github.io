---
title: "Virtual Try-On SaaS (Mannequio)"
description: "Next.js product for AI Virtual Try-On with garment upload, outfit composition, direct-to-S3 uploads, NextAuth, Stripe credits, and real-time job status over NestJS and BullMQ."
company: "DT Technologies"
role: "Full Stack Developer"
period: "Feb 2025 – Current"
stack:
  - Next.js
  - NestJS
  - PostgreSQL
  - BullMQ
  - AWS
  - Stripe
featured: true
order: 2
heroImage: ./images/mannequio-hero.svg
# Optional media:
# videoUrl: https://www.youtube.com/watch?v=VIDEO_ID
# gallery:
#   - ./images/mannequio-1.png
---

## Overview

Mannequio is an AI Virtual Try-On SaaS. Users upload garments, compose outfits, pick models and poses, then review generated results asynchronously while long-running jobs run in the background.

## Highlights

- Next.js (React 19) product UI for upload, composition, and result viewing
- Direct-to-S3 uploads via presigned URLs
- CloudFront-signed delivery of generated images
- NextAuth with credentials and Google sign-in
- Credit-based Stripe billing UX
- Real-time job status via SSE and polling
- NestJS APIs with BullMQ-backed generation workers

## Role

Owned the Next.js web product experience and collaborated on the NestJS/BullMQ job pipeline so the client stays responsive under long-running AI workloads.

## Media

Add a product demo by setting `videoUrl` (YouTube, Vimeo, or a direct `.mp4` URL) and screenshots via `heroImage` / `gallery` in frontmatter, or inline markdown images under `./images/`.
