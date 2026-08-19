# DECISIONS.md — CareerFlow Home Page (Part 2)

**Track:** Part 2 — The Premium Home Page
**Product:** CareerFlow — a local-first workspace for managing your job hunt. I chose this concept instead of a generic B2B SaaS dashboard because everyone relates to the frustration of managing applications, tabs, and follow-ups. A real, relatable problem makes it easier to write honest and compelling copy.

## 1. Why this approach over the obvious alternative?

**Vanilla HTML/CSS/JS instead of a framework like React/Next.js.** For a static landing page, a heavy frontend framework adds unnecessary build steps, bundle size, and runtime overhead without benefiting the end user. I prioritized a lightweight, dependency-free approach that loads instantly on mobile devices. The interactive elements (dark mode toggle, scroll reveals, the kanban board demo, confetti) are all handled with just a bit of vanilla JavaScript.

## 2. One trade-off under the time limit

The kanban capture interaction is a **simulated client-side demo**. It simply appends a new card to the DOM to show how the core loop works. While this demonstrates the value proposition effectively for a landing page, in a real scenario with more time, I would build a functional backend to store this state, tie the waitlist form to a real database/CRM, and add more extensive E2E testing for the UI interactions across different browsers.

## 3. AI usage and what I verified

I utilized AI to help structure the initial HTML semantics, brainstorm some copy variations, and generate the confetti animation physics. However, I **personally verified and adjusted** the responsive layout to ensure it works perfectly at both 390px (mobile) and 1440px (desktop) without any horizontal scrolling. I also fine-tuned the color palette for complete dark-mode support and verified the reduced-motion media query logic. Most importantly, I ensured all the copy is authentic — **there are no fabricated testimonials, fake user metrics, or invented customer logos.** The companies listed in the mock pipeline are strictly for the product demonstration.
