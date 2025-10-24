-- Script to check existing table structures in bk-pulse database
-- This will help us see what columns exist and what we need to add/modify

-- Check customers table structure
SELECT 
    'customers' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'customers' 
ORDER BY ordinal_position;

-- Check alerts table structure
SELECT 
    'alerts' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'alerts' 
ORDER BY ordinal_position;

-- Check departments table structure
SELECT 
    'departments' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'departments' 
ORDER BY ordinal_position;

-- Check employees table structure
SELECT 
    'employees' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- Check retention_actions table structure
SELECT 
    'retention_actions' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'retention_actions' 
ORDER BY ordinal_position;

-- Check test_connection table structure
SELECT 
    'test_connection' as table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'test_connection' 
ORDER BY ordinal_position;

-- Get row counts for each table
SELECT 
    'customers' as table_name,
    COUNT(*) as row_count
FROM customers
UNION ALL
SELECT 
    'alerts' as table_name,
    COUNT(*) as row_count
FROM alerts
UNION ALL
SELECT 
    'departments' as table_name,
    COUNT(*) as row_count
FROM departments
UNION ALL
SELECT 
    'employees' as table_name,
    COUNT(*) as row_count
FROM employees
UNION ALL
SELECT 
    'retention_actions' as table_name,
    COUNT(*) as row_count
FROM retention_actions
UNION ALL
SELECT 
    'test_connection' as table_name,
    COUNT(*) as row_count
FROM test_connection;
