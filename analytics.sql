-- Analytics SQL Functions and Tables
-- This file creates all the tables, views, and functions required for the Portfolio analytics dashboard

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables that might conflict (preserving projects, experiences, and about tables)
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_conversations;
DROP TABLE IF EXISTS user_interactions;
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS admin_users;

-- Drop views that may reference these tables
DROP VIEW IF EXISTS analytics_summary;
DROP VIEW IF EXISTS weekly_analytics_summary;

-- Drop functions that might already exist
DROP FUNCTION IF EXISTS calculate_growth_rate(numeric, numeric);
DROP FUNCTION IF EXISTS get_active_sessions(integer);
DROP FUNCTION IF EXISTS get_analytics_metrics(integer);
DROP FUNCTION IF EXISTS get_browser_usage();
DROP FUNCTION IF EXISTS get_daily_visitors(integer);
DROP FUNCTION IF EXISTS get_device_distribution();
DROP FUNCTION IF EXISTS get_interaction_types();
DROP FUNCTION IF EXISTS get_top_pages(integer);
DROP FUNCTION IF EXISTS get_traffic_sources();
DROP FUNCTION IF EXISTS get_visitor_countries(integer);
DROP FUNCTION IF EXISTS get_weekly_visitors(integer);
DROP FUNCTION IF EXISTS get_visitor_engagement();
DROP FUNCTION IF EXISTS get_time_on_site();
DROP FUNCTION IF EXISTS get_operating_systems();
DROP FUNCTION IF EXISTS add_chat_message(uuid, text, text, boolean);
DROP FUNCTION IF EXISTS record_page_view(text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS record_user_interaction(text, text, text, text, text, text, text, integer, integer, text, text);
DROP FUNCTION IF EXISTS start_chat_conversation(text, text, text, text, text);
DROP FUNCTION IF EXISTS track_page_view(jsonb);
DROP FUNCTION IF EXISTS get_heatmap_data(text);

--
-- Create tables first
--

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    email text,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Page views table with enhanced analytics capabilities
CREATE TABLE IF NOT EXISTS page_views (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    page_path text NOT NULL,
    ip_address text,
    user_agent text,
    referrer text,
    device_type text,
    browser text,
    operating_system text,
    country text DEFAULT 'Unknown'::text,
    city text DEFAULT 'Unknown'::text,
    referrer_source text,
    screen_size text,
    entry_url text,
    locale text,
    session_id text NOT NULL,
    is_bounce boolean DEFAULT true,
    session_duration integer DEFAULT 0,
    viewed_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- User interactions table with enhanced tracking
CREATE TABLE IF NOT EXISTS user_interactions (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    action_type text NOT NULL,
    page_path text NOT NULL,
    ip_address text,
    user_agent text,
    session_id text NOT NULL,
    element_id text,
    element_class text,
    element_type text,
    x_position integer,
    y_position integer,
    value text,
    scroll_depth integer,
    time_spent integer,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Chat conversations table with enhanced tracking
CREATE TABLE IF NOT EXISTS chat_conversations (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    ip_address text,
    user_agent text,
    referrer text,
    session_id text NOT NULL,
    locale text,
    initial_page text,
    satisfaction_rating integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_message_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    conversation_id uuid NOT NULL,
    content text NOT NULL,
    sender text NOT NULL,
    is_first_message boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id),
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) ON DELETE CASCADE
);

-- Create indexes for optimized queries

-- Page views indexes
CREATE INDEX page_views_path_idx ON page_views(page_path);
CREATE INDEX page_views_session_idx ON page_views(session_id);
CREATE INDEX page_views_time_idx ON page_views(viewed_at);
CREATE INDEX page_views_device_idx ON page_views(device_type);
CREATE INDEX page_views_country_idx ON page_views(country);
CREATE INDEX page_views_referrer_idx ON page_views(referrer_source);
CREATE INDEX page_views_browser_idx ON page_views(browser);
CREATE INDEX page_views_os_idx ON page_views(operating_system);

-- User interactions indexes
CREATE INDEX user_interactions_type_idx ON user_interactions(action_type);
CREATE INDEX user_interactions_path_idx ON user_interactions(page_path);
CREATE INDEX user_interactions_session_idx ON user_interactions(session_id);
CREATE INDEX user_interactions_time_idx ON user_interactions(created_at);
CREATE INDEX user_interactions_element_idx ON user_interactions(element_id);

-- Chat conversations indexes
CREATE INDEX chat_conversations_session_idx ON chat_conversations(session_id);
CREATE INDEX chat_conversations_active_idx ON chat_conversations(is_active);
CREATE INDEX chat_conversations_time_idx ON chat_conversations(created_at);

-- Chat messages indexes
CREATE INDEX chat_messages_conversation_idx ON chat_messages(conversation_id);
CREATE INDEX chat_messages_time_idx ON chat_messages(created_at);

-- Now create analytics summary views
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  date_trunc('day', pv.viewed_at)::DATE AS date,
  COUNT(DISTINCT pv.session_id) AS unique_visitors,
  COUNT(pv.id) AS page_views,
  COUNT(DISTINCT pv.page_path) AS unique_pages,
  AVG(pv.session_duration) AS avg_session_duration,
  100.0 * SUM(CASE WHEN pv.is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT pv.session_id), 0) AS bounce_rate,
  
  -- Device breakdown
  COUNT(CASE WHEN pv.device_type = 'Desktop' THEN 1 END) AS desktop_views,
  COUNT(CASE WHEN pv.device_type = 'Mobile' THEN 1 END) AS mobile_views,
  COUNT(CASE WHEN pv.device_type = 'Tablet' THEN 1 END) AS tablet_views,
  
  -- Traffic sources
  COUNT(CASE WHEN pv.referrer_source = 'Direct' THEN 1 END) AS direct_traffic,
  COUNT(CASE WHEN pv.referrer_source = 'Search' THEN 1 END) AS search_traffic,
  COUNT(CASE WHEN pv.referrer_source = 'Social' THEN 1 END) AS social_traffic,
  COUNT(CASE WHEN pv.referrer_source = 'Referral' THEN 1 END) AS referral_traffic
