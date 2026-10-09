---
name: Fintech Conversational Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#95d3ba'
  on-secondary: '#003829'
  secondary-container: '#0b513d'
  on-secondary-container: '#83c2a9'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00b982'
  on-tertiary-container: '#00422c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-currency:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-currency-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-lg: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system expresses institutional financial trust fused with the fluid intimacy of conversational artificial intelligence. It serves modern, financially conscious individuals seeking intelligent wealth tracking, algorithmic budgeting, and immediate advisory dialogues without dense institutional friction. 

The aesthetic blends **Modern Corporate** clarity with **Soft Conversational Glassmorphism**. Interfaces feel crisp, calm, and deliberate. Surfaces prioritize breathability and legibility, using micro-tonal elevation rather than harsh skeuomorphic physical cues. Visual cues evoke precision, safety, and algorithmic intelligence through luminous jewel accents, subtle glass-sheen borders, and disciplined typography.

## Colors

The system uses a dark-first foundation engineered around deep slate and midnight obsidian, allowing luminous emerald and teal tones to direct eye tracking toward financial metrics and AI responses.

### Palette Architecture
- **Primary Emerald (`#10B981`)**: Represents positive equity, verified status, active states, and user actions. Emits vitality and security.
- **Secondary Deep Forest (`#064E3B`)**: Serves as deep structural anchors, high-contrast containers, and base backgrounds for highlighted visual summaries.
- **Tertiary Soft Mint (`#34D399`)**: Used for luminous highlights, micro-interactions, AI typing pulses, and predictive metrics.
- **Neutral Dark Slate (`#0F172A`)**: Base surface of the canvas. Extended through:
  - Surface Tier 1 (Background): `#090D16`
  - Surface Tier 2 (Card / Canvas): `#0F172A`
  - Surface Tier 3 (Raised Bubbles / Inputs): `#1E293B`
  - Border Subdued: `#334155` with 40% alpha for subtle visual separation.
  - Text Primary: `#F8FAFC`
  - Text Secondary: `#94A3B8`
  - Text Muted: `#64748B`
- **Semantic Accents**:
  - Danger / Outflow: `#F43F5E` (Rose)
  - Warning / Advisory: `#F59E0B` (Amber)
  - Information: `#0EA5E9` (Sky)

## Typography

Plus Jakarta Sans provides geometric stability with humanist warmth, preventing conversational interactions from feeling mechanical while maintaining dense tabular data legibility.

### Rules of Usage
- **Tabular Alignment**: All numerical instances (monetary totals, percentages, ledger items) must render with `font-feature-settings: "tnum" on, "cv05" on` to enforce monospaced widths and tabular alignment across horizontal summaries.
- **Display Currency**: Dedicated to total net worth cards, primary transaction confirmations, and quick financial summary headers. Negative numbers consistently prefix the currency symbol (`-$1,250.00`).
- **Hierarchy Separation**: Conversational dialogue bubbles use `body-md` for natural pacing. System breakdowns within chat use `headline-sm` headers paired with micro-labels (`label-caps`) for structural metadata like timestamps, transaction categories, and ticker references.

## Layout & Spacing

The layout model is optimized around a continuous conversational stream embedded with modular financial widgets. 

### Spacing Principles
- **Grid Layout**: On mobile viewports, the interface adheres to a 4-column fluid layout with `1rem` outer margins and `0.75rem` column gutters. For tablet and wider viewports, an 8-column layout anchors conversational widgets inside a centralized 640px maximum content track.
- **Vertical Stream Cadence**:
  - Distance between disparate chat clusters: `space-xl` (1.5rem).
  - Distance between consecutive messages from the same sender: `space-xs` (0.25rem).
  - Component interior padding for data-heavy cards: `space-lg` (1rem).
  - Action pill rail separation: `space-sm` (0.5rem).
- **Safe Zones**: Input docking bars at bottom viewports utilize dynamic safe-area bottom insets alongside an additional `space-md` (0.75rem) buffer to avoid gesture interference on modern mobile OS layers.

## Elevation & Depth

This design system rejects heavy, muddy drop shadows in favor of **Tonal Layering** enhanced by subtle emerald-tinted ambient glows and micro-borders.

