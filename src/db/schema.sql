-- Drop existing tables except projects and experiences
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_conversations CASCADE;
DROP TABLE IF EXISTS user_interactions CASCADE;
DROP TABLE IF EXISTS page_views CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
-- Note: projects and experiences tables are preserved

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Page views table with enhanced analytics capabilities
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  country TEXT DEFAULT 'Unknown',
  city TEXT DEFAULT 'Unknown',
  referrer_source TEXT,
  screen_size TEXT,
  entry_url TEXT,
  locale TEXT,
  session_id TEXT NOT NULL,
  is_bounce BOOLEAN DEFAULT true,
  session_duration INTEGER DEFAULT 0,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for page views
CREATE INDEX page_views_path_idx ON page_views(page_path);
CREATE INDEX page_views_session_idx ON page_views(session_id);
CREATE INDEX page_views_time_idx ON page_views(viewed_at);
CREATE INDEX page_views_device_idx ON page_views(device_type);
CREATE INDEX page_views_country_idx ON page_views(country);
CREATE INDEX page_views_referrer_idx ON page_views(referrer_source);
CREATE INDEX page_views_browser_idx ON page_views(browser);
CREATE INDEX page_views_os_idx ON page_views(operating_system);

-- User interactions table with enhanced tracking
CREATE TABLE user_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,
  page_path TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  session_id TEXT NOT NULL,
  element_id TEXT,
  element_class TEXT,
  element_type TEXT,
  x_position INTEGER,
  y_position INTEGER,
  value TEXT,
  scroll_depth INTEGER,
  time_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user interactions
CREATE INDEX user_interactions_type_idx ON user_interactions(action_type);
CREATE INDEX user_interactions_path_idx ON user_interactions(page_path);
CREATE INDEX user_interactions_session_idx ON user_interactions(session_id);
CREATE INDEX user_interactions_time_idx ON user_interactions(created_at);
CREATE INDEX user_interactions_element_idx ON user_interactions(element_id);

-- Chat conversations table with enhanced tracking
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  session_id TEXT NOT NULL,
  locale TEXT,
  initial_page TEXT,
  satisfaction_rating INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for chat conversations
CREATE INDEX chat_conversations_session_idx ON chat_conversations(session_id);
CREATE INDEX chat_conversations_active_idx ON chat_conversations(is_active);
CREATE INDEX chat_conversations_time_idx ON chat_conversations(created_at);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT NOT NULL,
  is_first_message BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for chat messages
CREATE INDEX chat_messages_conversation_idx ON chat_messages(conversation_id);
CREATE INDEX chat_messages_time_idx ON chat_messages(created_at);

-- Create analytics view for easier reporting
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

-- Insert sample admin user
INSERT INTO admin_users (username, password_hash, email)
VALUES ('admin', 
  -- This is a placeholder hash for 'password' - you should use a proper password hash in production
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', 
  'admin@example.com'
);

-- Insert sample page views data for past 7 days
INSERT INTO page_views (page_path, ip_address, user_agent, referrer, device_type, browser, operating_system, country, city, referrer_source, session_id, is_bounce, session_duration, viewed_at)
SELECT
  -- Randomly select a page path
  (ARRAY[
    '/', 
    '/about', 
    '/projects/portfolio-website', 
    '/projects/task-management-app', 
    '/projects/ecommerce-platform',
    '/contact', 
    '/play'
  ])[floor(random() * 7) + 1] AS page_path,
  
  -- Anonymize IPs
  'anonymous' AS ip_address,
  
  -- Generate plausible user agents
  (ARRAY[
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
  ])[floor(random() * 6) + 1] AS user_agent,
  
  -- Generate plausible referrers
  (ARRAY[
    'https://google.com',
    'https://bing.com',
    'https://twitter.com',
    'https://linkedin.com',
    'https://github.com',
    ''
  ])[floor(random() * 6) + 1] AS referrer,
  
  -- Device types based on user agent (simplified)
  (ARRAY['Desktop', 'Mobile', 'Tablet'])[floor(random() * 3) + 1] AS device_type,
  
  -- Browser types
  (ARRAY['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'])[floor(random() * 5) + 1] AS browser,
  
  -- OS types
  (ARRAY['Windows', 'MacOS', 'iOS', 'Android', 'Linux', 'Other'])[floor(random() * 6) + 1] AS operating_system,
  
  -- Countries
  (ARRAY['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Australia', 'Japan', 'India', 'Brazil', 'Unknown'])[floor(random() * 10) + 1] AS country,
  
  -- Cities
  (ARRAY['New York', 'London', 'San Francisco', 'Berlin', 'Paris', 'Tokyo', 'Sydney', 'Mumbai', 'Toronto', 'Unknown'])[floor(random() * 10) + 1] AS city,
  
  -- Referrer sources
  (ARRAY['Direct', 'Search', 'Social', 'Referral', 'Other'])[floor(random() * 5) + 1] AS referrer_source,
  
  -- Session IDs (make enough unique ones for realistic visitor counts)
  'session_' || floor(random() * 100) + 1 AS session_id,
  
  -- Is bounce
  random() < 0.3 AS is_bounce,
  
  -- Session duration (0-15 minutes in seconds)
  floor(random() * 900) AS session_duration,
  
  -- Timestamp within the last 7 days
  NOW() - (random() * interval '7 days') AS viewed_at