FROM
  page_views pv
GROUP BY
  date
ORDER BY
  date DESC;

-- Create a weekly analytics summary view
CREATE OR REPLACE VIEW weekly_analytics_summary AS
SELECT
  date_trunc('week', pv.viewed_at)::DATE AS week_start,
  COUNT(DISTINCT pv.session_id) AS unique_visitors,
  COUNT(pv.id) AS page_views,
  AVG(pv.session_duration) AS avg_session_duration,
  100.0 * SUM(CASE WHEN pv.is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT pv.session_id), 0) AS bounce_rate,
  COUNT(DISTINCT pv.page_path) AS unique_pages_viewed
FROM
  page_views pv
GROUP BY
  week_start
ORDER BY
  week_start DESC;

--
-- Enhanced Analytics Functions
--

-- Calculate growth rate between two periods
CREATE OR REPLACE FUNCTION calculate_growth_rate(current_value numeric, previous_value numeric) 
RETURNS numeric AS $$
BEGIN
  -- Handle cases where previous value is zero to avoid division by zero
  IF previous_value = 0 OR previous_value IS NULL THEN
    RETURN 100.0; -- Infinite growth, cap at 100%
  END IF;
  
  -- Calculate percentage change
  RETURN ((current_value - previous_value) / previous_value) * 100.0;
END;
$$ LANGUAGE plpgsql;

