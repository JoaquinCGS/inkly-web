# Design System

## Theme & Palette

**Strategy:** Committed but friendly. A warm off-white background with a distinct pastel pink primary color that carries the brand identity. Accents in light blue and soft yellow.

**Colors (OKLCH):**
- `--color-bg`: oklch(98.5% 0.005 350) /* Warm off-white */
- `--color-surface`: oklch(100% 0 0) /* Clean white */
- `--color-primary`: oklch(77% 0.12 350) /* Vibrant Pastel Pink */
- `--color-accent`: oklch(88% 0.06 240) /* Soft Light Blue */
- `--color-accent2`: oklch(92% 0.08 95) /* Soft Yellow */
- `--color-ink`: oklch(25% 0.02 350) /* Very dark warm gray for text */
- `--color-muted`: oklch(60% 0.01 350) /* Muted text */
- `--color-border`: oklch(92% 0.01 350)

**Dark Mode:**
- `--color-bg`: oklch(20% 0.01 350)
- `--color-surface`: oklch(25% 0.01 350)
- `--color-primary`: oklch(75% 0.12 350) /* Slightly desaturated for dark mode */
- `--color-ink`: oklch(95% 0.01 350)

## Typography

- **Display/Headings:** Playfair Display (Serif)
  - Scale: clamp(1.8rem, 4vw, 3rem) for H1
  - Letter spacing: `-0.02em` for large headers, never tighter than `-0.04em`.
  - Line height: 1.1 - 1.2
  - `text-wrap: balance`
- **Body:** Inter (Sans-serif)
  - Scale: 1rem / 16px
  - Line height: 1.6
  - `text-wrap: pretty` for long prose.

## Layout & Spacing

- Generous padding and margins to create a breathable, elegant canvas.
- No identical card grids. Use varied layouts to feature products.
- Real elevation: avoid 1px border + soft shadow "ghost cards". Use clean borders OR deliberate shadows, not both decoratively.

## Motion & Interaction

- **Curves:** `ease-out-quint` (`cubic-bezier(0.22, 1, 0.36, 1)`) for entrances. No elastic/bounce.
- **Hover States:** Subtle scale (`1.02`) and shadow elevation.
- **Staggering:** Intentional, avoiding the "uniform reflex" where everything cascades blindly.
- Full support for `@media (prefers-reduced-motion: reduce)`.
