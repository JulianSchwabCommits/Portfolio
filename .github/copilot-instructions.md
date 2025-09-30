# Portfolio Copilot Instructions

## Architecture Overview

This is a React portfolio site deployed on **Cloudflare Pages** with serverless functions. The architecture consists of:

- **Frontend**: Vite + React + TypeScript with shadcn/ui components and Tailwind CSS
- **Backend**: Cloudflare Pages Functions in `/functions/api/` (chat.js, data.js)
- **Database**: Supabase for portfolio data and analytics
- **AI Chat**: Gemini API integration for the portfolio assistant "Max"
- **Security**: Custom Cloudflare Worker (`src/worker.js`) for security headers

## Key File Structure

- `/src/pages/` - Route components (Work, About, Play, Contact, ProjectDetail, ExperienceDetail)
- `/src/components/` - Reusable React components with `/ui/` subfolder for shadcn components
- `/src/context/` - ChatContext.tsx (chat state), ThemeContext.tsx (dark/light theme)
- `/src/lib/` - `api_client.ts` (secure API wrapper), `utils.ts` (cn utility for Tailwind)
- `/functions/api/` - Cloudflare Pages Functions for backend API endpoints

## Development Patterns

### Component Structure
- Use `PageTransition` wrapper for all page components with Framer Motion animations
- UI components in `/components/ui/` follow shadcn/ui patterns with `cn()` utility for className merging
- Custom components use TypeScript interfaces and proper prop typing

### Data Fetching
- **Never use Supabase client directly** - use `apiClient` from `/src/lib/api_client.ts`
- API endpoints: `/api/data?table=projects|experiences|about&id=optional`
- Chat endpoint: `/api/chat` (POST with messages array and systemPrompt)

### State Management
- React Context for global state: `ChatContext` for chat, `ThemeContext` for theming
- TanStack Query (`@tanstack/react-query`) for server state management
- Local state with `useState` for component-specific data

### Styling
- Tailwind CSS with custom theme extensions in `tailwind.config.ts`
- CSS custom properties for theming (light/dark mode)
- Framer Motion for animations and page transitions

## Critical Workflows

### Development
```bash
npm run dev          # Start dev server on localhost:8080
npm run build:dev    # Build for development
npm run build:prod   # Build for production
npm run deploy       # Build and deploy to Cloudflare Pages
```

### Adding New Components
1. Create in appropriate `/src/components/` subdirectory
2. Use TypeScript interfaces for props
3. Import from `@/components/...` using path alias
4. **MANDATORY**: Import and use `DESIGN_TOKENS` from `@/design-tokens` for all styling
5. Follow shadcn/ui patterns for UI components (see updated examples in `/components/ui/`)

**Updated UI Components Using Design Tokens:**
- All `/components/ui/` components now use centralized design tokens
- Examples: `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `tooltip.tsx`, `badge.tsx`
- **Never use hardcoded values** - always reference `DESIGN_TOKENS` constants

### Chat System Integration
- Chat context provides: `messages`, `setMessages`, `isLoading`, `systemPrompt`
- Use `generate_system_prompt()` in Chatbot component with portfolio data
- Chat API expects: `{ messages: Message[], systemPrompt: string }`

## Design System Specification

### CRITICAL: Use Design Tokens System
**ALWAYS import and use design tokens from `/src/design-tokens.ts`** instead of hardcoded values:

```typescript
import { DESIGN_TOKENS, commonPatterns } from '@/design-tokens';

// ✅ CORRECT - Use design tokens
className={`${DESIGN_TOKENS.GLASS.PRIMARY} ${DESIGN_TOKENS.SPACING.CARD_PADDING} ${DESIGN_TOKENS.BORDER_RADIUS.PRIMARY_CARD}`}

// ❌ WRONG - Hardcoded values
className="glass-morphism p-8 rounded-2xl"