-- Get active sessions with detailed metrics
CREATE OR REPLACE FUNCTION get_active_sessions(hours integer DEFAULT 24) 
RETURNS TABLE(
    session_id text, 
    started_at timestamp without time zone, 
    last_activity timestamp without time zone, 
    page_count integer, 
    duration integer,
    device_type text,
    browser text,
    country text,
    city text,
    referrer_source text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.session_id,
    MIN(pv.viewed_at)::timestamp without time zone AS started_at,
    MAX(pv.viewed_at)::timestamp without time zone AS last_activity,
    COUNT(*) AS page_count,
    EXTRACT(EPOCH FROM (MAX(pv.viewed_at) - MIN(pv.viewed_at)))::INTEGER AS duration,
    MAX(pv.device_type) AS device_type,
    MAX(pv.browser) AS browser,
    MAX(pv.country) AS country,
    MAX(pv.city) AS city,
    MAX(pv.referrer_source) AS referrer_source
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - (hours || ' hours')::INTERVAL
  GROUP BY 
    pv.session_id
  ORDER BY 
    last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- Get comprehensive analytics metrics with comparative periods
CREATE OR REPLACE FUNCTION get_analytics_metrics(days integer DEFAULT 7) 
RETURNS TABLE(
    unique_visitors integer, 
    total_page_views integer, 
    avg_session_duration numeric, 
    bounce_rate numeric, 
    unique_prev_period integer, 
    views_prev_period integer, 
    duration_prev_period numeric, 
    bounce_prev_period numeric,
    mobile_percentage numeric,
    desktop_percentage numeric,
    avg_pages_per_visit numeric
) AS $$
DECLARE
  current_start TIMESTAMP;
  prev_start TIMESTAMP;
BEGIN
  -- Set time periods
  current_start := NOW() - (days || ' days')::INTERVAL;
  prev_start := current_start - (days || ' days')::INTERVAL;
  
  -- Current period metrics
  SELECT 
    COUNT(DISTINCT pv.session_id) AS unique_visitors,
    COUNT(*) AS total_page_views,
    COALESCE(AVG(pv.session_duration), 0) AS avg_session_duration,
    100.0 * SUM(CASE WHEN pv.is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT pv.session_id), 0) AS bounce_rate,
    
    -- Previous period metrics (for comparison)
    (SELECT COUNT(DISTINCT prev_pv.session_id) FROM page_views prev_pv WHERE prev_pv.viewed_at BETWEEN prev_start AND current_start) AS unique_prev_period,
    (SELECT COUNT(*) FROM page_views prev_pv WHERE prev_pv.viewed_at BETWEEN prev_start AND current_start) AS views_prev_period,
    COALESCE((SELECT AVG(prev_pv.session_duration) FROM page_views prev_pv WHERE prev_pv.viewed_at BETWEEN prev_start AND current_start), 0) AS duration_prev_period,
    100.0 * (SELECT SUM(CASE WHEN prev_pv.is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT prev_pv.session_id), 0) FROM page_views prev_pv WHERE prev_pv.viewed_at BETWEEN prev_start AND current_start) AS bounce_prev_period,
    
    -- Additional metrics
    100.0 * COUNT(CASE WHEN pv.device_type = 'Mobile' THEN 1 END) / NULLIF(COUNT(*), 0) AS mobile_percentage,
    100.0 * COUNT(CASE WHEN pv.device_type = 'Desktop' THEN 1 END) / NULLIF(COUNT(*), 0) AS desktop_percentage,
    COALESCE(COUNT(*) / NULLIF(COUNT(DISTINCT pv.session_id), 0), 0) AS avg_pages_per_visit
  INTO
    unique_visitors,
    total_page_views,
    avg_session_duration,
    bounce_rate,
    unique_prev_period,
    views_prev_period,
    duration_prev_period,
    bounce_prev_period,
    mobile_percentage,
    desktop_percentage,
    avg_pages_per_visit
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= current_start;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Get browser usage statistics
CREATE OR REPLACE FUNCTION get_browser_usage() 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pv.browser, 'Other') AS name,
    COUNT(DISTINCT pv.session_id) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.browser
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get detailed daily visitor data
CREATE OR REPLACE FUNCTION get_daily_visitors(days integer DEFAULT 7) 
RETURNS TABLE(
    day date, 
    visitors integer, 
    page_views integer, 
    bounce_rate numeric,
    avg_duration numeric
) AS $$
BEGIN
  -- Generate series of dates
  RETURN QUERY WITH date_series AS (
    SELECT date_trunc('day', dd)::DATE AS day
    FROM generate_series(
      NOW() - ((days - 1) || ' days')::INTERVAL,
      NOW(),
      '1 day'::INTERVAL
    ) AS dd
  )
  
  SELECT 
    ds.day,
    COALESCE(COUNT(DISTINCT pv.session_id), 0) AS visitors,
    COALESCE(COUNT(pv.id), 0) AS page_views,
    COALESCE(100.0 * SUM(CASE WHEN pv.is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT pv.session_id), 0), 0) AS bounce_rate,
    COALESCE(AVG(pv.session_duration), 0) AS avg_duration
  FROM 
    date_series ds
  LEFT JOIN 
    page_views pv ON date_trunc('day', pv.viewed_at)::DATE = ds.day
  GROUP BY 
    ds.day
  ORDER BY 
    ds.day;
