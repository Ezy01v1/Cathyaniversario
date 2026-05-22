---
name: Pixel Heart Anniversary
colors:
  surface: '#fff8f7'
  surface-dim: '#e1d8d8'
  surface-bright: '#fff8f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf1f1'
  surface-container: '#f5ecec'
  surface-container-high: '#f0e6e6'
  surface-container-highest: '#eae0e0'
  on-surface: '#1f1b1b'
  on-surface-variant: '#514345'
  inverse-surface: '#342f30'
  inverse-on-surface: '#f8eeee'
  outline: '#837375'
  outline-variant: '#d5c2c4'
  surface-tint: '#81515a'
  primary: '#81515a'
  on-primary: '#ffffff'
  primary-container: '#ffc0cb'
  on-primary-container: '#7b4b55'
  inverse-primary: '#f4b6c1'
  secondary: '#b60059'
  on-secondary: '#ffffff'
  secondary-container: '#e30071'
  on-secondary-container: '#fffbff'
  tertiary: '#9d4139'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffc2ba'
  on-tertiary-container: '#963c34'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#f4b6c1'
  on-primary-fixed: '#330f19'
  on-primary-fixed-variant: '#663a43'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0044'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#7e2b23'
  background: '#fff8f7'
  on-background: '#1f1b1b'
  surface-variant: '#eae0e0'
typography:
  headline-lg:
    fontFamily: Press Start 2P
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  headline-md:
    fontFamily: Press Start 2P
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-sm:
    fontFamily: Press Start 2P
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 16px
  button-text:
    fontFamily: Press Start 2P
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 12px
spacing:
  pixel-unit: 4px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  container-max: 600px
---

## Brand & Style

This design system is built on **Retro-Tactile Minimalism**, merging the nostalgic charm of 8-bit gaming with the warmth of a romantic milestone. The personality is heartfelt, cozy, and playful, designed to evoke the feeling of a cherished handheld console game from the late 80s. 

The target audience is a romantic partner, prioritizing emotional resonance over complex utility. The interface uses a "physical pixel" metaphor where every border, shadow, and icon feels like it was hand-placed on a grid. Visual hierarchy is achieved through exaggerated 3D offsets and high-contrast outlines that make interactive elements feel "clickable" and physical.

## Colors

The palette uses a monochromatic pink base accented by high-contrast burgundy for maximum legibility. 

- **Primary (Soft Pink):** Used for large background areas and secondary button states.
- **Secondary (Vibrant Rose):** Reserved for primary actions, decorative highlights, and progress indicators.
- **Text (Deep Burgundy):** The singular choice for all typography and structural outlines to maintain a cohesive "ink-on-paper" feel.
- **Base (Creamy White):** Used for container backgrounds to provide a soft, paper-like contrast against the pink environments.

## Typography

This design system employs a dual-font strategy. **Press Start 2P** (or a similar monospaced pixel font) is used for headings, buttons, and short labels to reinforce the 8-bit aesthetic. Because pixel fonts can be difficult to read in long forms, **Plus Jakarta Sans** is used for body text, providing a clean, contemporary contrast that ensures the "heartfelt" messages are easily digestible.

All pixelated text should avoid anti-aliasing where possible to maintain sharp edges. Headings should always be in sentence case or uppercase to lean into the retro-game UI style.

## Layout & Spacing

The layout follows a **Fixed-Width Centered** model. Since the game is narrative-driven, the content is housed in central panels that act as "game screens." 

- **Grid:** All elements are aligned to a 4px "pixel unit" grid. Spacing between elements should always be a multiple of 4.
- **Responsiveness:** On desktop, the central container is capped at 600px to maintain the look of a classic game window. On mobile, the container expands to fill the width minus a 20px margin.
- **Padding:** Use generous internal padding within panels (24px to 32px) to let the pixel art elements breathe.

## Elevation & Depth

Depth is conveyed through **Hard-Edge 3D Offsets** rather than blurs.

- **Primary Panels:** Use a solid 4px or 8px offset shadow in Deep Burgundy or a darker shade of Pink to simulate a physical board.
- **Buttons:** Feature a bottom-heavy "extruded" look. When pressed, the button should shift down by 2-4 pixels and the shadow should disappear, simulating a physical mechanical press.
- **Overlays:** Semi-transparent panels use a 90% opacity Creamy White with a 2px dotted Burgundy border to create a "UI window" effect that feels lighter than the main gameplay containers.

## Shapes

The shape language is strictly **Sharp (0px)**. To maintain the 8-bit integrity, no true curves are allowed. Instead, "rounded" appearances are achieved through stair-stepped pixel clusters. 

Containers should feature 2px solid Burgundy outlines. For special decorative sections, use a "stamped" heart border—a repeating pixel-heart pattern that acts as a frame for photos or key messages.

## Components

### Buttons
Primary buttons are Vibrant Rose with a 4px Deep Burgundy bottom shadow and white pixel text. Secondary buttons use the Soft Pink base. All buttons must have a 2px solid border.

### Panels & Cards
Main content areas use a Creamy White background. These are framed with a 4px Burgundy border. On the top or bottom edge, a decorative 8px "ribbon" of Vibrant Rose can be added for extra flair.

### Decorative Borders
Special "Heart Borders" are used for photo frames. These consist of a repeating 8x8 pixel heart icon pattern in Rose and Pink.

### Interactive Elements
- **Checkboxes:** Small 16x16px squares that fill with a pixel heart when selected.
- **Dotted Containers:** For "hints" or "clues," use a panel with a dashed/dotted border (2px squares with 4px gaps).
- **Progress Bars:** Represented as a row of hearts. "Filled" hearts are Vibrant Rose; "Empty" hearts are Burgundy outlines with a Soft Pink fill.

### Icons
All icons must be strictly grid-aligned pixel art, using a 16x16 or 32x32 canvas. Avoid any non-square angles.