-- Drop existing tables if they exist
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_conversations;
DROP TABLE IF EXISTS user_interactions;
DROP TABLE IF EXISTS page_views;
DROP TABLE IF EXISTS experiences;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS admin_users;

-- Create admin_users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create projects table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
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

-- Create experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
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

-- Enhanced page_views table with additional analytics data
CREATE TABLE page_views (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(255) NOT NULL,
  views INTEGER DEFAULT 1,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(100),
  user_agent TEXT,
  ip_address VARCHAR(100),
  referrer VARCHAR(255),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  country VARCHAR(100),
  city VARCHAR(100),
  screen_size VARCHAR(50),
  time_on_page INTEGER, -- Time in seconds
  is_bounce BOOLEAN DEFAULT false
);

-- Enhanced user_interactions table with detailed tracking
CREATE TABLE user_interactions (
  id SERIAL PRIMARY KEY,
  action_type VARCHAR(50) NOT NULL, -- click, scroll, hover, etc.
  page_path VARCHAR(255) NOT NULL,
  element_id VARCHAR(100),
  element_class VARCHAR(100),
  element_type VARCHAR(50),
  count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(100),
  user_agent TEXT,
  ip_address VARCHAR(100),
  x_position INTEGER,
  y_position INTEGER,
  value TEXT -- For capturing form field values, search terms, etc.
);

-- Create chat_conversations table
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(100),
  session_id VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(100),
  user_agent TEXT,
  referrer VARCHAR(255)
);

-- Create chat_messages table
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES chat_conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender VARCHAR(20) NOT NULL, -- 'user' or 'bot'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_first_message BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX idx_page_views_page_path ON page_views(page_path);
CREATE INDEX idx_page_views_viewed_at ON page_views(viewed_at);
CREATE INDEX idx_user_interactions_action_type ON user_interactions(action_type);
CREATE INDEX idx_user_interactions_created_at ON user_interactions(created_at);
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages(conversation_id);

-- Insert sample data for admin users
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('admin', '$2a$10$rLtKbmAUKCJxMjF7IQpQr.ZUm1Y98UpzOlT6gzMeVUjCW9jfP3yAe', 'admin@example.com'); -- Password is 'admin123'

