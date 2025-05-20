-- Enhanced Analytics Schema for Portfolio Dashboard
-- This file updates and expands the existing tables to provide real data for charts in Admin.tsx

-- First, ensure we have the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Update page_views table with additional fields needed for analytics charts
ALTER TABLE page_views 
ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS browser VARCHAR(50),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS referrer_source VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_bounce BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(100);

-- Rename some existing columns to maintain compatibility
ALTER TABLE page_views 
RENAME COLUMN visitor_ip TO ip_address;

-- Update user_interactions table with additional fields
ALTER TABLE user_interactions 
ADD COLUMN IF NOT EXISTS session_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS count INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS element_class VARCHAR(100),
ADD COLUMN IF NOT EXISTS element_type VARCHAR(50);

-- Rename columns for compatibility
ALTER TABLE user_interactions 
RENAME COLUMN interaction_type TO action_type,
RENAME COLUMN visitor_ip TO ip_address;

-- Update chat_conversations table with new fields
ALTER TABLE chat_conversations 
ADD COLUMN IF NOT EXISTS user_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS session_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(100),
ADD COLUMN IF NOT EXISTS referrer VARCHAR(255);

-- Rename columns for compatibility
ALTER TABLE chat_conversations
RENAME COLUMN started_at TO created_at;

ALTER TABLE chat_conversations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add field to support skipping first message
ALTER TABLE chat_messages
ADD COLUMN IF NOT EXISTS is_first_message BOOLEAN DEFAULT false;

-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  technologies TEXT[],
  image_url VARCHAR(255),
  project_url VARCHAR(255),
  github_url VARCHAR(255),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create experiences table if it doesn't exist
CREATE TABLE IF NOT EXISTS experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company VARCHAR(100) NOT NULL,
  position VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT,
  technologies TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Now create the functions needed to feed the Admin dashboard with real data