END;
$$ LANGUAGE plpgsql;

-- Get device distribution data
CREATE OR REPLACE FUNCTION get_device_distribution() 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pv.device_type, 'Other') AS name,
    COUNT(DISTINCT pv.session_id) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.device_type
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get user interaction types
CREATE OR REPLACE FUNCTION get_interaction_types() 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ui.action_type AS name,
    COUNT(*) AS value
  FROM 
    user_interactions ui
  WHERE 
    ui.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    ui.action_type
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get most visited pages
CREATE OR REPLACE FUNCTION get_top_pages(limit_count integer DEFAULT 5) 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.page_path AS name,
    COUNT(*) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.page_path
  ORDER BY 
    value DESC
  LIMIT 
    limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get traffic sources
CREATE OR REPLACE FUNCTION get_traffic_sources() 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pv.referrer_source, 'Direct') AS name,
    COUNT(*) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.referrer_source
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get visitor countries
CREATE OR REPLACE FUNCTION get_visitor_countries(limit_count integer DEFAULT 5) 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pv.country, 'Unknown') AS name,
    COUNT(DISTINCT pv.session_id) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.country
  ORDER BY 
    value DESC
  LIMIT 
    limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get weekly visitors trend for growth chart
CREATE OR REPLACE FUNCTION get_weekly_visitors(weeks integer DEFAULT 8) 
RETURNS TABLE(
    week_start date,
    visitors integer
) AS $$
BEGIN
  RETURN QUERY WITH week_series AS (
    SELECT date_trunc('week', dd)::DATE AS week_start
    FROM generate_series(
      NOW() - ((weeks - 1) || ' weeks')::INTERVAL,
      NOW(),
      '1 week'::INTERVAL
    ) AS dd
  )
  
  SELECT 
    ws.week_start,
    COALESCE(COUNT(DISTINCT pv.session_id), 0) AS visitors
  FROM 
    week_series ws
  LEFT JOIN 
    page_views pv ON date_trunc('week', pv.viewed_at)::DATE = ws.week_start
  GROUP BY 
    ws.week_start
  ORDER BY 
    ws.week_start;
END;
$$ LANGUAGE plpgsql;

-- Get detailed visitor engagement levels
CREATE OR REPLACE FUNCTION get_visitor_engagement() 
RETURNS TABLE(
    name text,
    value integer
) AS $$
BEGIN
  RETURN QUERY 
  WITH engagement AS (
    SELECT 
      pv.session_id,
      COUNT(*) AS page_count,
      CASE 
        WHEN COUNT(*) = 1 THEN 'Single Page'
        WHEN COUNT(*) BETWEEN 2 AND 3 THEN '2-3 Pages'
        WHEN COUNT(*) BETWEEN 4 AND 7 THEN '4-7 Pages'
        ELSE '8+ Pages'
      END AS engagement_level
    FROM 
      page_views pv
    WHERE 
      pv.viewed_at >= NOW() - INTERVAL '30 days'
    GROUP BY 
      pv.session_id
  )
  SELECT 
    engagement.engagement_level AS name,
    COUNT(*) AS value
  FROM 
    engagement
  GROUP BY 
    engagement.engagement_level
  ORDER BY 
    CASE 
      WHEN engagement.engagement_level = 'Single Page' THEN 1
      WHEN engagement.engagement_level = '2-3 Pages' THEN 2
      WHEN engagement.engagement_level = '4-7 Pages' THEN 3
      ELSE 4
    END;
END;
$$ LANGUAGE plpgsql;

