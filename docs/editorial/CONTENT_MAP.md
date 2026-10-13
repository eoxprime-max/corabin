# Phase 2: Content Map

## Home Page Text Replacements
| Page | Section | Slot | Original | New | Action |
|---|---|---|---|---|---|
| Home | Hero | Logo/Brand | OPUS | CORABIN | Replace |
| Home | Hero | H1 | STUDIO OPUS | STUDIO CORABIN | Replace |
| Home | Value Prop | Intro Text | At Opus, we help companies build stronger brands, better products, and websites that actually perform. | At Corabin, we help companies build stronger brands, modern products, and websites that actually perform. | Replace |
| Home | Metrics | Metric 1 | 47+ Projects delivered | 25+ Projects delivered | Replace |
| Home | Metrics | Metric 2 | 95% Client retention | 99% On-time delivery | Replace |
| Home | Metrics | Metric 3 | $21M Client revenue impacted | $17M Client revenue impacted | Replace |
| Home | Services | 04 Title | 04 Motion Graphics | 04 App Development | Replace |
| Home | Mid CTA | Text | Our team brings together design... | Corabin brings together bespoke design... | Replace |
| Home | About | Counters | 19 talented individuals / 134+ projects / ∞ combined exp | 1:1 Direct collaboration / 25+ Projects / 5+ Years exp | Replace |
| Home | About | Headline | We are a group of positive thinkers... | We are a boutique digital studio... | Replace |
| Home | Pricing | Entire Section | (3-tier table) | (None) | Remove |
| Home | Testimonials | Content | (Various text) | (Various text mapped from MD) | Replace |
| Home | FAQ | Questions/Answers | (Various text) | (Mapped from MD) | Replace |

## About Us Page Replacements
| Page | Section | Slot | Original | New | Action |
|---|---|---|---|---|---|
| About | Hero | Headline | Building digital excellence since 2019 | Crafting modern digital experiences that perform | Replace |
| About | Story | Headline | From humble beginnings... | From a passion for craft... | Replace |
| About | Story | Quote Role | Markus Chen | Founder, Corabin | Replace |
| About | Culture | Section | LIFE AT OPUS... | (None) | Remove |
| About | Team | Grid | 8-person grid | Single Founder profile | Edit/Remove |

## Assets
- Need Logo (SVG preferred).
- Need 1 profile image for the Founder (Markus Chen -> Founder).
- Need portfolio project images (Home / Projects).
- *Currently these are missing from the prompt. Will keep placeholders or original abstract images until provided.*

## Blocking Questions & Needs From User
1. **Forms**: The Contact/FAQ form currently posts to a Framer endpoint. Where should we send form submissions? (e.g. Email webhook, Google Forms, Formspree).
2. **Missing Assets**: Do you have a logo file (SVG) and a founder photo? If not, I can replace the text "OPUS" and keep abstract placeholders.
3. **Template Badges**: Do you want the "Made in Framer" badge removed from the bottom?
4. **Implementation Approach**: Since we must handle React hydration, I propose modifying the `.mjs` files using string replacements to swap out the content directly in the hydration payloads, alongside replacing it in `index.html`. For sections to be removed (Pricing, Culture), I will `display: none` them in CSS and/or excise them from the DOM. Does this approach sound good?
