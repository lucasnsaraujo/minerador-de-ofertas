# 🍷 AdMiner Design System
## Wine & Vineyard Inspired Color Palette

---

## Brand Identity

**AdMiner** - Um rastreador inteligente de ofertas com identidade visual inspirada em vinícolas e vinhedos. A paleta transmite sofisticação, confiança e tradição, com toques de luxo e elegância.

---

## Color Palette

### 🍷 Primary Colors (Wine Tones)
Cores principais que representam a marca e são usadas em botões, links e elementos de destaque.

| Color | Hex | Usage |
|-------|-----|-------|
| **Burgundy** | `#6B1B3D` | Primary Dark - Botões hover, texto escuro |
| **Wine** | `#8B2F52` | Primary - Botões principais, links, foco |
| **Rose** | `#B85478` | Primary Light - Modo escuro, acentos |
| **Blush** | `#D4889E` | Accent Soft - Hover states suaves |

### 🌿 Secondary Colors (Vineyard)
Cores secundárias para contrastar e balancear a paleta.

| Color | Hex | Usage |
|-------|-----|-------|
| **Grape** | `#4A2C4F` | Deep Purple - Acentos escuros |
| **Moss** | `#5C7457` | Vineyard Green - Botões accent |
| **Sage** | `#8FA88E` | Sage Green - Acentos suaves |
| **Oak** | `#8B6F47` | Oak Brown - Elementos terrosos |

### ✨ Accent Colors (Golden Hour)
Cores de acento para destaques especiais e CTAs secundários.

| Color | Hex | Usage |
|-------|-----|-------|
| **Gold** | `#D4A574` | Golden Hour - Botões secundários |
| **Champagne** | `#E8C9A0` | Light Accent - Backgrounds |
| **Amber** | `#C8915F` | Amber Glow - Acentos quentes |

### 🎨 Neutral Colors (Wine Cellar)
Cores neutras para backgrounds, texto e elementos de interface.

| Color | Hex | Usage |
|-------|-----|-------|
| **Charcoal** | `#2D2424` | Dark Text - Texto escuro |
| **Slate** | `#4A3F3F` | Dark Gray - Backgrounds escuros |
| **Cream** | `#F5EDE4` | Light Background - Fundo claro |
| **Pearl** | `#FAF6F1` | Off White - Fundo mais claro |

---

## Gradients

### Primary Gradients
```css
--gradient-wine: linear-gradient(135deg, #8B2F52 0%, #6B1B3D 100%);
--gradient-sunset: linear-gradient(135deg, #B85478 0%, #D4A574 50%, #8B6F47 100%);
--gradient-vineyard: linear-gradient(135deg, #4A2C4F 0%, #5C7457 100%);
--gradient-cellar: linear-gradient(135deg, #2D2424 0%, #4A3F3F 100%);
```

### Usage
- **Wine**: Botões principais, headers
- **Sunset**: Headers especiais, hero sections
- **Vineyard**: Botões accent, cards
- **Cellar**: Modo escuro, backgrounds

---

## Components

### Buttons

#### Variants

**Default** (Wine Gradient)
```tsx
<Button>Adicionar Oferta</Button>
```
- Gradient: Wine → Burgundy
- Shadow: Soft glow, enhanced on hover
- Brightness: 110% on hover (subtle lift)

**Secondary** (Gold Gradient)
```tsx
<Button variant="secondary">Filtrar</Button>
```
- Gradient: Gold → Amber
- Text: Charcoal
- Shadow: Soft glow, enhanced on hover
- Brightness: 110% on hover

**Accent** (Vineyard Gradient)
```tsx
<Button variant="accent">Ver Mais</Button>
```
- Gradient: Moss → Sage
- Text: White
- Shadow: Soft glow, enhanced on hover
- Brightness: 110% on hover

**Outline**
```tsx
<Button variant="outline">Cancelar</Button>
```
- Border: Wine/Rose
- Background: Transparent → Wine/5% on hover
- Text: Wine/Rose

**Ghost**
```tsx
<Button variant="ghost">Fechar</Button>
```
- Background: Transparent → Wine/10% on hover
- Text: Wine/Rose

#### Sizes
- **sm**: Height 9 (36px), padding 4, text xs
- **default**: Height 10 (40px), padding 5, text sm
- **lg**: Height 12 (48px), padding 8, text base