-- Get time on site distribution
CREATE OR REPLACE FUNCTION get_time_on_site() 
RETURNS TABLE(
    name text,
    value integer
) AS $$
BEGIN
  RETURN QUERY
  WITH session_durations AS (
    SELECT 
      pv.session_id,
      MAX(pv.session_duration) AS duration,
      CASE 
        WHEN MAX(pv.session_duration) < 30 THEN '< 30 sec'
        WHEN MAX(pv.session_duration) BETWEEN 30 AND 60 THEN '30-60 sec'
        WHEN MAX(pv.session_duration) BETWEEN 61 AND 180 THEN '1-3 min'
        WHEN MAX(pv.session_duration) BETWEEN 181 AND 600 THEN '3-10 min'
        ELSE '> 10 min'
      END AS duration_group
    FROM 
      page_views pv
    WHERE 
      pv.viewed_at >= NOW() - INTERVAL '30 days'
    GROUP BY 
      pv.session_id
  )
  SELECT 
    session_durations.duration_group AS name,
    COUNT(*) AS value
  FROM 
    session_durations
  GROUP BY 
    session_durations.duration_group
  ORDER BY 
    CASE 
      WHEN session_durations.duration_group = '< 30 sec' THEN 1
      WHEN session_durations.duration_group = '30-60 sec' THEN 2
      WHEN session_durations.duration_group = '1-3 min' THEN 3
      WHEN session_durations.duration_group = '3-10 min' THEN 4
      ELSE 5
    END;
END;
$$ LANGUAGE plpgsql;

-- Get user operating systems
CREATE OR REPLACE FUNCTION get_operating_systems() 
RETURNS TABLE(name text, value integer) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(pv.operating_system, 'Other') AS name,
    COUNT(DISTINCT pv.session_id) AS value
  FROM 
    page_views pv
  WHERE 
    pv.viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    pv.operating_system
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Add a chat message
CREATE OR REPLACE FUNCTION add_chat_message(
    conversation_id uuid, 
    content text, 
    sender text, 
    is_first_message boolean DEFAULT false
) RETURNS uuid AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert the message record
  INSERT INTO chat_messages (
    conversation_id,
    content,
    sender,
    is_first_message,
    created_at
  ) VALUES (
    conversation_id,
    content,
    sender,
    is_first_message,
    now()
  ) RETURNING id INTO new_id;
  
  -- Update the conversation's last_message_at timestamp
  UPDATE chat_conversations
  SET last_message_at = now(),
      updated_at = now()
  WHERE id = conversation_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Record a page view with enhanced data collection
