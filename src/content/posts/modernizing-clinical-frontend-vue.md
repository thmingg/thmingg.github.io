---
title: "Modernizing a clinical frontend from VB.NET to Vue"
author: "Daniel Tsang"
pubDatetime: 2026-07-20T10:00:00.000+08:00
featured: false
draft: false
tags:
  - vue
  - frontend
  - modernization
description: "Lessons from leading a VB.NET-to-Vue migration for a clinical management system — modules, collaboration, and shipping incrementally."
timezone: "Asia/Hong_Kong"
---

At TabNext Asia I worked part-time on a clinical management system. The biggest frontend effort was moving core medical workflows off VB.NET and onto Vue, while the backend stayed on C# / ASP.NET Core and MSSQL.

## Why migrate

Legacy UI stacks make day-to-day product work slower: harder hiring, weaker component reuse, and painful iteration on modules clinicians use constantly. Vue gave us a clearer component model and a path to ship Vaccination, Prescription, and Patient Profiles as focused pieces instead of one monolithic screen.

## What mattered in practice

**Incremental delivery.** We didn’t rewrite everything at once. New Vue modules landed alongside existing flows so the operations team could keep working.

**Domain modules first.** Vaccination, Prescription, and Patient Profiles were the highest-leverage surfaces — getting those right reduced friction for the people who used the system every day.

**Remote Agile habits.** Daily standups, code reviews, and ClickUp kept an international team aligned when we couldn’t sit in the same room.

## Takeaway

Frontend modernization is less about picking a fashionable framework and more about carving a safe path from legacy UI to maintainable components — without freezing product delivery. That same mindset shows up later when pairing React/Next.js web apps with Flutter clients and cloud backends: ship the critical path, keep the system usable, and improve the foundation as you go.