---

## Typography

### Font Weights
- **Regular**: 400 (Texto corrente)
- **Medium**: 500 (Subtítulos)
- **Semibold**: 600 (Destaque)
- **Bold**: 700 (Botões, labels)
- **Black**: 900 (Headings, títulos principais)

### Tracking
- **Default**: normal
- **Wide**: 0.025em (Botões, labels)
- **Tight**: -0.025em (Headings grandes)

---

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(107 27 61 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(107 27 61 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(107 27 61 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(107 27 61 / 0.15);
--shadow-wine-glow: 0 0 30px rgba(139, 47, 82, 0.4);
--shadow-gold-glow: 0 0 30px rgba(212, 165, 116, 0.3);
```

---

## Border Radius

```css
--radius-sm: 0.5rem;   /* 8px */
--radius-md: 0.75rem;  /* 12px */
--radius-lg: 1rem;     /* 16px */
--radius-xl: 1.5rem;   /* 24px */
--radius-full: 9999px; /* Circular */
```

---

## Animations

### Design Philosophy
**Smooth, Fluid, Beautiful** - No scale animations. All interactions use brightness, opacity, and shadow transitions for a sophisticated, refined feel.

### Timing Functions
```css
--transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-base: 350ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-smooth: 600ms cubic-bezier(0.16, 1, 0.3, 1);
--transition-bounce: 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Available Animations
- `animate-fade-in`: Fade in with subtle slide up
- `animate-slide-in`: Slide in from left
- `animate-slide-up`: Smooth slide up (modals)
- `animate-pulse-glow`: Pulsing glow effect (Wine color)
- `animate-shimmer`: Shimmer loading effect
- `animate-float`: Gentle floating animation
- `animate-gradient`: Animated gradient background
- `animate-glow`: Smooth opacity pulse
- `smooth-hover`: Apply to interactive elements for unified hover behavior

### Hover States
All interactive elements use:
- **Brightness**: 110% on hover (subtle lift)
- **Shadow**: Enhanced glow matching component color
- **Duration**: 350ms with smooth easing
- **NO SCALE**: Avoid jarring scale transforms

---

## Inputs

### Focus States
```css
focus:border-[#8B2F52]
focus:ring-[#8B2F52]/20
focus:ring-2
```

### Input Types
- Text, Password, Email, URL, Number
- Border radius: `rounded-lg` (12px)
- Transition: All properties with 300ms

---

## Special Effects

### Scrollbar
- Width: 8px
- Track: Gray background
- Thumb: Wine/30% → Wine/50% on hover
- Border radius: Full (circular)

### Text Selection
- Background: Rose/30%
- Text: Charcoal

### Custom Scrollbar
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb {
  @apply bg-[#8B2F52]/30 hover:bg-[#8B2F52]/50 rounded-full;
}
```

---

## Usage Examples

### Hero Section
```tsx
<div className="bg-gradient-to-r from-[#8B2F52] via-[#D4A574] to-[#5C7457]">
  <h1 className="text-white font-black">AdMiner</h1>
</div>
```

### Card with Hover
```tsx
<Card className="border-2 hover:shadow-xl transition-all duration-300">
  <CardContent>...</CardContent>
</Card>
```

### Modal Header
```tsx
<div className="bg-gradient-to-r from-[#8B2F52] to-[#6B1B3D] p-6 text-white">
  <h2 className="font-black">Nova Oferta</h2>
</div>
```

---

## Accessibility

- **Contrast Ratios**: Todas as combinações de cor/texto atendem WCAG AA
- **Focus Indicators**: Anel de foco visível em Wine (#8B2F52)
- **Touch Targets**: Mínimo 44x44px para botões principais
- **Font Sizes**: Mínimo 14px (0.875rem) para texto corrente

---

## Dark Mode

O sistema automaticamente ajusta cores para o modo escuro:
- Wine → Rose (mais claro)
- Burgundy → Blush (mais claro)
- Charcoal backgrounds
- Borders mais escuros (Gray 700)

---

## Files

- **CSS Variables**: `client/src/index.css`
- **Button Component**: `client/src/components/ui/button.tsx`
- **Card Component**: `client/src/components/ui/card.tsx`
- **Badge Component**: `client/src/components/ui/badge.tsx`
- **Input Component**: `client/src/components/ui/input.tsx`