### Depth Hierarchy
- **Level 0 (Canvas Base)**: `#090D16`. Background for the continuous stream. Zero elevation.
- **Level 1 (Card & AI Dialogue Bubble)**: Surface `#0F172A` paired with a 1px border of `rgba(255, 255, 255, 0.06)`. Flat, grounded depth.
- **Level 2 (Interactive Modules & User Bubbles)**:
  - User Bubbles: Primary gradient (`#10B981` to `#059669`) with an ambient drop-glow: `0px 4px 16px rgba(16, 185, 129, 0.20)`.
  - Financial Cards / Bottom Sheets: Surface `#1E293B`, border `rgba(255, 255, 255, 0.1)`, subtle shadow `0px 8px 24px rgba(0, 0, 0, 0.35)`.
- **Level 3 (Floating Inputs & Modals)**: Surface `#1E293B` backed by `backdrop-filter: blur(16px)` with `rgba(15, 23, 42, 0.85)`. Border `rgba(52, 211, 153, 0.25)` to indicate dynamic listening/input focus.

## Shapes

The shape system employs balanced geometric roundness (`0.5rem` / 8px baseline) scaled to create tactile conversational bubbles and distinct action items.

- **Standard Cards & Financial Breakdown Modules**: `rounded-lg` (1rem / 16px) for approachable yet professional framing.
- **Action Pills & Quick Prompts**: Fully rounded pill shapes (`9999px`) to invite immediate touch interaction.
- **Chat Bubbles**:
  - Incoming (AI Assistant): `1.25rem` (20px) on top-left, top-right, bottom-right; `0.25rem` (4px) on bottom-left anchor point.
  - Outgoing (User): `1.25rem` (20px) on top-left, top-right, bottom-left; `0.25rem` (4px) on bottom-right anchor point.
- **Inputs & Action Buttons**: `0.75rem` (12px) for structural integrity and alignment with native keyboard targets.

## Components

### 1. Buttons
- **Primary Action**: Emerald background (`#10B981`), text `#090D16` (`label-lg`), height 48px, radius `0.75rem`. Subtle pressed scale animation (`scale: 0.98`).
- **Secondary / Ghost**: Background `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(255, 255, 255, 0.1)`, text `#F8FAFC`.
- **Icon Buttons**: 40x40px surface, centered SVG vector, 12px padding, radius `0.75rem`.

### 2. Conversational Bubbles
- **FinBot AI (Incoming)**: Background `#1E293B`, text `#F8FAFC`, border `1px solid rgba(255, 255, 255, 0.07)`. May house internal interactive components (transaction lists, sparklines, chart previews).
- **User (Outgoing)**: Background linear gradient (`135deg`, `#10B981` to `#059669`), text `#FFFFFF`, font weight `500`.

### 3. Quick Action Pills
- Horizontally scrollable row positioned above the input bar.
- Height: 34px.
- Surface: `rgba(16, 185, 129, 0.1)`, border `1px solid rgba(16, 185, 129, 0.25)`, text `#34D399` (`label-md`).
- Focus/Active: Background `#10B981`, text `#090D16`.

### 4. Financial Breakdown Cards (In-Chat Widgets)
- Contained within assistant responses.
- Surface `#0F172A` inside the bubble, radius `0.75rem`, internal padding `space-md`.
- Top row: Category tag (`label-caps`) + trend indicator (up/down delta in green/rose).
- Value row: Big tabular currency text (`display-currency-mobile`).
- Bottom row: Micro progress bar representing spent vs. limit with track `#334155` and fill `#10B981`.

### 5. Status Indicators
- **AI Processing Pulse**: A 3-dot animated pulse using `#34D399` with alternating scale (0.8 to 1.2) and opacity (0.4 to 1.0).
- **Financial Security Badge**: 18px pill with an emerald checkmark, label `#34D399`, text "256-BIT ENCRYPTED" in `label-caps`.

### 6. Input Fields (Conversational Dock)
- Persistent docked container with `backdrop-filter: blur(12px)`.
- Inner field: Background `#0F172A`, border `1px solid rgba(255, 255, 255, 0.1)`, radius `1rem`, padding `0.75rem 1rem`.
- Focus state: Border transitions to `#10B981` with ambient shadow `0 0 0 3px rgba(16, 185, 129, 0.15)`.
- Trailing actions: Dedicated mic / speech toggle and send button within the field boundary.