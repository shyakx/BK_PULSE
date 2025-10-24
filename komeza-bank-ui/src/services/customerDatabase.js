// Customer Database Service - Connects to PostgreSQL
import { CustomerDatabase, testConnection } from './database.js';

// Check if database is available
let useDatabase = false;
testConnection().then(connected => {
  useDatabase = connected;
  if (connected) {
    console.log('Using PostgreSQL database');
  } else {
    console.log('Database not available, falling back to CSV');
  }
});

// Fallback to CSV if database is not available
import Papa from 'papaparse';

// Cache for loaded CSV data (fallback)
let customerData = null;
let dataLoaded = false;

// Load CSV data on first access
async function loadCustomerData() {
  if (dataLoaded) return customerData;
  
  try {
    const response = await fetch('/model/bk_simulated_churn_dataset_with_segment_200k.csv');
    const csvText = await response.text();
    
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim()
    });
    
    customerData = result.data;
    dataLoaded = true;
    console.log(`Loaded ${customerData.length} customers from CSV`);
    return customerData;
  } catch (error) {
    console.error('Failed to load customer data:', error);
    return [];
  }
}

// Generate realistic names based on Customer_ID and Gender
function generateCustomerName(customerId, gender) {
  const FIRST_NAMES_MALE = [
    'Jean', 'Pierre', 'Paul', 'François', 'Joseph', 'Antoine', 'Charles', 'Louis', 'Michel', 'Philippe',
    'David', 'Daniel', 'André', 'Robert', 'Marc', 'Claude', 'Bernard', 'Alain', 'Jacques', 'Henri'
  ];
  
  const FIRST_NAMES_FEMALE = [
    'Marie', 'Claire', 'Anne', 'Catherine', 'Françoise', 'Isabelle', 'Monique', 'Sylvie', 'Nathalie', 'Christine',
    'Patricia', 'Véronique', 'Sandrine', 'Caroline', 'Sophie', 'Julie', 'Céline', 'Valérie', 'Stéphanie', 'Nadine'
  ];
  
  const LAST_NAMES = [
    'Mukamana', 'Nkurunziza', 'Uwimana', 'Niyonsenga', 'Mukamunana', 'Nshimiyimana', 'Uwamahoro', 'Mukamana', 'Niyonsenga', 'Nkurunziza'
  ];
  
  const seed = parseInt(customerId) % 1000;
  const isMale = gender === 'Male';
  const firstNames = isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  
  const firstName = firstNames[seed % firstNames.length];
  const lastName = LAST_NAMES[seed % LAST_NAMES.length];
  
  return `${firstName} ${lastName}`;
}

// Convert CSV row to customer object
function csvRowToCustomer(row) {
  return {
    id: row.Customer_ID,
    name: generateCustomerName(row.Customer_ID, row.Gender),
    gender: row.Gender,
    age: parseInt(row.Age) || 0,
    location: row.Branch || 'Other',
    segment: row.Customer_Segment || 'Retail',
    accountBalance: parseFloat(row.Balance?.replace(/,/g, '') || 0),
    avgBalance: parseFloat(row.Average_Transaction_Value?.replace(/,/g, '') || 0),
    tenure: parseInt(row.Tenure_Months) || 0,
    productCount: parseInt(row.Num_Products) || 0,
    hasCreditCard: row.Has_Credit_Card === '1',
    accountStatus: row.Account_Status || 'Active',
    accountOpenDate: row.Account_Open_Date || new Date().toISOString().split('T')[0],
    lastTransaction: row.Last_Transaction_Date || new Date().toISOString().split('T')[0],
    transactionFrequency: parseInt(row.Transaction_Frequency) || 0,
    avgTransactionAmount: parseFloat(row.Average_Transaction_Value?.replace(/,/g, '') || 0),
    mobileBankingUsage: parseInt(row.Mobile_Banking_Usage) || 0,
    branchVisits: parseInt(row.Branch_Visits) || 0,
    complaintHistory: parseInt(row.Complaint_History) || 0,
    accountAgeMonths: parseInt(row.Account_Age_Months) || 0,
    daysSinceLastTransaction: parseInt(row.Days_Since_Last_Transaction) || 0,
    activityScore: parseFloat(row.Activity_Score) || 0,
    churnProbability: parseFloat(row.Churn_Probability) || 0,
    churnFlag: row.Churn_Flag === '1',
    branch: row.Branch || 'BR01',
    currency: row.Currency || 'RWF',
    nationality: row.Nationality || 'Rwandan',
    accountType: row.Account_Type || 'Current'
  };
}

