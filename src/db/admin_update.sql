-- Step 1: Create a temporary table with the new structure
CREATE TABLE IF NOT EXISTS admin_users_new (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert the SHA-256 hashed password
INSERT INTO admin_users_new (password_hash)
VALUES ('passwordhash');

-- Step 3: Drop the old table
DROP TABLE admin_users;

-- Step 4: Rename the new table to the original name
ALTER TABLE admin_users_new RENAME TO admin_users;

-- Step 5: Recreate any needed indexes or constraints
-- (Add any additional indexes here if needed)

-- Step 6: Verify the update - this is optional
SELECT * FROM admin_users; 