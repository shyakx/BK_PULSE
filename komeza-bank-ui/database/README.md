# KOMEZA BANK Database Setup

This guide will help you set up PostgreSQL for the KOMEZA BANK application.

## Prerequisites

- PostgreSQL 12+ installed
- Node.js and npm installed
- Your CSV data file: `bk_simulated_churn_dataset_with_segment_200k.csv`

## 1. Install Dependencies

```bash
npm install pg papaparse
```

## 2. Database Setup

### Create Database
```sql
CREATE DATABASE bk-pulse;
```

### Run Schema
```bash
psql -U postgres -d bk-pulse -f database/schema.sql
```

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
VITE_DB_HOST=localhost
VITE_DB_PORT=5434
VITE_DB_NAME=bk-pulse
VITE_DB_USER=postgres
VITE_DB_PASSWORD=0123

# Server-side Database Configuration
DB_HOST=localhost
DB_PORT=5434
DB_NAME=bk-pulse
DB_USER=postgres
DB_PASSWORD=0123
```

## 4. Migrate CSV Data

Run the migration script to import your CSV data:

```bash
node database/migrate_csv_to_postgres.js
```

This will:
- Import all 200k customers from your CSV
- Generate realistic Rwandan names
- Create customer interactions
- Set up proper indexes

## 5. Update Application

The application will automatically use PostgreSQL instead of CSV when the database is available.

## Database Schema

### Tables
- `customers` - Main customer data
- `customer_interactions` - Customer interaction history
- `churn_predictions` - Prediction audit trail
- `retention_campaigns` - Campaign management

### Views
- `high_risk_customers` - Customers with >60% churn probability
- `customer_segment_stats` - Statistics by segment

### Features
- Automatic risk level updates
- Performance indexes
- Audit trails
- Real-time statistics

## Performance Benefits

- **Faster queries**: Indexed database vs CSV parsing
- **Real-time updates**: Direct database operations
- **Scalability**: Handle millions of customers
- **Concurrent access**: Multiple users simultaneously
- **Data integrity**: ACID compliance

## Troubleshooting

### Connection Issues
```bash
# Test connection
psql -U postgres -d bk-pulse -c "SELECT NOW();"
```

### Migration Issues
```bash
# Check if data exists
psql -U postgres -d bk-pulse -c "SELECT COUNT(*) FROM customers;"
```

### Performance Issues
```bash
# Check indexes
psql -U postgres -d bk-pulse -c "\d customers"
```
