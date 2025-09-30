/**
 * Portfolio Design System Tokens
 * 
 * Centralized design constants to ensure visual consistency across all components.
 * These tokens must be used instead of hardcoded values.
 */

export const DESIGN_TOKENS = {
  // Border Radius Standards
  BORDER_RADIUS: {
    PRIMARY_CARD: 'rounded-2xl',      // 0.75rem - Main content cards, chat interfaces, project cards
    SECONDARY: 'rounded-xl',          // 0.625rem - Smaller containers, nested elements
    BUTTON_PILL: 'rounded-full',      // Navigation items, technology pills, action buttons
    FORM_ELEMENT: 'rounded-md',       // 0.375rem - Input fields, tooltips, form controls
  },

  // Spacing & Layout System
  SPACING: {
    // Container Padding
    CARD_PADDING: 'p-8',              // 2rem - Primary cards
    CARD_PADDING_MOBILE: 'p-6',       // 1.5rem - Primary cards on mobile
    SMALL_ELEMENT: 'p-4',             // 1rem - Smaller elements
    COMPACT: 'p-6',                   // 1.5rem - Medium elements

    // Page Layout
    PAGE_CONTAINER: 'max-w-7xl mx-auto px-8 sm:px-12 md:px-16 lg:px-24',
    SECTION_SPACING: 'mt-16',         // 4rem - Between major sections
    CONTENT_SPACING: 'mb-6',          // 1.5rem - Between content blocks
    SMALL_SPACING: 'mb-4',            // 1rem - Between smaller elements

    // Component Gaps
    RESPONSIVE_GAP: 'gap-1 sm:gap-4', // Responsive spacing between elements
    GRID_GAP: 'gap-6',                // Grid layouts
    FLEX_GAP: 'gap-2',                // Flex layouts
  },

  // Animation & Transition Standards
  ANIMATION: {
    // Duration Standards
    PAGE_TRANSITION: 500,             // 0.5s - Page transitions
    HOVER_DURATION: 200,              // 0.2s - Hover effects
    FAST_TRANSITION: 150,             // 0.15s - Quick feedback
    SLOW_TRANSITION: 300,             // 0.3s - Emphasis transitions

    // Easing Functions
    PAGE_EASE: 'easeInOut',           // Page transitions
    HOVER_EASE: 'ease-out',           // Hover effects
    SPRING_EASE: 'ease-linear',       // Continuous animations

    // Framer Motion Patterns
    STANDARD_INITIAL: { opacity: 0, y: 20 },
    STANDARD_ANIMATE: { opacity: 1, y: 0 },
    NAVBAR_INITIAL: { y: -100, opacity: 0 },
    NAVBAR_ANIMATE: { y: 0, opacity: 1 },

    // CSS Classes
    HOVER_TRANSITION: 'transition-all duration-200',
    COLOR_TRANSITION: 'transition-colors duration-200',
    TRANSFORM_PERFORMANCE: 'transform-gpu',
  },

  // Typography & Text Patterns
  TYPOGRAPHY: {
    // Heading Styles
    HERO_TITLE: 'text-6xl md:text-8xl font-serif',
    HERO_SUBTITLE: 'text-5xl md:text-7xl font-serif',
    SECTION_TITLE: 'text-4xl md:text-5xl font-serif',
    CARD_TITLE: 'text-2xl font-bold',
    
    // Body Text
    BODY_LARGE: 'text-xl md:text-2xl',
    BODY_DEFAULT: 'text-lg leading-relaxed',
    BODY_SMALL: 'text-sm',
    
    // Interactive Elements
    NAV_TEXT: 'text-sm sm:text-base',
    PILL_TEXT: 'text-xs font-medium',
    
    // Responsive Patterns
    RESPONSIVE_HEADING: 'text-2xl md:text-3xl lg:text-4xl',
    RESPONSIVE_BODY: 'text-base md:text-lg',
  },

  // Glass Morphism & Background Patterns
  GLASS: {
    // Primary Glass Morphism
    PRIMARY: 'glass-morphism',        // Main pattern for cards and containers
    SECONDARY: 'neo-blur',            // Overlay pattern
    TECHNOLOGY_PILL: 'technologie-pill', // Technology tags
    
    // Manual Classes (when class not available)
    BACKDROP_BLUR: 'backdrop-blur-xl',
    BACKGROUND_DARK: 'bg-white/5 border border-white/10',
    BACKGROUND_LIGHT: 'bg-black/5 border border-black/10',
  },

  // Shadow & Elevation
  SHADOW: {
    // Default States
    DEFAULT_LIGHT: 'shadow-lg shadow-gray-900/20',
    DEFAULT_DARK: 'shadow-lg shadow-black/20',
    
    // Hover States
    HOVER_LIGHT: 'shadow-2xl shadow-gray-900/30',
    HOVER_DARK: 'shadow-2xl shadow-white/10',
    
    // Interactive Feedback
    SCALE_TRANSFORM: 'hover:scale-[1.03]',
    SCALE_TRANSITION: 'transition: transform 0.15s ease-out, box-shadow 0.2s ease-out',
  },

  // Responsive Breakpoints & Mobile Patterns
  RESPONSIVE: {
    // Grid Patterns
    PROJECTS_GRID: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    TWO_COLUMN: 'grid grid-cols-1 md:grid-cols-2',
    
    // Flexbox Patterns
    RESPONSIVE_FLEX: 'flex flex-col sm:flex-row',
    MOBILE_STACK: 'flex flex-col md:flex-row',
    
    // Navigation Sizing
    NAV_PADDING: 'px-2 sm:px-4 py-2',
    NAV_MIN_WIDTH: 'min-w-[60px] sm:min-w-[80px]',
    NAV_GAP: 'gap-1 sm:gap-4',
    
    // Container Adjustments
    HERO_PADDING: 'px-4 sm:px-0',
    RESPONSIVE_MAX_WIDTH: 'max-w-full sm:max-w-[70%]',
  },

  // Opacity & State Patterns
  OPACITY: {
    // Interactive States
    DEFAULT: 'opacity-80',
    HOVER: 'hover:opacity-100',
    DISABLED: 'opacity-50 pointer-events-none',
    
    // Visibility States
    HIDDEN: 'opacity-0',
    VISIBLE: 'opacity-100',
    
    // Background Opacity
    OVERLAY_DARK: 'bg-black/60',
    OVERLAY_LIGHT: 'bg-white/40',
    GLASS_OVERLAY: 'from-white/5 to-transparent',
  },

  // Component State Standards
  STATES: {
    // Focus States
    FOCUS_RING: 'focus-visible:ring-2',
    
    // Active States
    ACTIVE_BACKGROUND: 'bg-white/10',
    
    // Loading States
    LOADING_PULSE: 'animate-pulse',
    LOADING_OPACITY: 'opacity-50',
  },
} as const;

