# GitHub Copilot Instructions

## Project Overview
This is a modern React portfolio website built with TypeScript, Vite, and deployed on Cloudflare Pages. The app features an AI-powered chatbot (Max) that acts as Julian's personal assistant, dynamic content loaded from Supabase, and smooth page transitions with Framer Motion.

## Architecture & Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Cloudflare Pages with Functions
- **AI Integration**: Google Gemini API via Cloudflare Functions
- **State Management**: React Context (Theme, Chat)
- **Animations**: Framer Motion + custom Tailwind animations

## Key Patterns & Conventions

### File Structure
- `/src/components/` - Reusable UI components
- `/src/components/ui/` - shadcn/ui components (auto-generated, avoid manual edits)
- `/src/pages/` - Route components using React Router
- `/src/context/` - React Context providers (Theme, Chat)
- `/src/lib/` - Utilities and external service clients
- `/functions/api/` - Cloudflare Functions for serverless backend

### Component Naming
- Use PascalCase for components: `Hero.tsx`, `PageTransition.tsx`
- Use snake_case for functions and variables: `use_theme()`, `toggle_theme()`
- Context hooks prefixed with `use`: `useChatContext()`, `use_theme()`

### Styling Approach
- Custom Tailwind animations defined in `tailwind.config.ts`
- CSS variables for theming in `src/index.css` 
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Theme switching via CSS classes: `.light-mode` and `.dark-mode`

### State Management
```tsx
// Theme context pattern used throughout
const { theme, toggle_theme } = use_theme();

// Chat context for AI assistant
const { messages, setMessages, isLoading } = useChatContext();
```

### Supabase Integration
- Singleton pattern in `src/lib/supabase.ts` prevents multiple client instances
- Always use `getSupabase()` function, not direct imports
- Fallback values provided for missing environment variables
- Error handling via `handleSupabaseError()` utility

## Critical Workflows

### Development
```bash
npm run dev          # Start dev server on port 8080
npm run build:dev    # Development build
npm run build:prod   # Production build  
npm run deploy       # Build + deploy to Cloudflare
```

### Adding shadcn/ui Components
Components are configured in `components.json` with path aliases. Use shadcn CLI to add new UI components.

### AI Chatbot (Max)
- Backend: `/functions/api/chat.js` (Cloudflare Function)
- Frontend: `src/components/Chatbot.tsx` + `ChatbotPopup.tsx`
- System prompt generation: Dynamically loads data from Supabase
- API: Google Gemini 2.0 Flash model

### Database Setup
- Run `node setup_db_functions.js` to initialize Supabase functions
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables

## Security & Deployment
- Comprehensive CSP headers in `wrangler.toml` and `vite.config.ts`
- Cloudflare Worker (`src/worker.js`) adds security headers
- CORS handling in API functions for cross-origin requests
- Environment variables: Supabase credentials, Gemini API key

## Animation System
- Page transitions via `PageTransition.tsx` wrapper
- Custom animations in Tailwind config: `fade-in`, `slide-in-*`, `shimmer`
- Framer Motion for complex interactions and staggered animations

## Common Gotchas
- All UI components from shadcn should use the `@/` alias
- Theme changes persist via localStorage, applied via CSS classes
- Supabase client uses singleton pattern - avoid creating multiple instances
- Cloudflare Functions require CORS preflight handling for POST requests
- Page titles managed by `usePageTitle()` hook