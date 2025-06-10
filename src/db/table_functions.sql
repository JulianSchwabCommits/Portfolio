-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (
  table_name text
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT tablename::text
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public'
  ORDER BY tablename;
END;
$$;

-- Function to get column information for a specific table
CREATE OR REPLACE FUNCTION get_table_columns(p_table_name text)
RETURNS TABLE (
  name text,
  type text,
  is_nullable boolean,
  is_primary_key boolean
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text AS name,
    c.data_type::text AS type,
    c.is_nullable = 'YES' AS is_nullable,
    CASE WHEN pk.constraint_name IS NOT NULL THEN true ELSE false END AS is_primary_key
  FROM 
    information_schema.columns c
  LEFT JOIN (
    SELECT 
      kcu.column_name, 
      tc.constraint_name
    FROM 
      information_schema.table_constraints tc
    JOIN 
      information_schema.key_column_usage kcu
    ON 
      tc.constraint_name = kcu.constraint_name AND
      tc.table_schema = kcu.table_schema
    WHERE 
      tc.table_name = p_table_name AND
      tc.constraint_type = 'PRIMARY KEY' AND
      tc.table_schema = 'public'
  ) pk ON c.column_name = pk.column_name
  WHERE 
    c.table_name = p_table_name AND
    c.table_schema = 'public'
  ORDER BY 
    c.ordinal_position;
END;
$$;

-- Function to create required functions if they don't exist
CREATE OR REPLACE FUNCTION create_table_functions()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  function_already_exists boolean;
BEGIN
  -- Check if get_tables function exists
  SELECT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'get_tables'
  ) INTO function_already_exists;
  
  IF NOT function_already_exists THEN
    -- Create the get_tables function
    EXECUTE '
    CREATE OR REPLACE FUNCTION get_tables()
    RETURNS TABLE (
      table_name text
    ) 
    LANGUAGE plpgsql
    AS $func$
    BEGIN
      RETURN QUERY
      SELECT tablename::text
      FROM pg_catalog.pg_tables
      WHERE schemaname = ''public''
      ORDER BY tablename;
    END;
    $func$;
    ';
    
    -- Create the get_table_columns function
    EXECUTE '
    CREATE OR REPLACE FUNCTION get_table_columns(p_table_name text)
    RETURNS TABLE (
      name text,
      type text,
      is_nullable boolean,
      is_primary_key boolean
    ) 
    LANGUAGE plpgsql
    AS $func$
    BEGIN
      RETURN QUERY
      SELECT 
        c.column_name::text AS name,
        c.data_type::text AS type,
        c.is_nullable = ''YES'' AS is_nullable,
        CASE WHEN pk.constraint_name IS NOT NULL THEN true ELSE false END AS is_primary_key
      FROM 
        information_schema.columns c
      LEFT JOIN (
        SELECT 
          kcu.column_name, 
          tc.constraint_name
        FROM 
          information_schema.table_constraints tc
        JOIN 
          information_schema.key_column_usage kcu
        ON 
          tc.constraint_name = kcu.constraint_name AND
          tc.table_schema = kcu.table_schema
        WHERE 
          tc.table_name = p_table_name AND
          tc.constraint_type = ''PRIMARY KEY'' AND
          tc.table_schema = ''public''
      ) pk ON c.column_name = pk.column_name
      WHERE 
        c.table_name = p_table_name AND
        c.table_schema = ''public''
      ORDER BY 
        c.ordinal_position;
    END;
    $func$;
    ';
    
    RETURN 'Functions created successfully';
  ELSE
    RETURN 'Functions already exist';
  END IF;
END;
$$; 