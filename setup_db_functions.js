// This script loads SQL functions into Supabase
// Run with: node setup_db_functions.js

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupFunctions() {
  try {
    console.log('Setting up Supabase SQL functions...');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('./src/db/table_functions.sql', 'utf8');
    
    // Split the file by function to run each separately
    const functions = sqlContent.split(/CREATE OR REPLACE FUNCTION/g);
    
    for (let i = 1; i < functions.length; i++) {
      const functionSql = 'CREATE OR REPLACE FUNCTION' + functions[i];
      
      // Execute each function creation
      const { error } = await supabase.rpc('exec_sql', { sql: functionSql });
      
      if (error) {
        console.error(`Error creating function #${i}:`, error);
        
        // Try creating exec_sql function if it doesn't exist
        if (i === 1) {
          console.log('Trying to create exec_sql function...');
          const { error: pgError } = await supabase.rpc('create_exec_sql_function');
          
          if (!pgError) {
            console.log('exec_sql function created, retrying...');
            i--; // Retry the same function
            continue;
          } else {
            console.error('Failed to create exec_sql function:', pgError);
          }
        }
      } else {
        console.log(`SQL function #${i} created successfully`);
      }
    }
    
    console.log('Setup completed.');
  } catch (error) {
    console.error('Error setting up SQL functions:', error);
  }
}

// Run the function
setupFunctions(); 