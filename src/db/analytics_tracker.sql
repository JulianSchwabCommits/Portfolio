-- SQL Functions for tracking website analytics data
-- This file provides functions to track and store user interaction data

-- Function to record a page view with enhanced analytics data
CREATE OR REPLACE FUNCTION record_page_view(
  page_path TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  screen_size TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
  device TEXT;
  browser TEXT;
  country TEXT := 'Unknown';
  city TEXT := 'Unknown';
  referrer_source TEXT;
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
  DECLARE
    session_id TEXT := md5(random()::text || now()::text);
  BEGIN
    -- Insert the page view record
    INSERT INTO page_views (
      page_path,
      user_agent,
      ip_address,
      referrer,
      device_type,
      browser,
      country,
      city,
      referrer_source,
      screen_size,
      session_id,
      viewed_at
    ) VALUES (
      page_path,
      user_agent,
      ip_address,
      referrer,
      device,
      browser,
      country,
      city,
      referrer_source,
      screen_size,
      session_id,
      now()
    ) RETURNING id INTO new_id;
    
    RETURN new_id;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to record a user interaction
CREATE OR REPLACE FUNCTION record_user_interaction(
  action_type TEXT,
  page_path TEXT,
  ip_address TEXT,
  user_agent TEXT,
  element_id TEXT DEFAULT NULL,
  element_class TEXT DEFAULT NULL,
  element_type TEXT DEFAULT NULL,
  x_position INTEGER DEFAULT NULL,
  y_position INTEGER DEFAULT NULL,
  value TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
  session_id TEXT;
BEGIN
  -- Create random session ID if one doesn't exist
  -- In a real app, you would pass in the session ID
  session_id := md5(random()::text || now()::text);
  
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
    session_id,
    x_position,
    y_position,
    value,
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record a chat conversation start
CREATE OR REPLACE FUNCTION start_chat_conversation(
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT DEFAULT NULL
) RETURNS UUID AS $$
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
    is_active,
    created_at,
    updated_at,
    last_message_at
  ) VALUES (
    ip_address,
    user_agent,
    referrer,
    session_id,
    true,
    now(),
    now(),
    now()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add a message to a chat conversation
CREATE OR REPLACE FUNCTION add_chat_message(
  conversation_id UUID,
  content TEXT,
  sender TEXT,
  is_first_message BOOLEAN DEFAULT false
) RETURNS UUID AS $$
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

-- Client-side helper function to track page views from JavaScript
CREATE OR REPLACE FUNCTION track_page_view(
  js_data JSONB
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  SELECT record_page_view(
    js_data->>'page_path',
    js_data->>'user_agent',
    js_data->>'ip_address',
    js_data->>'referrer',
    js_data->>'screen_size'
  ) INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql; 