-- Function 1: Get device type distribution
CREATE OR REPLACE FUNCTION get_device_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH unique_visitors AS (
    SELECT DISTINCT ON (ip_address) 
      ip_address,
      COALESCE(device_type, 
        CASE 
          WHEN user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN 'Mobile'
          WHEN user_agent ILIKE '%ipad%' OR user_agent ILIKE '%tablet%' THEN 'Tablet'
          WHEN user_agent ILIKE '%windows%' OR user_agent ILIKE '%macintosh%' OR user_agent ILIKE '%linux%' THEN 'Desktop'
          ELSE 'Other'
        END
      ) as device
    FROM page_views
    WHERE viewed_at > CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    device as name,
    COUNT(*) as value
  FROM unique_visitors
  GROUP BY device
  ORDER BY value DESC;
END;
$$;

-- Function 2: Get browser usage data
CREATE OR REPLACE FUNCTION get_browser_usage()
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH unique_visitors AS (
    SELECT DISTINCT ON (ip_address) 
      ip_address,
      COALESCE(browser, 
        CASE 
          WHEN user_agent ILIKE '%chrome%' AND NOT user_agent ILIKE '%edge%' THEN 'Chrome'
          WHEN user_agent ILIKE '%firefox%' THEN 'Firefox'
          WHEN user_agent ILIKE '%safari%' AND NOT user_agent ILIKE '%chrome%' THEN 'Safari'
          WHEN user_agent ILIKE '%edge%' OR user_agent ILIKE '%edg/%' THEN 'Edge'
          WHEN user_agent ILIKE '%opera%' OR user_agent ILIKE '%opr/%' THEN 'Opera'
          WHEN user_agent ILIKE '%trident%' OR user_agent ILIKE '%msie%' THEN 'Internet Explorer'
          ELSE 'Other'
        END
      ) as browser_name
    FROM page_views
    WHERE viewed_at > CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    browser_name as name,
    COUNT(*) as value
  FROM unique_visitors
  GROUP BY browser_name
  ORDER BY value DESC;
END;
$$;

-- Function 3: Get traffic sources
CREATE OR REPLACE FUNCTION get_traffic_sources()
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH unique_visitors AS (
    SELECT DISTINCT ON (ip_address) 
      ip_address,
      COALESCE(referrer_source, 
        CASE 
          WHEN referrer IS NULL OR referrer = '' OR referrer ILIKE '%direct%' THEN 'Direct'
          WHEN referrer ILIKE '%google%' OR referrer ILIKE '%bing%' OR referrer ILIKE '%yahoo%' OR referrer ILIKE '%duckduckgo%' THEN 'Search'
          WHEN referrer ILIKE '%facebook%' OR referrer ILIKE '%twitter%' OR referrer ILIKE '%instagram%' OR 
               referrer ILIKE '%linkedin%' OR referrer ILIKE '%pinterest%' OR referrer ILIKE '%reddit%' THEN 'Social'
          WHEN referrer ILIKE '%http%' OR referrer ILIKE '%www%' THEN 'Referral'
          ELSE 'Other'
        END
      ) as source
    FROM page_views
    WHERE viewed_at > CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    source as name,
    COUNT(*) as value
  FROM unique_visitors
  GROUP BY source
  ORDER BY value DESC;
END;
$$;

-- Function 4: Get top pages
CREATE OR REPLACE FUNCTION get_top_pages(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    page_path as name,
    COUNT(*) as value
  FROM page_views
  WHERE viewed_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY page_path
  ORDER BY value DESC
  LIMIT limit_count;
END;
$$;

-- Function 5: Get daily visitor data
CREATE OR REPLACE FUNCTION get_daily_visitors(days INTEGER DEFAULT 7)
RETURNS TABLE (
  date TEXT,
  visitors INTEGER,
  pageViews INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      date_trunc('day', CURRENT_TIMESTAMP) - ((days-1) || ' days')::INTERVAL,
      date_trunc('day', CURRENT_TIMESTAMP),
      '1 day'::INTERVAL
    ) as day
  ),
  daily_stats AS (
    SELECT 
      date_trunc('day', viewed_at) as day,
      COUNT(DISTINCT ip_address) as unique_visitors,
      COUNT(*) as total_views
    FROM page_views
    WHERE viewed_at >= CURRENT_DATE - days
    GROUP BY date_trunc('day', viewed_at)
  )
  SELECT
    to_char(dr.day, 'YYYY-MM-DD') as date,
    COALESCE(ds.unique_visitors, 0) as visitors,
    COALESCE(ds.total_views, 0) as pageViews
  FROM date_range dr
  LEFT JOIN daily_stats ds ON date_trunc('day', ds.day) = date_trunc('day', dr.day)
  ORDER BY dr.day;
END;
$$;

-- Function 6: Get visitor countries
CREATE OR REPLACE FUNCTION get_visitor_countries(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH unique_visitors AS (
    SELECT DISTINCT ON (ip_address) 
      ip_address,
      COALESCE(country, 'Unknown') as visitor_country
    FROM page_views
    WHERE viewed_at > CURRENT_DATE - INTERVAL '30 days'
  )
  SELECT 
    visitor_country as name,
    COUNT(*) as value
  FROM unique_visitors
  GROUP BY visitor_country
  ORDER BY value DESC
  LIMIT limit_count;
END;
$$;

-- Function 7: Get user interaction types
CREATE OR REPLACE FUNCTION get_interaction_types()
RETURNS TABLE (
  name TEXT,
  value INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    action_type as name,
    COUNT(*) as value
  FROM user_interactions
  WHERE created_at > CURRENT_DATE - INTERVAL '30 days'
  GROUP BY action_type
  ORDER BY value DESC;
END;
$$;

-- Function 8: Get aggregate metrics for dashboard cards
CREATE OR REPLACE FUNCTION get_analytics_metrics(days INTEGER DEFAULT 7)
RETURNS TABLE (
  unique_visitors INTEGER,
  total_page_views INTEGER,
  avg_session_duration TEXT,
  bounce_rate TEXT,
  visitor_growth_pct INTEGER,
  page_view_growth_pct INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  current_visitors INTEGER;
  previous_visitors INTEGER;
  current_page_views INTEGER;
  previous_page_views INTEGER;
BEGIN
  -- Get current period metrics
  SELECT COUNT(DISTINCT ip_address) INTO current_visitors
  FROM page_views
  WHERE viewed_at > CURRENT_DATE - INTERVAL '1 day' * days;
  
  SELECT COUNT(*) INTO current_page_views
  FROM page_views
  WHERE viewed_at > CURRENT_DATE - INTERVAL '1 day' * days;
  
  -- Get previous period metrics for comparison
  SELECT COUNT(DISTINCT ip_address) INTO previous_visitors
  FROM page_views
  WHERE viewed_at BETWEEN CURRENT_DATE - INTERVAL '1 day' * (days * 2) AND CURRENT_DATE - INTERVAL '1 day' * days;
  
  SELECT COUNT(*) INTO previous_page_views
  FROM page_views
  WHERE viewed_at BETWEEN CURRENT_DATE - INTERVAL '1 day' * (days * 2) AND CURRENT_DATE - INTERVAL '1 day' * days;
  
  -- Calculate growth percentages with safeguards for division by zero
  RETURN QUERY
  SELECT 
    current_visitors,
    current_page_views,
    -- Estimate average session duration based on available data
    '1m 45s', -- This would ideally be calculated from actual session data
    -- Estimate bounce rate as single page visits divided by total sessions
    (SELECT 
      ROUND(100.0 * COUNT(ip_address)::numeric / NULLIF(COUNT(DISTINCT ip_address), 0), 0) || '%'
     FROM page_views
     WHERE viewed_at > CURRENT_DATE - INTERVAL '1 day' * days
     GROUP BY ip_address
     HAVING COUNT(id) = 1),
    -- Calculate visitor growth percentage
    CASE 
      WHEN previous_visitors = 0 THEN 100
      ELSE ROUND(100.0 * (current_visitors - previous_visitors) / previous_visitors)
    END,
    -- Calculate page view growth percentage
    CASE 
      WHEN previous_page_views = 0 THEN 100
      ELSE ROUND(100.0 * (current_page_views - previous_page_views) / previous_page_views)
    END;
END;
$$;

-- Add some sample data if the tables are empty
DO $$
BEGIN
  -- Only insert sample data if page_views is empty
  IF NOT EXISTS (SELECT 1 FROM page_views LIMIT 1) THEN
    -- Insert sample page views data across different days
    INSERT INTO page_views (page_path, views, viewed_at, session_id, user_agent, ip_address, referrer, device_type, browser, country, city)
    VALUES
    -- Today
    ('/', 1, CURRENT_TIMESTAMP, 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1', 'direct', 'Desktop', 'Chrome', 'United States', 'New York'),
    ('/projects', 1, CURRENT_TIMESTAMP - INTERVAL '1 hour', 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1', 'direct', 'Desktop', 'Chrome', 'United States', 'New York'),
    ('/about', 1, CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'session2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)', '192.168.1.2', 'google.com', 'Mobile', 'Safari', 'United States', 'Los Angeles'),
    -- Yesterday
    ('/', 1, CURRENT_TIMESTAMP - INTERVAL '1 day', 'session3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.3', 'twitter.com', 'Desktop', 'Safari', 'Canada', 'Toronto'),
    ('/contact', 1, CURRENT_TIMESTAMP - INTERVAL '1 day 2 hours', 'session4', 'Mozilla/5.0 (Linux; Android 11)', '192.168.1.4', 'linkedin.com', 'Mobile', 'Chrome', 'Germany', 'Berlin'),
    ('/projects', 1, CURRENT_TIMESTAMP - INTERVAL '1 day 4 hours', 'session5', 'Mozilla/5.0 (iPad; CPU OS 14_0)', '192.168.1.5', 'direct', 'Tablet', 'Safari', 'United Kingdom', 'London'),
    -- 2 days ago
    ('/', 1, CURRENT_TIMESTAMP - INTERVAL '2 days', 'session6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.6', 'bing.com', 'Desktop', 'Edge', 'Australia', 'Sydney'),
    ('/blog', 1, CURRENT_TIMESTAMP - INTERVAL '2 days 3 hours', 'session7', 'Mozilla/5.0 (X11; Linux x86_64)', '192.168.1.7', 'direct', 'Desktop', 'Firefox', 'Japan', 'Tokyo'),
    -- 3-6 days ago
    ('/', 1, CURRENT_TIMESTAMP - INTERVAL '3 days', 'session8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.8', 'facebook.com', 'Desktop', 'Chrome', 'Brazil', 'Rio de Janeiro'),
    ('/projects', 1, CURRENT_TIMESTAMP - INTERVAL '4 days', 'session10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.10', 'github.com', 'Desktop', 'Chrome', 'Spain', 'Madrid'),
    ('/', 1, CURRENT_TIMESTAMP - INTERVAL '5 days', 'session12', 'Mozilla/5.0 (Linux; Android 10)', '192.168.1.12', 'youtube.com', 'Mobile', 'Chrome', 'Mexico', 'Mexico City'),
    ('/contact', 1, CURRENT_TIMESTAMP - INTERVAL '6 days', 'session14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.14', 'reddit.com', 'Desktop', 'Safari', 'India', 'Mumbai');
  END IF;

  -- Only insert sample user interactions if the table is empty
  IF NOT EXISTS (SELECT 1 FROM user_interactions LIMIT 1) THEN
    -- Insert sample user interactions
    INSERT INTO user_interactions (action_type, page_path, element_id, element_class, count, created_at, session_id, user_agent, ip_address)
    VALUES
    ('click', '/', 'nav-projects', 'nav-link', 1, CURRENT_TIMESTAMP - INTERVAL '1 hour', 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
    ('scroll', '/projects', null, null, 1, CURRENT_TIMESTAMP - INTERVAL '2 hours', 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
    ('click', '/about', 'contact-button', 'btn', 1, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'session2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)', '192.168.1.2'),
    ('view', '/blog', 'blog-post-1', 'blog-post', 1, CURRENT_TIMESTAMP - INTERVAL '1 day', 'session3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.3'),
    ('chat', '/', 'chat-widget', 'widget', 1, CURRENT_TIMESTAMP - INTERVAL '2 days', 'session6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.6'),
    ('search', '/', 'search-box', 'search', 1, CURRENT_TIMESTAMP - INTERVAL '3 days', 'session8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.8');
  END IF;
END
$$; 