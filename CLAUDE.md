# CLAUDE.md - BrewedOps Tracker

## Project Overview

**BrewedOps** is a React SPA (Vite + React 19) for Filipino VAs and freelancers. It provides free browser-based tools, a portfolio site, services page, booking flow, and a Fuelyx nutrition app landing page. Deployed on **Vercel**.

- **Live URL:** https://tools.brewedops.com
- **Framework:** React 19 + Vite 7 + React Router 7
- **Styling:** Inline styles (primary), Tailwind CSS 3 (utility classes in some components, shadcn/ui)
- **Auth:** Supabase (Google OAuth + email/password)
- **Animations:** Framer Motion / Motion
- **Icons:** @phosphor-icons/react, lucide-react, @tabler/icons-react
- **UI Primitives:** Radix UI + shadcn/ui components in `src/components/ui/`

## Mandatory Workflow

### Before Writing Any Code

1. **Read first, write second.** Always read the file(s) you intend to modify. Understand existing patterns before changing anything.
2. **Check the brand system.** Use colors, fonts, and theme helpers from `src/lib/brand.js` and `src/lib/theme.js`. Never hardcode colors without checking these files first.
3. **Check navigation duplication.** Nav bars are duplicated per page (no shared Nav component). If modifying navigation, update ALL files listed in the Navigation Files section below.

### After Writing Code

4. **Run the build** (`npm run build`) after every meaningful change. Fix all build errors before considering the task done.
5. **Run lint** (`npm run lint`) and fix any ESLint errors.
6. **Verify visually** - if the change is UI-related, describe what you expect to see and confirm the logic matches. Be skeptical of your own output.
7. **Check dark mode.** Every UI change must work in both `isDark: true` and `isDark: false`. Use `getTheme(isDark)` from `src/lib/theme.js` or `getBrandTheme(isDark)` from `src/lib/brand.js`.

### Skill Invocation

When the task matches a skill's domain, **always invoke the relevant skill** before writing code. Key skills to use:

- **`react-best-practices`** or **`react-patterns`** — for any React component work
- **`clean-code`** — for refactoring or structural changes
- **`web-performance-optimization`** — for bundle size, loading, or render performance work
- **`frontend-design`** or **`ui-ux-pro-max`** — for UI/UX decisions and visual design
- **`seo-fundamentals`** or **`schema-markup`** — for SEO-related changes (meta tags, structured data)
- **`verification-before-completion`** — invoke this BEFORE claiming any task is complete
- **`lint-and-validate`** — after writing code, validate quality
- **`web-design-guidelines`** — when reviewing or writing UI code
- **`tailwind-patterns`** — when working with Tailwind classes or shadcn/ui components
- **`accessibility`** — ensure WCAG compliance (aria labels, keyboard navigation, contrast)

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | React 19 + Vite 7 |
| Routing | react-router-dom v7 (BrowserRouter) |
| Styling | Inline styles + Tailwind 3 + shadcn/ui |
| Auth | Supabase (OAuth, email/password) |
| Animation | framer-motion + motion |
| Icons | @phosphor-icons/react (primary), lucide-react, @tabler/icons-react |
| State | useState/useEffect (no Redux/Zustand) |
| Deploy | Vercel (SPA rewrite in vercel.json) |
| Code splitting | React.lazy() + Suspense for all pages |

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, routing, auth state, theme state |
| `src/lib/brand.js` | Brand colors, fonts, theme generator, style helpers |
| `src/lib/theme.js` | Theme colors and common style generators |
| `src/lib/supabase.js` | Supabase client |
| `src/components/layout/MobileDrawer.jsx` | Shared mobile menu drawer |
| `src/components/layout/GuestToolLayout.jsx` | Wrapper for free tool pages |
| `src/components/SEO.jsx` | SEO meta tag component |

### Navigation Files (ALL must stay in sync)

Navigation is **duplicated** across these files. When modifying nav items, links, or dropdowns, update ALL of them:

- `src/components/HomePage.jsx`
- `src/pages/PortfolioPage.jsx`
- `src/pages/ServicesPage.jsx`
- `src/components/FuelyxPage.jsx`
- `src/components/AboutUs.jsx`
- `src/components/layout/MobileDrawer.jsx`
- `src/components/layout/GuestToolLayout.jsx`

### Dropdown Components (defined locally in each nav file)

- `ToolsDropdown` — links to free tools
- `AIToolsDropdown` — links to AI-powered tools
- `AppsDropdown` — links to Fuelyx and other apps (formerly "Fuelyx" dropdown)

## Brand & Design System

### Colors

```
Brown:  #3F200C  (primary text, headings)
Blue:   #004AAC  (buttons, links, accents)
Green:  #51AF43  (success states, CTA)
Cream:  #FFF0D4  (light backgrounds)
```

### Dark Mode Backgrounds

```
Page bg:    isDark ? '#0d0b09' : '#faf8f5'
Card bg:    isDark ? '#171411' : '#ffffff'
Card border: isDark ? '#2a2420' : '#e8e0d4'
Input bg:   isDark ? '#1e1a16' : '#faf8f5'
```

### Fonts

- Headings: `Montserrat` (600-800 weight)
- Body: `Poppins` (400-600 weight)

### Fuelyx Sub-brand

- Teal: `#14b8a6`, Emerald: `#10b981`

## Coding Standards

### React Patterns

- **Functional components only** — no class components
- **Code splitting** — all pages use `React.lazy()` + `<Suspense>`
- **Theme prop drilling** — `isDark` and `setIsDark` are passed as props (no context provider)
- **Inline styles** for layout components; Tailwind for shadcn/ui components
- **No shared nav component** — each page defines its own nav bar locally

### Style Rules

- Use `getTheme(isDark)` or `getBrandTheme(isDark)` for all theme-dependent colors
- Use brand constants from `src/lib/brand.js` — never hardcode `#004AAC` directly when the brand file exists
- Border radius: `10px` for inputs/buttons, `14px` for cards
- Transitions: `0.15s ease` standard
- Always handle both dark and light mode in every style object

### What NOT to Do

- Do NOT create a shared Nav component (the duplication is intentional for now)
- Do NOT add Redux, Zustand, or Context for theme — it's prop-drilled by design
- Do NOT add new font families without explicit approval
- Do NOT commit `.env` files or Supabase keys
- Do NOT add login/signup functionality — it has been intentionally removed from the public nav (account creation coming soon)
- Do NOT use `console.log` in production code
- Do NOT add new dependencies without stating why and getting approval

## Verification Checklist

Before marking ANY task as complete, verify:

- [ ] `npm run build` passes with zero errors
- [ ] `npm run lint` passes with zero errors
- [ ] Dark mode AND light mode both work correctly
- [ ] No hardcoded colors that should use theme/brand constants
- [ ] If nav was changed, ALL 7 navigation files are updated
- [ ] No `console.log` left in code
- [ ] No unused imports
- [ ] Mobile responsiveness considered (check for `useWindowSize` patterns)
- [ ] SEO component used on new pages (`<SEO title="" description="" />`)
- [ ] Accessibility basics: alt text on images, button labels, semantic HTML

## Common Patterns

### Adding a New Free Tool

1. Create component in `src/components/NewTool.jsx`
2. Add lazy import in `src/App.jsx`
3. Add route wrapped in `<GuestToolLayout>` in App.jsx
4. Add link to `ToolsDropdown` or `AIToolsDropdown` in ALL 7 nav files
5. Add link to `MobileDrawer.jsx`

### Adding a New Page

1. Create page in `src/pages/NewPage.jsx` or `src/components/NewPage.jsx`
2. Add lazy import and route in `src/App.jsx`
3. Include `<SEO>` component for meta tags
4. Support `isDark` / `setIsDark` props
5. Add nav bar with all dropdowns (copy from existing page)

### Theme-Responsive Styles

```jsx
const theme = getTheme(isDark);
// or
const theme = getBrandTheme(isDark);

const style = {
  backgroundColor: theme.cardBg,
  color: theme.text,
  border: `1px solid ${theme.cardBorder}`,
};
```