// Type helpers for better TypeScript support
export type BorderRadius = typeof DESIGN_TOKENS.BORDER_RADIUS[keyof typeof DESIGN_TOKENS.BORDER_RADIUS];
export type Spacing = typeof DESIGN_TOKENS.SPACING[keyof typeof DESIGN_TOKENS.SPACING];
export type Typography = typeof DESIGN_TOKENS.TYPOGRAPHY[keyof typeof DESIGN_TOKENS.TYPOGRAPHY];

// Usage examples and validation helpers
export const validateDesignToken = (category: string, token: string): boolean => {
  return Object.values(DESIGN_TOKENS).some(categoryObj => 
    Object.values(categoryObj).includes(token)
  );
};

// Quick access helpers for common patterns
export const commonPatterns = {
  // Most used card pattern
  STANDARD_CARD: `${DESIGN_TOKENS.GLASS.PRIMARY} ${DESIGN_TOKENS.SPACING.CARD_PADDING} ${DESIGN_TOKENS.BORDER_RADIUS.PRIMARY_CARD} ${DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION}`,
  
  // Mobile-responsive card
  RESPONSIVE_CARD: `${DESIGN_TOKENS.GLASS.PRIMARY} ${DESIGN_TOKENS.SPACING.CARD_PADDING_MOBILE} md:${DESIGN_TOKENS.SPACING.CARD_PADDING} ${DESIGN_TOKENS.BORDER_RADIUS.PRIMARY_CARD}`,
  
  // Standard button/pill
  PILL_ELEMENT: `${DESIGN_TOKENS.SPACING.COMPACT} ${DESIGN_TOKENS.BORDER_RADIUS.BUTTON_PILL} ${DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION}`,
  
  // Page layout container
  PAGE_LAYOUT: `${DESIGN_TOKENS.SPACING.PAGE_CONTAINER} pt-0 pb-20`,
  
  // Standard hover effect
  HOVER_EFFECT: `${DESIGN_TOKENS.ANIMATION.TRANSFORM_PERFORMANCE} ${DESIGN_TOKENS.ANIMATION.HOVER_TRANSITION} ${DESIGN_TOKENS.SHADOW.SCALE_TRANSFORM}`,
};