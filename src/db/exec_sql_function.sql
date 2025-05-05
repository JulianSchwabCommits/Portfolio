-- Function that can execute SQL statements
-- Note: This is a potentially dangerous function if exposed publicly
-- It should only be callable by authorized users
CREATE OR REPLACE FUNCTION exec_sql(sql text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN 'SQL executed successfully';
EXCEPTION WHEN OTHERS THEN
  RETURN 'Error: ' || SQLERRM;
END;
$$;

-- Function to create the exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION create_exec_sql_function()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  function_exists boolean;
BEGIN
  -- Check if exec_sql function exists
  SELECT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'exec_sql'
  ) INTO function_exists;
  
  IF NOT function_exists THEN
    -- Create the exec_sql function
    EXECUTE '
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $func$
    BEGIN
      EXECUTE sql;
      RETURN ''SQL executed successfully'';
    EXCEPTION WHEN OTHERS THEN
      RETURN ''Error: '' || SQLERRM;
    END;
    $func$;
    ';
    
    RETURN 'exec_sql function created successfully';
  ELSE
    RETURN 'exec_sql function already exists';
  END IF;
END;
$$; 