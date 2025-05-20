--
-- PostgreSQL database dump - Enhanced Analytics Version
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Preserve existing schemas
CREATE SCHEMA IF NOT EXISTS admin;
CREATE SCHEMA IF NOT EXISTS extensions;

-- Ensure extensions are available
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

-- Drop existing tables that might conflict (preserving projects, experiences, and about tables)
DO $$
BEGIN
    -- Drop dependent tables first (ones with foreign keys)
    DROP TABLE IF EXISTS chat_messages;
    DROP TABLE IF EXISTS chat_conversations;
    DROP TABLE IF EXISTS user_interactions;
    DROP TABLE IF EXISTS page_views;
    DROP TABLE IF EXISTS admin_users;
    
    -- Drop views that may reference these tables
    DROP VIEW IF EXISTS analytics_summary;
    DROP VIEW IF EXISTS weekly_analytics_summary;
END $$;

-- Drop all functions that might already exist
DROP FUNCTION IF EXISTS public.calculate_growth_rate(numeric, numeric);
DROP FUNCTION IF EXISTS public.get_active_sessions(integer);
DROP FUNCTION IF EXISTS public.get_analytics_metrics(integer);
DROP FUNCTION IF EXISTS public.get_browser_usage();
DROP FUNCTION IF EXISTS public.get_daily_visitors(integer);
DROP FUNCTION IF EXISTS public.get_device_distribution();
DROP FUNCTION IF EXISTS public.get_interaction_types();
DROP FUNCTION IF EXISTS public.get_top_pages(integer);
DROP FUNCTION IF EXISTS public.get_traffic_sources();
DROP FUNCTION IF EXISTS public.get_visitor_countries(integer);
DROP FUNCTION IF EXISTS public.get_weekly_visitors(integer);
DROP FUNCTION IF EXISTS public.get_visitor_engagement();
DROP FUNCTION IF EXISTS public.get_time_on_site();
DROP FUNCTION IF EXISTS public.get_operating_systems();
DROP FUNCTION IF EXISTS public.add_chat_message(uuid, text, text, boolean);
DROP FUNCTION IF EXISTS public.record_page_view(text, text, text, text, text, text, text);
DROP FUNCTION IF EXISTS public.record_user_interaction(text, text, text, text, text, text, text, integer, integer, text, text);
DROP FUNCTION IF EXISTS public.start_chat_conversation(text, text, text, text, text);
DROP FUNCTION IF EXISTS public.track_page_view(jsonb);
DROP FUNCTION IF EXISTS public.get_heatmap_data(text);

--
-- Create tables first so views can reference them
--

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    email text,
    last_login timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Page views table with enhanced analytics capabilities