FROM
  generate_series(1, 500); -- Generate 500 page views across 7 days

-- Insert sample user interactions
INSERT INTO user_interactions (action_type, page_path, session_id, element_id, element_type, x_position, y_position, created_at)
SELECT
  -- Interaction types
  (ARRAY['click', 'button_click', 'link_click', 'form_submit', 'scroll', 'hover'])[floor(random() * 6) + 1] AS action_type,
  
  -- Page paths (same as for page views)
  (ARRAY[
    '/', 
    '/about', 
    '/projects/portfolio-website', 
    '/projects/task-management-app', 
    '/projects/ecommerce-platform',
    '/contact', 
    '/play'
  ])[floor(random() * 7) + 1] AS page_path,
  
  -- Session IDs (use the same range as for page views)
  'session_' || floor(random() * 100) + 1 AS session_id,
  
  -- Element IDs
  (ARRAY['nav-home', 'nav-about', 'nav-projects', 'nav-contact', 'project-card', 'contact-form', 'submit-button', 'theme-toggle', 'search-button'])[floor(random() * 9) + 1] AS element_id,
  
  -- Element types
  (ARRAY['a', 'button', 'div', 'input', 'form', 'header', 'section'])[floor(random() * 7) + 1] AS element_type,
  
  -- X position (for heatmap)
  floor(random() * 1200) + 1 AS x_position,
  
  -- Y position (for heatmap)
  floor(random() * 800) + 1 AS y_position,
  
  -- Timestamp within the last 7 days
  NOW() - (random() * interval '7 days') AS created_at
FROM
  generate_series(1, 300); -- Generate 300 user interactions

-- Insert sample chat conversations
INSERT INTO chat_conversations (ip_address, user_agent, session_id, is_active, created_at, updated_at, last_message_at)
SELECT
  'anonymous' AS ip_address,
  
  -- User agents
  (ARRAY[
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  ])[floor(random() * 3) + 1] AS user_agent,
  
  -- Session IDs (create new ones for conversations)
  'chat_session_' || n AS session_id,
  
  -- Is active (80% are inactive)
  random() > 0.8 AS is_active,
  
  -- Created at
  NOW() - (random() * interval '7 days') AS created_at,
  
  -- Updated at (between created_at and now)
  NOW() - (random() * interval '3 days') AS updated_at,
  
  -- Last message at (between updated_at and now)
  NOW() - (random() * interval '2 days') AS last_message_at
FROM
  generate_series(1, 20) n; -- Generate 20 chat conversations

-- Insert sample chat messages
INSERT INTO chat_messages (conversation_id, content, sender, is_first_message, created_at)
WITH conversations AS (
  SELECT id, created_at FROM chat_conversations
)
SELECT
  c.id AS conversation_id,
  
  -- Message content
  CASE 
    WHEN msg_num = 1 THEN 'Hi there! How can I help you today?'
    WHEN sender = 'bot' THEN 
      (ARRAY[
        'I''d be happy to help with that!',
        'Could you tell me more about what you''re looking for?',
        'That''s a great question. Let me explain...',
        'You can find that information on the Projects page.',
        'Feel free to reach out via the Contact form for more details.',
        'Is there anything else you''d like to know?'
      ])[floor(random() * 6) + 1]
    ELSE
      (ARRAY[
        'Can you tell me more about your experience?',
        'I''m interested in your portfolio.',
        'How can I contact you for freelance work?',
        'What technologies do you use most often?',
        'Do you have any examples of your work?',
        'Thanks for the information!'
      ])[floor(random() * 6) + 1]
  END AS content,
  
  -- Sender
  CASE 
    WHEN msg_num = 1 THEN 'bot'
    WHEN msg_num % 2 = 0 THEN 'user'
    ELSE 'bot'
  END AS sender,
  
  -- Is first message
  msg_num = 1 AS is_first_message,
  
  -- Created at (starting from conversation created_at, spaced out by 1-5 minutes)
  c.created_at + (interval '1 minute' * (msg_num + floor(random() * 5))) AS created_at
FROM
  conversations c,
  generate_series(1, 10) msg_num -- Up to 10 messages per conversation
WHERE
  -- Only create messages up to a random count for each conversation
  msg_num <= floor(random() * 8) + 3; -- 3-10 messages 