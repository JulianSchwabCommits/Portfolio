# Analytics System Documentation

This folder contains SQL and TypeScript files for the analytics tracking system. The system collects and analyzes user behavior data while respecting privacy.

## Core Components

1. **Database Functions and Tables**
   - `analytics_functions.sql`: Contains SQL functions for retrieving analytics data
   - `analytics_tracker.sql`: Contains SQL functions for tracking user interactions
   - `schema.sql`: Complete database schema including analytics tables and sample data

2. **Client-Side Utilities**
   - `src/utils/analytics.ts`: TypeScript functions for tracking page views and user interactions
   - `src/components/AnalyticsInit.tsx`: React component that initializes analytics tracking

## Setting Up the System

### 1. Database Setup

1. Connect to your Supabase project
2. Open the SQL Editor
3. Run `schema.sql` first to set up the database structure
4. Run `analytics_functions.sql` to create the analytics query functions
5. Run `analytics_tracker.sql` to create the tracking functions

### 2. Frontend Integration

The analytics system is automatically initialized when the app loads via the `AnalyticsInit` component that's included in `App.tsx`.

## Tracked Data

The system collects the following data:

### Page Views
- Page path
- User agent (for device/browser detection)
- Referrer 
- Session information
- Screen size
- Time spent on page

### User Interactions
- Click events
- Form submissions
- Button clicks
- Element information (ID, class, type)
- Page context

## Privacy Considerations

- IP addresses are always saved as 'anonymous'
- No personal information is collected
- Session IDs are randomly generated and not tied to users

## Analytics Dashboard

The Admin panel at `/admin` displays analytics data including:

- Unique visitors
- Page views
- Device breakdown
- Browser usage
- Traffic sources
- User engagement metrics
- Top visited pages

## Extending the System

### Adding New Metrics

1. Create a new SQL function in `analytics_functions.sql`
2. Update the Admin dashboard to display the new data

### Tracking Additional Interactions

1. Add new interaction types to the `InteractionType` type in `analytics.ts`
2. Create event listeners for the new interaction types
3. Call `track_interaction()` with the appropriate parameters

## Troubleshooting

If analytics data isn't appearing in the dashboard:

1. Check browser console for any errors
2. Verify that the SQL functions were successfully created in Supabase
3. Ensure `AnalyticsInit` component is included in the app
4. Check that the database tables have correct permissions in Supabase 