CREATE TABLE IF NOT EXISTS public.page_views (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
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
CREATE TABLE IF NOT EXISTS public.user_interactions (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
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
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
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
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id uuid DEFAULT extensions.gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    content text NOT NULL,
    sender text NOT NULL,
    is_first_message boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (id)
);

-- Create indexes for optimized queries

-- Page views indexes
CREATE INDEX IF NOT EXISTS page_views_path_idx ON public.page_views USING btree (page_path);
CREATE INDEX IF NOT EXISTS page_views_session_idx ON public.page_views USING btree (session_id);
CREATE INDEX IF NOT EXISTS page_views_time_idx ON public.page_views USING btree (viewed_at);
CREATE INDEX IF NOT EXISTS page_views_device_idx ON public.page_views USING btree (device_type);
CREATE INDEX IF NOT EXISTS page_views_country_idx ON public.page_views USING btree (country);
CREATE INDEX IF NOT EXISTS page_views_referrer_idx ON public.page_views USING btree (referrer_source);
CREATE INDEX IF NOT EXISTS page_views_browser_idx ON public.page_views USING btree (browser);
CREATE INDEX IF NOT EXISTS page_views_os_idx ON public.page_views USING btree (operating_system);

-- User interactions indexes
CREATE INDEX IF NOT EXISTS user_interactions_type_idx ON public.user_interactions USING btree (action_type);
CREATE INDEX IF NOT EXISTS user_interactions_path_idx ON public.user_interactions USING btree (page_path);
CREATE INDEX IF NOT EXISTS user_interactions_session_idx ON public.user_interactions USING btree (session_id);
CREATE INDEX IF NOT EXISTS user_interactions_time_idx ON public.user_interactions USING btree (created_at);
CREATE INDEX IF NOT EXISTS user_interactions_element_idx ON public.user_interactions USING btree (element_id);

-- Chat conversations indexes
CREATE INDEX IF NOT EXISTS chat_conversations_session_idx ON public.chat_conversations USING btree (session_id);
CREATE INDEX IF NOT EXISTS chat_conversations_active_idx ON public.chat_conversations USING btree (is_active);
CREATE INDEX IF NOT EXISTS chat_conversations_time_idx ON public.chat_conversations USING btree (created_at);

-- Chat messages indexes
CREATE INDEX IF NOT EXISTS chat_messages_conversation_idx ON public.chat_messages USING btree (conversation_id);
CREATE INDEX IF NOT EXISTS chat_messages_time_idx ON public.chat_messages USING btree (created_at);

-- Foreign key constraints
ALTER TABLE public.chat_messages
    DROP CONSTRAINT IF EXISTS chat_messages_conversation_id_fkey,
    ADD CONSTRAINT chat_messages_conversation_id_fkey 
    FOREIGN KEY (conversation_id) REFERENCES public.chat_conversations(id) ON DELETE CASCADE;

-- Now create analytics summary views after tables exist
CREATE OR REPLACE VIEW public.analytics_summary AS
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
CREATE OR REPLACE VIEW public.weekly_analytics_summary AS
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
CREATE OR REPLACE FUNCTION public.calculate_growth_rate(current_value numeric, previous_value numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Handle cases where previous value is zero to avoid division by zero
  IF previous_value = 0 OR previous_value IS NULL THEN
    RETURN 100.0; -- Infinite growth, cap at 100%
  END IF;
  
  -- Calculate percentage change
  RETURN ((current_value - previous_value) / previous_value) * 100.0;
END;
$$;

-- Get active sessions with detailed metrics
CREATE OR REPLACE FUNCTION public.get_active_sessions(hours integer DEFAULT 24) RETURNS TABLE(
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
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get comprehensive analytics metrics with comparative periods
CREATE OR REPLACE FUNCTION public.get_analytics_metrics(days integer DEFAULT 7) RETURNS TABLE(
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
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get browser usage statistics
CREATE OR REPLACE FUNCTION public.get_browser_usage() RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get detailed daily visitor data
CREATE OR REPLACE FUNCTION public.get_daily_visitors(days integer DEFAULT 7) RETURNS TABLE(
    day date, 
    visitors integer, 
    page_views integer, 
    bounce_rate numeric,
    avg_duration numeric
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get device distribution data
CREATE OR REPLACE FUNCTION public.get_device_distribution() RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get user interaction types
CREATE OR REPLACE FUNCTION public.get_interaction_types() RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get most visited pages
CREATE OR REPLACE FUNCTION public.get_top_pages(limit_count integer DEFAULT 5) RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get traffic sources
CREATE OR REPLACE FUNCTION public.get_traffic_sources() RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get visitor countries
CREATE OR REPLACE FUNCTION public.get_visitor_countries(limit_count integer DEFAULT 5) RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get weekly visitors trend for growth chart
CREATE OR REPLACE FUNCTION public.get_weekly_visitors(weeks integer DEFAULT 8) RETURNS TABLE(
    week_start date,
    visitors integer
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get detailed visitor engagement levels
CREATE OR REPLACE FUNCTION public.get_visitor_engagement() RETURNS TABLE(
    name text,
    value integer
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get time on site distribution
CREATE OR REPLACE FUNCTION public.get_time_on_site() RETURNS TABLE(
    name text,
    value integer
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Get user operating systems
CREATE OR REPLACE FUNCTION public.get_operating_systems() RETURNS TABLE(name text, value integer)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Add a chat message
CREATE OR REPLACE FUNCTION public.add_chat_message(conversation_id uuid, content text, sender text, is_first_message boolean DEFAULT false) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Record a page view with enhanced data collection
CREATE OR REPLACE FUNCTION public.record_page_view(
    page_path text, 
    user_agent text, 
    ip_address text, 
    referrer text, 
    screen_size text DEFAULT NULL::text,
    entry_url text DEFAULT NULL::text,
    locale text DEFAULT NULL::text
) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_id UUID;
  device TEXT;
  browser TEXT;
  os TEXT;
  country TEXT := 'Unknown';
  city TEXT := 'Unknown';
  referrer_source TEXT;
  session_id TEXT;
BEGIN
  -- Determine device type from user agent
  IF user_agent ILIKE '%mobile%' OR user_agent ILIKE '%android%' OR user_agent ILIKE '%iphone%' THEN
    device := 'Mobile';
  ELSIF user_agent ILIKE '%ipad%' OR user_agent ILIKE '%tablet%' THEN
    device := 'Tablet';
  ELSIF user_agent ILIKE '%windows%' OR user_agent ILIKE '%macintosh%' OR user_agent ILIKE '%linux%' THEN
    device := 'Desktop';
  ELSE
    device := 'Other';
  END IF;
  
  -- Determine browser from user agent
  IF user_agent ILIKE '%chrome%' AND NOT user_agent ILIKE '%edge%' THEN
    browser := 'Chrome';
  ELSIF user_agent ILIKE '%firefox%' THEN
    browser := 'Firefox';
  ELSIF user_agent ILIKE '%safari%' AND NOT user_agent ILIKE '%chrome%' THEN
    browser := 'Safari';
  ELSIF user_agent ILIKE '%edge%' OR user_agent ILIKE '%edg/%' THEN
    browser := 'Edge';
  ELSIF user_agent ILIKE '%opera%' OR user_agent ILIKE '%opr/%' THEN
    browser := 'Opera';
  ELSIF user_agent ILIKE '%trident%' OR user_agent ILIKE '%msie%' THEN
    browser := 'Internet Explorer';
  ELSE
    browser := 'Other';
  END IF;
  
  -- Determine operating system
  IF user_agent ILIKE '%windows%' THEN
    os := 'Windows';
  ELSIF user_agent ILIKE '%macintosh%' OR user_agent ILIKE '%mac os%' THEN
    os := 'MacOS';
  ELSIF user_agent ILIKE '%linux%' THEN
    os := 'Linux';
  ELSIF user_agent ILIKE '%android%' THEN
    os := 'Android';
  ELSIF user_agent ILIKE '%iphone%' OR user_agent ILIKE '%ipad%' OR user_agent ILIKE '%ipod%' THEN
    os := 'iOS';
  ELSE
    os := 'Other';
  END IF;
  
  -- Determine referrer source
  IF referrer IS NULL OR referrer = '' OR referrer ILIKE '%direct%' THEN
    referrer_source := 'Direct';
  ELSIF referrer ILIKE '%google%' OR referrer ILIKE '%bing%' OR referrer ILIKE '%yahoo%' OR referrer ILIKE '%duckduckgo%' THEN
    referrer_source := 'Search';
  ELSIF referrer ILIKE '%facebook%' OR referrer ILIKE '%twitter%' OR referrer ILIKE '%instagram%' OR 
         referrer ILIKE '%linkedin%' OR referrer ILIKE '%pinterest%' OR referrer ILIKE '%reddit%' THEN
    referrer_source := 'Social';
  ELSIF referrer ILIKE '%http%' OR referrer ILIKE '%www%' THEN
    referrer_source := 'Referral';
  ELSE
    referrer_source := 'Other';
  END IF;
  
  -- Create random session ID if one doesn't exist
  -- In a real app, you would pass in the session ID
  session_id := md5(random()::text || now()::text);
  
  -- Insert the page view record
  INSERT INTO page_views (
    page_path,
    user_agent,
    ip_address,
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
    viewed_at
  ) VALUES (
    page_path,
    user_agent,
    ip_address,
    referrer,
    device,
    browser,
    os,
    country,
    city,
    referrer_source,
    screen_size,
    entry_url,
    locale,
    session_id,
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Record a user interaction with enhanced data collection
CREATE OR REPLACE FUNCTION public.record_user_interaction(
    action_type text, 
    page_path text, 
    ip_address text, 
    user_agent text, 
    element_id text DEFAULT NULL::text, 
    element_class text DEFAULT NULL::text, 
    element_type text DEFAULT NULL::text, 
    x_position integer DEFAULT NULL::integer, 
    y_position integer DEFAULT NULL::integer, 
    value text DEFAULT NULL::text,
    session_id text DEFAULT NULL::text
) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_id UUID;
  final_session_id TEXT;
BEGIN
  -- Use provided session ID or create a new one
  IF session_id IS NULL THEN
    final_session_id := md5(random()::text || now()::text);
  ELSE
    final_session_id := session_id;
  END IF;
  
  -- Insert the interaction record
  INSERT INTO user_interactions (
    action_type,
    page_path,
    ip_address,
    user_agent,
    element_id,
    element_class,
    element_type,
    session_id,
    x_position,
    y_position,
    value,
    created_at
  ) VALUES (
    action_type,
    page_path,
    ip_address,
    user_agent,
    element_id,
    element_class,
    element_type,
    final_session_id,
    x_position,
    y_position,
    value,
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Start a chat conversation
CREATE OR REPLACE FUNCTION public.start_chat_conversation(
    ip_address text, 
    user_agent text, 
    referrer text DEFAULT NULL::text,
    locale text DEFAULT NULL::text,
    initial_page text DEFAULT NULL::text
) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_id UUID;
  session_id TEXT := md5(random()::text || now()::text);
BEGIN
  -- Insert the conversation record
  INSERT INTO chat_conversations (
    ip_address,
    user_agent,
    referrer,
    session_id,
    locale,
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
    locale,
    initial_page,
    true,
    now(),
    now(),
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Track page view from client-side data
CREATE OR REPLACE FUNCTION public.track_page_view(js_data jsonb) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_id UUID;
BEGIN
  SELECT record_page_view(
    js_data->>'page_path',
    js_data->>'user_agent',
    js_data->>'ip_address',
    js_data->>'referrer',
    js_data->>'screen_size',
    js_data->>'entry_url',
    js_data->>'locale'
  ) INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Get heatmap data for a specific page
CREATE OR REPLACE FUNCTION public.get_heatmap_data(target_page text) RETURNS TABLE(
    x_position integer,
    y_position integer,
    count integer
)
    LANGUAGE plpgsql
    AS $$
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
$$;

-- Insert sample admin user (if it doesn't exist)
INSERT INTO public.admin_users (username, password_hash, email)
SELECT 'admin', 
  -- This is a placeholder hash for 'password' - use a proper password hash in production
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 
  'admin@example.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.admin_users WHERE username = 'admin'
);

-- Insert sample analytics data
DO $$
DECLARE
  session_id TEXT;
  page_view_id UUID;
  conv_id UUID;
  msg_id UUID;
  browsers TEXT[] := ARRAY['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  devices TEXT[] := ARRAY['Desktop', 'Mobile', 'Tablet'];
  operating_systems TEXT[] := ARRAY['Windows', 'MacOS', 'iOS', 'Android', 'Linux'];
  countries TEXT[] := ARRAY['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India'];
  referrers TEXT[] := ARRAY['Direct', 'Search', 'Social', 'Referral'];
  pages TEXT[] := ARRAY['/home', '/about', '/projects', '/contact', '/blog', '/portfolio'];
  actions TEXT[] := ARRAY['click', 'scroll', 'hover', 'input', 'submit'];
  i INTEGER;
BEGIN
  -- Create sample data for the last 7 days
  FOR i IN 1..200 LOOP
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
        md5(random()::text || now()::text),
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
$$;

-- PostgreSQL database dump complete
-- 