CREATE OR REPLACE FUNCTION record_page_view(
    page_path text, 
    user_agent text, 
    ip_address text, 
    referrer text, 
    screen_size text DEFAULT NULL,
    entry_url text DEFAULT NULL,
    locale text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  new_id UUID;
  device_type TEXT;
  browser TEXT;
  operating_system TEXT;
  referrer_source TEXT;
  session_id TEXT;
BEGIN
  -- Generate session ID based on IP and user agent if not exists
  -- In reality you'd use cookies/local storage
  session_id := md5(ip_address || user_agent || date_trunc('day', now())::text);
  
  -- Detect device type from user agent
  IF user_agent ~* 'mobile|android|iphone|ipad|ipod' THEN
    device_type := 'Mobile';
    IF user_agent ~* 'ipad' THEN
      device_type := 'Tablet';
    END IF;
  ELSE
    device_type := 'Desktop';
  END IF;
  
  -- Extract browser
  IF user_agent ~* 'chrome' AND user_agent !~* 'edge' THEN
    browser := 'Chrome';
  ELSIF user_agent ~* 'firefox' THEN
    browser := 'Firefox';
  ELSIF user_agent ~* 'safari' AND user_agent !~* 'chrome' THEN
    browser := 'Safari';
  ELSIF user_agent ~* 'edge|trident|msie' THEN
    browser := 'Edge/IE';
  ELSE
    browser := 'Other';
  END IF;
  
  -- Extract OS
  IF user_agent ~* 'windows' THEN
    operating_system := 'Windows';
  ELSIF user_agent ~* 'macintosh|mac os' THEN
    operating_system := 'MacOS';
  ELSIF user_agent ~* 'android' THEN
    operating_system := 'Android';
  ELSIF user_agent ~* 'iphone|ipad|ipod' THEN
    operating_system := 'iOS';
  ELSIF user_agent ~* 'linux' THEN
    operating_system := 'Linux';
  ELSE
    operating_system := 'Other';
  END IF;
  
  -- Categorize referrer
  IF referrer IS NULL OR referrer = '' THEN
    referrer_source := 'Direct';
  ELSIF referrer ~* 'google|bing|yahoo|duckduckgo|baidu' THEN
    referrer_source := 'Search';
  ELSIF referrer ~* 'facebook|twitter|instagram|linkedin|pinterest|reddit|youtube' THEN
    referrer_source := 'Social';
  ELSE
    referrer_source := 'Referral';
  END IF;
  
  -- Record page view
  INSERT INTO page_views (
    page_path,
    ip_address,
    user_agent,
    referrer,
    device_type,
    browser,
    operating_system,
    country,
    city,
    referrer_source,
    screen_size,
    entry_url,
    locale,
    session_id,
    is_bounce,
    viewed_at
  ) VALUES (
    page_path,
    ip_address,
    user_agent,
    referrer,
    device_type,
    browser,
    operating_system,
    'Unknown', -- Would use GeoIP in production
    'Unknown', -- Would use GeoIP in production
    referrer_source,
    screen_size,
    entry_url,
    locale,
    session_id,
    true, -- Initially marked as bounce, updated later
    now()
  ) RETURNING id INTO new_id;
  
  -- Update bounce status and session duration for previous views in this session
  UPDATE page_views
  SET is_bounce = false
  WHERE session_id = session_id AND id != new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Record user interaction
CREATE OR REPLACE FUNCTION record_user_interaction(
    action_type text,
    page_path text,
    session_id text,
    element_id text DEFAULT NULL,
    element_class text DEFAULT NULL,
    element_type text DEFAULT NULL,
    ip_address text DEFAULT NULL,
    x_position integer DEFAULT NULL,
    y_position integer DEFAULT NULL,
    value text DEFAULT NULL,
    user_agent text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO user_interactions (
    action_type,
    page_path,
    ip_address,
    user_agent,
    session_id,
    element_id,
    element_class,
    element_type,
    x_position,
    y_position,
    value,
    created_at
  ) VALUES (
    action_type,
    page_path,
    ip_address,
    user_agent,
    session_id,
    element_id,
    element_class,
    element_type,
    x_position,
    y_position,
    value,
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Start a new chat conversation
CREATE OR REPLACE FUNCTION start_chat_conversation(
    session_id text,
    initial_page text,
    ip_address text DEFAULT NULL,
    user_agent text DEFAULT NULL,
    referrer text DEFAULT NULL
) RETURNS uuid AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO chat_conversations (
    ip_address,
    user_agent,
    referrer,
    session_id,
    initial_page,
    is_active,
    created_at,
    updated_at,
    last_message_at
  ) VALUES (
    ip_address,
    user_agent,
    referrer,
    session_id,
    initial_page,
    true,
    now(),
    now(),
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Get heatmap data for a specific page
CREATE OR REPLACE FUNCTION get_heatmap_data(target_page text) 
RETURNS TABLE(
    x_position integer,
    y_position integer,
    count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ui.x_position,
    ui.y_position,
    COUNT(*) AS count
  FROM 
    user_interactions ui
  WHERE 
    ui.page_path = target_page
    AND ui.x_position IS NOT NULL
    AND ui.y_position IS NOT NULL
    AND ui.action_type = 'click'
    AND ui.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    ui.x_position, ui.y_position
  ORDER BY 
    count DESC;
END;
$$ LANGUAGE plpgsql;

-- Add sample admin user for testing
INSERT INTO admin_users (username, password_hash, email)
SELECT 'admin', 
  -- This is a placeholder hash for 'password' - use a proper password hash in production
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 
  'admin@example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM admin_users WHERE username = 'admin'
);

-- Insert sample data for testing
DO $$
DECLARE
  session_id TEXT;
  page_view_id UUID;
  conv_id UUID;
  browsers TEXT[] := ARRAY['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  devices TEXT[] := ARRAY['Desktop', 'Mobile', 'Tablet'];
  operating_systems TEXT[] := ARRAY['Windows', 'MacOS', 'iOS', 'Android', 'Linux'];
  countries TEXT[] := ARRAY['United States', 'Canada', 'United Kingdom', 'Germany', 'France'];
  referrers TEXT[] := ARRAY['Direct', 'Search', 'Social', 'Referral'];
  pages TEXT[] := ARRAY['/home', '/about', '/projects', '/contact', '/blog'];
  actions TEXT[] := ARRAY['click', 'scroll', 'hover', 'input', 'submit'];
BEGIN
  -- Create sample data for the last 7 days
  FOR i IN 1..100 LOOP
    -- Generate random session ID
    session_id := md5(random()::text || now()::text);
    
    -- Create 1-5 page views for this session
    FOR j IN 1..floor(random() * 5 + 1)::int LOOP
      -- Insert page view
      INSERT INTO page_views (
        page_path,
        ip_address,
        user_agent,
        referrer,
        device_type,
        browser,
        operating_system,
        country,
        city,
        referrer_source,
        session_id,
        is_bounce,
        session_duration,
        viewed_at
      ) VALUES (
        pages[floor(random() * array_length(pages, 1) + 1)],
        '192.168.' || floor(random() * 255)::text || '.' || floor(random() * 255)::text,
        'Mozilla/5.0 Sample User Agent',
        CASE WHEN random() > 0.3 THEN 'https://example.com/referrer' ELSE NULL END,
        devices[floor(random() * array_length(devices, 1) + 1)],
        browsers[floor(random() * array_length(browsers, 1) + 1)],
        operating_systems[floor(random() * array_length(operating_systems, 1) + 1)],
        countries[floor(random() * array_length(countries, 1) + 1)],
        'Sample City',
        referrers[floor(random() * array_length(referrers, 1) + 1)],
        session_id,
        CASE WHEN j = 1 AND floor(random() * 3 + 1) = 1 THEN true ELSE false END,
        floor(random() * 600)::int, -- 0-10 minutes
        now() - (floor(random() * 7) || ' days')::interval - (floor(random() * 24) || ' hours')::interval
      ) RETURNING id INTO page_view_id;
      
      -- Create 0-3 interactions for this page view
      FOR k IN 1..floor(random() * 4)::int LOOP
        INSERT INTO user_interactions (
          action_type,
          page_path,
          ip_address,
          user_agent,
          session_id,
          element_id,
          element_class,
          element_type,
          x_position,
          y_position,
          created_at
        ) VALUES (
          actions[floor(random() * array_length(actions, 1) + 1)],
          (SELECT page_path FROM page_views WHERE id = page_view_id),
          (SELECT ip_address FROM page_views WHERE id = page_view_id),
          'Mozilla/5.0 Sample User Agent',
          session_id,
          'element-' || floor(random() * 10 + 1)::text,
          'sample-class',
          'div',
          floor(random() * 1000 + 1)::int,
          floor(random() * 800 + 1)::int,
          (SELECT viewed_at + (floor(random() * 60) || ' seconds')::interval FROM page_views WHERE id = page_view_id)
        );
      END LOOP;
    END LOOP;
    
    -- 10% chance to create a chat conversation
    IF random() < 0.1 THEN
      INSERT INTO chat_conversations (
        ip_address,
        user_agent,
        referrer,
        session_id,
        initial_page,
        is_active,
        created_at,
        updated_at,
        last_message_at
      ) VALUES (
        '192.168.' || floor(random() * 255)::text || '.' || floor(random() * 255)::text,
        'Mozilla/5.0 Sample User Agent',
        CASE WHEN random() > 0.3 THEN 'https://example.com/referrer' ELSE NULL END,
        session_id,
        pages[floor(random() * array_length(pages, 1) + 1)],
        CASE WHEN random() > 0.2 THEN true ELSE false END,
        now() - (floor(random() * 7) || ' days')::interval,
        now() - (floor(random() * 7) || ' days')::interval,
        now() - (floor(random() * 7) || ' days')::interval
      ) RETURNING id INTO conv_id;
      
      -- Add 1-5 messages to this conversation
      FOR m IN 1..floor(random() * 5 + 1)::int LOOP
        INSERT INTO chat_messages (
          conversation_id,
          content,
          sender,
          is_first_message,
          created_at
        ) VALUES (
          conv_id,
          CASE 
            WHEN m % 2 = 1 THEN 'User message ' || m::text 
            ELSE 'Bot response ' || m::text 
          END,
          CASE WHEN m % 2 = 1 THEN 'user' ELSE 'bot' END,
          m = 1,
          (SELECT created_at + (m || ' minutes')::interval FROM chat_conversations WHERE id = conv_id)
        );
      END LOOP;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fix for the ChatConversation type issue in Admin.tsx
-- Add a user_id field to the chat_conversations table
ALTER TABLE chat_conversations ADD COLUMN IF NOT EXISTS user_id text; 