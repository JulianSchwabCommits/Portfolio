-- SQL Functions for analytics dashboard queries
-- These functions are used to fetch and aggregate analytics data

-- Get basic analytics metrics for the dashboard cards
CREATE OR REPLACE FUNCTION get_analytics_metrics(days INTEGER DEFAULT 7)
RETURNS TABLE (
  unique_visitors INTEGER,
  total_page_views INTEGER,
  avg_session_duration NUMERIC,
  bounce_rate NUMERIC,
  unique_prev_period INTEGER,
  views_prev_period INTEGER,
  duration_prev_period NUMERIC,
  bounce_prev_period NUMERIC
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
    COUNT(DISTINCT session_id) AS unique_visitors,
    COUNT(*) AS total_page_views,
    COALESCE(AVG(session_duration), 0) AS avg_session_duration,
    100.0 * SUM(CASE WHEN is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT session_id), 0) AS bounce_rate,
    
    -- Previous period metrics (for comparison)
    (SELECT COUNT(DISTINCT session_id) FROM page_views WHERE viewed_at BETWEEN prev_start AND current_start) AS unique_prev_period,
    (SELECT COUNT(*) FROM page_views WHERE viewed_at BETWEEN prev_start AND current_start) AS views_prev_period,
    COALESCE((SELECT AVG(session_duration) FROM page_views WHERE viewed_at BETWEEN prev_start AND current_start), 0) AS duration_prev_period,
    100.0 * (SELECT SUM(CASE WHEN is_bounce THEN 1 ELSE 0 END) / NULLIF(COUNT(DISTINCT session_id), 0) FROM page_views WHERE viewed_at BETWEEN prev_start AND current_start) AS bounce_prev_period
  INTO
    unique_visitors,
    total_page_views,
    avg_session_duration,
    bounce_rate,
    unique_prev_period,
    views_prev_period,
    duration_prev_period,
    bounce_prev_period
  FROM 
    page_views
  WHERE 
    viewed_at >= current_start;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- Get daily visitor data for the main graph
CREATE OR REPLACE FUNCTION get_daily_visitors(days INTEGER DEFAULT 7)
RETURNS TABLE (
  day DATE,
  visitors INTEGER,
  page_views INTEGER
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
    COALESCE(COUNT(pv.id), 0) AS page_views
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

-- Get traffic sources distribution
CREATE OR REPLACE FUNCTION get_traffic_sources()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(referrer_source, 'Direct') AS name,
    COUNT(*) AS value
  FROM 
    page_views
  WHERE 
    viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    referrer_source
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get device type distribution
CREATE OR REPLACE FUNCTION get_device_distribution()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(device_type, 'Other') AS name,
    COUNT(DISTINCT session_id) AS value
  FROM 
    page_views
  WHERE 
    viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    device_type
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get browser usage distribution
CREATE OR REPLACE FUNCTION get_browser_usage()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(browser, 'Other') AS name,
    COUNT(DISTINCT session_id) AS value
  FROM 
    page_views
  WHERE 
    viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    browser
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get top pages
CREATE OR REPLACE FUNCTION get_top_pages(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    page_path AS name,
    COUNT(*) AS value
  FROM 
    page_views
  WHERE 
    viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    page_path
  ORDER BY 
    value DESC
  LIMIT 
    limit_count;
END;
$$ LANGUAGE plpgsql;

-- Get interaction types
CREATE OR REPLACE FUNCTION get_interaction_types()
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    action_type AS name,
    COUNT(*) AS value
  FROM 
    user_interactions
  WHERE 
    created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    action_type
  ORDER BY 
    value DESC;
END;
$$ LANGUAGE plpgsql;

-- Get visitor countries
CREATE OR REPLACE FUNCTION get_visitor_countries(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
  name TEXT,
  value INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(country, 'Unknown') AS name,
    COUNT(DISTINCT session_id) AS value
  FROM 
    page_views
  WHERE 
    viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    country
  ORDER BY 
    value DESC
  LIMIT 
    limit_count;
END;
$$ LANGUAGE plpgsql;

-- Calculate growth rate between two values
CREATE OR REPLACE FUNCTION calculate_growth_rate(current_value NUMERIC, previous_value NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  -- Handle cases where previous value is zero to avoid division by zero
  IF previous_value = 0 OR previous_value IS NULL THEN
    RETURN 100.0; -- Infinite growth, cap at 100%
  END IF;
  
  -- Calculate percentage change
  RETURN ((current_value - previous_value) / previous_value) * 100.0;
END;
$$ LANGUAGE plpgsql;

-- Get recent active sessions
CREATE OR REPLACE FUNCTION get_active_sessions(hours INTEGER DEFAULT 24)
RETURNS TABLE (
  session_id TEXT,
  started_at TIMESTAMP,
  last_activity TIMESTAMP,
  page_count INTEGER,
  duration INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.session_id,
    MIN(pv.viewed_at) AS started_at,
    MAX(pv.viewed_at) AS last_activity,
    COUNT(*) AS page_count,
    EXTRACT(EPOCH FROM (MAX(pv.viewed_at) - MIN(pv.viewed_at)))::INTEGER AS duration
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