// Get customer by ID from database or CSV
export async function getCustomerById(customerId) {
  if (useDatabase) {
    try {
      return await CustomerDatabase.getCustomerById(customerId);
    } catch (error) {
      console.error('Database error, falling back to CSV:', error);
      useDatabase = false;
    }
  }
  
  // Fallback to CSV
  const data = await loadCustomerData();
  const customer = data.find(row => row.Customer_ID === customerId);
  
  if (!customer) {
    return null;
  }
  
  return csvRowToCustomer(customer);
}

// Search customers by name or ID
export async function searchCustomers(query, limit = 10) {
  if (useDatabase) {
    try {
      return await CustomerDatabase.searchCustomers(query, limit);
    } catch (error) {
      console.error('Database error, falling back to CSV:', error);
      useDatabase = false;
    }
  }
  
  // Fallback to CSV
  const data = await loadCustomerData();
  const searchTerm = query.toLowerCase();
  const results = [];
  
  for (const row of data) {
    if (results.length >= limit) break;
    
    const customer = csvRowToCustomer(row);
    if (customer.name.toLowerCase().includes(searchTerm) || 
        customer.id.toLowerCase().includes(searchTerm)) {
      results.push(customer);
    }
  }
  
  return results;
}

// Get customers by segment
export async function getCustomersBySegment(segment, limit = 50) {
  if (useDatabase) {
    try {
      return await CustomerDatabase.getCustomersBySegment(segment, limit);
    } catch (error) {
      console.error('Database error, falling back to CSV:', error);
      useDatabase = false;
    }
  }
  
  // Fallback to CSV
  const data = await loadCustomerData();
  const results = [];
  
  for (const row of data) {
    if (results.length >= limit) break;
    
    if (row.Customer_Segment === segment) {
      results.push(csvRowToCustomer(row));
    }
  }
  
  return results;
}

// Get high-risk customers
export async function getHighRiskCustomers(limit = 20) {
  if (useDatabase) {
    try {
      return await CustomerDatabase.getHighRiskCustomers(limit);
    } catch (error) {
      console.error('Database error, falling back to CSV:', error);
      useDatabase = false;
    }
  }
  
  // Fallback to CSV
  const data = await loadCustomerData();
  const results = [];
  
  // Sort by churn probability descending
  const sortedData = data
    .filter(row => parseFloat(row.Churn_Probability) > 0.6)
    .sort((a, b) => parseFloat(b.Churn_Probability) - parseFloat(a.Churn_Probability));
  
  for (const row of sortedData.slice(0, limit)) {
    results.push(csvRowToCustomer(row));
  }
  
  return results;
}

// Get customer statistics
export async function getCustomerStats() {
  if (useDatabase) {
    try {
      return await CustomerDatabase.getCustomerStats();
    } catch (error) {
      console.error('Database error, falling back to CSV:', error);
      useDatabase = false;
    }
  }
  
  // Fallback to CSV
  const data = await loadCustomerData();
  
  const stats = {
    total: data.length,
    bySegment: {},
    byRisk: {
      high: 0,
      medium: 0,
      low: 0
    },
    averageChurnProbability: 0,
    totalBalance: 0
  };
  
  let totalChurnProb = 0;
  let totalBalance = 0;
  
  data.forEach(row => {
    // By segment
    const segment = row.Customer_Segment || 'Unknown';
    stats.bySegment[segment] = (stats.bySegment[segment] || 0) + 1;
    
    // By risk level
    const churnProb = parseFloat(row.Churn_Probability) || 0;
    totalChurnProb += churnProb;
    
    if (churnProb >= 0.7) stats.byRisk.high++;
    else if (churnProb >= 0.4) stats.byRisk.medium++;
    else stats.byRisk.low++;
    
    // Total balance
    const balance = parseFloat(row.Balance?.replace(/,/g, '') || 0);
    totalBalance += balance;
  });
  
  stats.averageChurnProbability = totalChurnProb / data.length;
  stats.totalBalance = totalBalance;
  
  return stats;
}
