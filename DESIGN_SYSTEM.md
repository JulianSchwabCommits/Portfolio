# Portfolio Website Design System

## Overall Aesthetic

The portfolio website follows a minimalist, modern design philosophy with a focus on clean lines, ample white space, and subtle animations that create a sophisticated, professional impression. The design language is consistent throughout, maintaining a balance between visual appeal and functionality.

## Color Scheme

### Light Mode
- **Background**: Clean white (#FFFFFF) primary background with subtle off-white (#F9FAFB) secondary backgrounds for cards and containers
- **Text**: Dark gray (#1F2937) for primary text, medium gray (#6B7280) for secondary text
- **Accents**: A primary accent color in a vibrant purple/indigo shade (#8884d8) with secondary accent colors in teal (#82ca9d), amber (#ffc658), and coral (#ff8042)
- **Cards/Panels**: White backgrounds with very subtle shadows (0 1px 3px rgba(0,0,0,0.05))
- **Dividers**: Light gray (#E5E7EB) thin lines to separate content sections

### Dark Mode
- **Background**: Deep navy (#111827) primary background with slightly lighter dark surfaces (#1F2937) for cards and containers
- **Text**: Light gray (#F3F4F6) for primary text, softer light gray (#D1D5DB) for secondary text
- **Accents**: The same accent colors as light mode but with slightly increased vibrancy to maintain contrast against darker backgrounds
- **Cards/Panels**: Dark surfaces with subtle dark blue highlights and deeper shadows (0 4px 6px rgba(0,0,0,0.3))
- **Dividers**: Medium gray (#4B5563) thin lines between content sections

## Typography

- **Font Family**: A modern sans-serif system font stack with fallbacks
- **Headings**: 
  - Bold weight (700)
  - Size hierarchy: h1 (1.875rem/2.25rem), h2 (1.5rem/2rem), h3 (1.25rem/1.75rem)
  - Slightly tighter line-height for headings (1.2)
- **Body Text**: 
  - Regular weight (400) for standard text
  - Medium weight (500) for emphasis
  - Base size of 1rem (16px) with 1.5 line-height
- **Special Text**: Small text (0.875rem) for captions, metadata, and helper text
- **Font Scaling**: Responsive text sizing that scales appropriately for mobile and desktop views

## Spacing System

- **Base Unit**: 0.25rem (4px) as the foundational spacing unit
- **Spacing Scale**: 
  - Compact: 0.5rem (8px), 0.75rem (12px)
  - Standard: 1rem (16px), 1.5rem (24px)
  - Generous: 2rem (32px), 3rem (48px), 4rem (64px)
- **Layout Spacing**: More generous spacing between major sections (2rem+)
- **Component Spacing**: Tighter spacing within components (0.5rem to 1.5rem)

## Animations & Transitions

- **Hover Effects**: 
  - Subtle scale transforms (1.02x) on cards and interactive elements
  - Soft shadow expansion on hovering over cards and buttons
  - Gentle color shifts on interactive elements
- **Transition Durations**: 
  - Fast: 150ms for small UI elements
  - Medium: 200-250ms for standard interactions
  - Slow: 300-500ms for larger animations and page transitions
- **Easing**: 
  - Smooth cubic-bezier curves for natural movement
  - Slight bounce (cubic-bezier(0.175, 0.885, 0.32, 1.275)) for emphasis on important interactions
- **Page Transitions**: Fade and slight slide animations when navigating between pages

## UI Components Styling

### Buttons
- **Primary**: 
  - Filled background in accent color
  - 8px border radius
  - Subtle hover effect with 5% darkening and slight shadow increase
  - 2px vertical padding, 12px horizontal padding
- **Secondary**: 
  - Outlined style with 1px border
  - Same border radius and padding as primary
  - Background fill animation on hover
- **Tertiary/Ghost**: 
  - No background or border in default state
  - Subtle background on hover
  - Primarily used for less prominent actions

### Cards
- **Standard Card**: 
  - 12px border radius
  - Light shadow (0 4px 6px rgba(0, 0, 0, 0.1))
  - Shadow expansion on hover to 0 10px 15px rgba(0, 0, 0, 0.1)
  - White background in light mode, dark surface in dark mode
- **Featured Card**: 
  - Slightly larger shadow and border radius
  - Potential for subtle border accent
- **Interactive Cards**: 
  - Scale transform on hover (1.02x)
  - Cursor change and shadow deepening

### Form Elements
- **Inputs**: 
  - 8px border radius
  - 1px border in light gray (light mode) or dark gray (dark mode)
  - Focus state with accent color border and subtle glow
  - 10px vertical padding, 12px horizontal padding
- **Selects**: 
  - Similar styling to inputs
  - Custom dropdown indicator
  - Animated expansion of options

### Data Visualization
- **Chart Colors**: Coordinated palette using primary accent colors
- **Chart Interactions**: 
  - Tooltip appears on hover with data details
  - Subtle highlight effects on data points
- **Animation**: Charts animate into view with sequential revealing of data sets

## Responsive Design

- **Breakpoints**:
  - Mobile: Up to 640px
  - Tablet: 641px to 1024px
  - Desktop: 1025px and above
- **Layout Changes**:
  - Single column on mobile
  - Two columns on tablet
  - Multiple columns on desktop
- **Component Adaptations**:
  - Larger touch targets on mobile
  - Simplified navigation on smaller screens
  - Adjusted font sizes and spacing across breakpoints

## Special Effects

- **Scrolling Effects**: 
  - Subtle parallax on certain background elements
  - Smooth scroll behavior
- **Loading States**: 
  - Minimal, elegant loading indicators
  - Skeleton screens for content loading
- **Focus Styles**: 
  - Clear but unobtrusive focus indicators
  - Maintains accessibility while preserving design aesthetics

## Dark Mode Implementation

- **Toggle**: Smooth transition between light and dark modes with a cross-fade effect
- **System Preference**: Respects user's system preference for light/dark mode initially
- **Persistence**: Remembers user's preferred mode selection in local storage
- **Color Adaptation**: All colors systematically adapted for each mode rather than simply inverted

## Accessibility Considerations

- **Color Contrast**: Maintains WCAG AA standard minimum 4.5:1 contrast ratio for all text
- **Focus Indicators**: Visible focus states for keyboard navigation
- **Text Sizing**: Allows text to be resized up to 200% without breaking layouts
- **Animation Control**: Respects user preferences for reduced motion when specified

This design system creates a cohesive, modern experience that balances aesthetic appeal with usability, ensuring the portfolio presents content in an engaging yet professional manner. 