// ✅ QUICK PATTERNS - Use common combinations
className={commonPatterns.STANDARD_CARD}
```

### Border Radius Standards
- **Primary Cards**: `DESIGN_TOKENS.BORDER_RADIUS.PRIMARY_CARD` (`rounded-2xl`)
- **Secondary Elements**: `DESIGN_TOKENS.BORDER_RADIUS.SECONDARY` (`rounded-xl`)
- **Interactive Pills**: `DESIGN_TOKENS.BORDER_RADIUS.BUTTON_PILL` (`rounded-full`)
- **Form Controls**: `DESIGN_TOKENS.BORDER_RADIUS.FORM_ELEMENT` (`rounded-md`)

### Mobile-First Responsive Design
- **Page Containers**: Use `DESIGN_TOKENS.SPACING.PAGE_CONTAINER` for consistent margins
- **Grid Layouts**: Use `DESIGN_TOKENS.RESPONSIVE.PROJECTS_GRID` or `TWO_COLUMN`
- **Card Padding**: Mobile `CARD_PADDING_MOBILE` (p-6) → Desktop `CARD_PADDING` (p-8)
- **Typography**: Always use responsive patterns like `DESIGN_TOKENS.TYPOGRAPHY.HERO_TITLE`
- **Navigation**: Use `NAV_PADDING`, `NAV_MIN_WIDTH`, `NAV_GAP` for consistent mobile nav

### Glass Morphism Design Language
- **Primary Pattern**: `DESIGN_TOKENS.GLASS.PRIMARY` (`.glass-morphism` class)
- **Overlay Pattern**: `DESIGN_TOKENS.GLASS.SECONDARY` (`.neo-blur` class)
- **Technology Pills**: `DESIGN_TOKENS.GLASS.TECHNOLOGY_PILL` (`.technologie-pill`)

### Animation & Transition Standards
- **Page Transitions**: Use `DESIGN_TOKENS.ANIMATION.PAGE_TRANSITION` (500ms) with `PAGE_EASE`
- **Hover Effects**: Use `DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION` class
- **Performance**: Always include `DESIGN_TOKENS.ANIMATION.TRANSFORM_PERFORMANCE`
- **Framer Motion**: Use `STANDARD_INITIAL` and `STANDARD_ANIMATE` patterns

### Spacing & Layout System
- **Card Padding**: Use responsive `CARD_PADDING_MOBILE` → `CARD_PADDING`
- **Section Spacing**: Use `DESIGN_TOKENS.SPACING.SECTION_SPACING` (`mt-16`)
- **Content Rhythm**: Use `CONTENT_SPACING` (`mb-6`) and `SMALL_SPACING` (`mb-4`)
- **Component Gaps**: Use `RESPONSIVE_GAP` for mobile-adaptive spacing

### Shadow & Elevation
- **Theme-Aware Shadows**: Use `SHADOW.DEFAULT_LIGHT/DARK` and `HOVER_LIGHT/DARK`
- **Interactive Feedback**: Use `SHADOW.SCALE_TRANSFORM` with `SCALE_TRANSITION`
- **Performance**: Include `transform-gpu` for smooth animations

### Typography Hierarchy
- **Hero Titles**: `TYPOGRAPHY.HERO_TITLE` (responsive text-6xl → text-8xl)
- **Section Headers**: `TYPOGRAPHY.SECTION_TITLE` (responsive text-4xl → text-5xl)
- **Body Text**: `TYPOGRAPHY.BODY_DEFAULT` with `leading-relaxed`
- **Interactive Text**: `TYPOGRAPHY.NAV_TEXT` for responsive navigation

### State Management Standards
- **Opacity States**: Use `OPACITY.DEFAULT` → `OPACITY.HOVER` transitions
- **Disabled States**: Use `OPACITY.DISABLED` combined with `pointer-events-none`
- **Focus States**: Use `STATES.FOCUS_RING` for accessibility
- **Loading States**: Use `STATES.LOADING_PULSE` and `LOADING_OPACITY`

## Environment Variables
- `GEMINI_API_KEY` - For AI chat functionality
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` - For database access
- `VITE_API_BASE_URL` - Optional API base URL override for development

## Security Considerations
- All API calls go through Cloudflare Pages Functions (never direct client-side database access)
- Security headers enforced via `src/worker.js` and `wrangler.toml`
- CSP allows specific external domains: fonts.googleapis.com
## Deployment
- Deployed to Cloudflare Pages with automatic builds from main branch
- Functions deploy to `/functions/api/` as Cloudflare Pages Functions
- Static assets served from `/dist` directory after Vite build