-- Insert sample projects
INSERT INTO projects (title, description, technologies, image_url, project_url, github_url, featured)
VALUES 
('Portfolio Website', 'My personal portfolio website built with React and TypeScript', ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Supabase'], '/images/projects/portfolio.jpg', 'https://myportfolio.com', 'https://github.com/username/portfolio', true),
('E-commerce Platform', 'A full-stack e-commerce platform with payment processing', ARRAY['Next.js', 'Node.js', 'Stripe', 'MongoDB'], '/images/projects/ecommerce.jpg', 'https://myshop.com', 'https://github.com/username/ecommerce', true),
('Task Management App', 'A productivity app for managing tasks and projects', ARRAY['React Native', 'Firebase', 'Redux'], '/images/projects/taskapp.jpg', 'https://taskapp.com', 'https://github.com/username/taskapp', false);

-- Insert sample experiences
INSERT INTO experiences (company, position, start_date, end_date, current, description, technologies)
VALUES 
('Tech Solutions Inc.', 'Senior Frontend Developer', '2021-06-01', NULL, true, 'Leading the frontend team in developing modern web applications', ARRAY['React', 'TypeScript', 'GraphQL']),
('Digital Innovations', 'Full Stack Developer', '2019-03-15', '2021-05-30', false, 'Developed and maintained multiple client projects', ARRAY['Vue.js', 'Node.js', 'PostgreSQL']),
('WebDev Agency', 'Junior Developer', '2017-08-01', '2019-03-01', false, 'Started my career working on responsive websites', ARRAY['HTML', 'CSS', 'JavaScript', 'PHP']);

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
-- 3 days ago
('/', 1, CURRENT_TIMESTAMP - INTERVAL '3 days', 'session8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.8', 'facebook.com', 'Desktop', 'Chrome', 'Brazil', 'Rio de Janeiro'),
('/projects', 1, CURRENT_TIMESTAMP - INTERVAL '3 days 2 hours', 'session9', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0)', '192.168.1.9', 'direct', 'Mobile', 'Safari', 'France', 'Paris'),
-- 4 days ago
('/', 1, CURRENT_TIMESTAMP - INTERVAL '4 days', 'session10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.10', 'github.com', 'Desktop', 'Chrome', 'Spain', 'Madrid'),
('/about', 1, CURRENT_TIMESTAMP - INTERVAL '4 days 1 hour', 'session11', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.11', 'direct', 'Desktop', 'Firefox', 'Italy', 'Rome'),
-- 5 days ago
('/', 1, CURRENT_TIMESTAMP - INTERVAL '5 days', 'session12', 'Mozilla/5.0 (Linux; Android 10)', '192.168.1.12', 'youtube.com', 'Mobile', 'Chrome', 'Mexico', 'Mexico City'),
('/contact', 1, CURRENT_TIMESTAMP - INTERVAL '5 days 5 hours', 'session13', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.13', 'direct', 'Desktop', 'Chrome', 'China', 'Beijing'),
-- 6 days ago
('/', 1, CURRENT_TIMESTAMP - INTERVAL '6 days', 'session14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.14', 'reddit.com', 'Desktop', 'Safari', 'India', 'Mumbai'),
('/projects', 1, CURRENT_TIMESTAMP - INTERVAL '6 days 3 hours', 'session15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.15', 'direct', 'Desktop', 'Edge', 'South Korea', 'Seoul');

-- Insert sample user interactions
INSERT INTO user_interactions (action_type, page_path, element_id, element_class, count, created_at, session_id, user_agent, ip_address)
VALUES
-- Today
('click', '/', 'nav-projects', 'nav-link', 1, CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes', 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
('scroll', '/projects', null, null, 1, CURRENT_TIMESTAMP - INTERVAL '1 hour', 'session1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.1'),
('click', '/about', 'contact-button', 'btn btn-primary', 1, CURRENT_TIMESTAMP - INTERVAL '25 minutes', 'session2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)', '192.168.1.2'),
-- Yesterday
('hover', '/', 'project-card-1', 'card', 1, CURRENT_TIMESTAMP - INTERVAL '1 day 30 minutes', 'session3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.3'),
('click', '/contact', 'submit-form', 'btn', 1, CURRENT_TIMESTAMP - INTERVAL '1 day 1 hour 30 minutes', 'session4', 'Mozilla/5.0 (Linux; Android 11)', '192.168.1.4'),
('scroll', '/projects', null, null, 1, CURRENT_TIMESTAMP - INTERVAL '1 day 3 hours 30 minutes', 'session5', 'Mozilla/5.0 (iPad; CPU OS 14_0)', '192.168.1.5'),
-- 2 days ago
('click', '/', 'nav-blog', 'nav-link', 1, CURRENT_TIMESTAMP - INTERVAL '2 days 30 minutes', 'session6', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.6'),
('view', '/blog', 'blog-post-1', 'blog-post', 1, CURRENT_TIMESTAMP - INTERVAL '2 days 2 hours 30 minutes', 'session7', 'Mozilla/5.0 (X11; Linux x86_64)', '192.168.1.7'),
-- 3-6 days ago
('chat', '/', 'chat-widget', 'widget', 1, CURRENT_TIMESTAMP - INTERVAL '3 days 30 minutes', 'session8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.8'),
('download', '/projects', 'resume-download', 'download-link', 1, CURRENT_TIMESTAMP - INTERVAL '4 days 30 minutes', 'session10', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.10'),
('search', '/', 'search-box', 'search', 1, CURRENT_TIMESTAMP - INTERVAL '5 days 30 minutes', 'session12', 'Mozilla/5.0 (Linux; Android 10)', '192.168.1.12'),
('play', '/projects', 'video-demo', 'video-player', 1, CURRENT_TIMESTAMP - INTERVAL '6 days 30 minutes', 'session14', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '192.168.1.14');

-- Insert sample chat data
INSERT INTO chat_conversations (user_id, session_id, created_at, updated_at, last_message_at, ip_address, user_agent)
VALUES
('user123', 'session8', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days', '192.168.1.8', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'),
('user456', 'session4', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day', '192.168.1.4', 'Mozilla/5.0 (Linux; Android 11)');

-- Insert sample chat messages
INSERT INTO chat_messages (conversation_id, content, sender, created_at, is_first_message)
VALUES
(1, 'Hi, I\'m interested in your services.', 'user', CURRENT_TIMESTAMP - INTERVAL '3 days', true),
(1, 'Hello! Thanks for reaching out. How can I help you today?', 'bot', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '1 minute', false),
(1, 'I\'d like to discuss a potential project.', 'user', CURRENT_TIMESTAMP - INTERVAL '3 days' + INTERVAL '2 minutes', false),
(2, 'Hello, do you offer consulting services?', 'user', CURRENT_TIMESTAMP - INTERVAL '1 day', true),
(2, 'Yes, I do offer consulting services. What area are you looking for help with?', 'bot', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '1 minute', false);

-- Create view for analytics dashboard
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  date_trunc('day', viewed_at) as date,
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(*) as page_views,
  COUNT(DISTINCT page_path) as pages_visited,
  COUNT(CASE WHEN is_bounce THEN 1 END)::float / NULLIF(COUNT(DISTINCT ip_address), 0) as bounce_rate
FROM page_views
GROUP BY date_trunc('day', viewed_at)
ORDER BY date DESC;

-- Create function to get daily visitors for the past 7 days
CREATE OR REPLACE FUNCTION get_daily_visitors(days INTEGER DEFAULT 7)
RETURNS TABLE (
  date DATE,
  visitors INTEGER,
  page_views INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH date_range AS (
    SELECT generate_series(
      date_trunc('day', CURRENT_TIMESTAMP) - ((days-1) || ' days')::INTERVAL,
      date_trunc('day', CURRENT_TIMESTAMP),
      '1 day'::INTERVAL
    )::DATE as day
  )
  SELECT
    dr.day,
    COALESCE(COUNT(DISTINCT pv.ip_address), 0)::INTEGER as visitors,
    COALESCE(COUNT(pv.id), 0)::INTEGER as page_views
  FROM
    date_range dr
  LEFT JOIN
    page_views pv ON date_trunc('day', pv.viewed_at)::DATE = dr.day
  GROUP BY
    dr.day
  ORDER BY
    dr.day;
END;
$$ LANGUAGE plpgsql; 