// Customer lookup service for CSV data with generated names

// Rwandan name pools for realistic generation
const FIRST_NAMES_MALE = [
  'Jean', 'Pierre', 'Paul', 'François', 'Joseph', 'Antoine', 'Charles', 'Louis', 'Michel', 'Philippe',
  'David', 'Daniel', 'André', 'Robert', 'Marc', 'Claude', 'Bernard', 'Alain', 'Jacques', 'Henri',
  'Thierry', 'Nicolas', 'Olivier', 'Laurent', 'Sébastien', 'Vincent', 'Christophe', 'Julien', 'Romain', 'Fabien'
];

const FIRST_NAMES_FEMALE = [
  'Marie', 'Claire', 'Anne', 'Catherine', 'Françoise', 'Isabelle', 'Monique', 'Sylvie', 'Nathalie', 'Christine',
  'Patricia', 'Véronique', 'Sandrine', 'Caroline', 'Sophie', 'Julie', 'Céline', 'Valérie', 'Stéphanie', 'Nadine',
  'Chantal', 'Brigitte', 'Martine', 'Nicole', 'Dominique', 'Hélène', 'Pascale', 'Corinne', 'Éliane', 'Fabienne'
];

const LAST_NAMES = [
  'Mukamana', 'Nkurunziza', 'Uwimana', 'Niyonsenga', 'Mukamunana', 'Nshimiyimana', 'Nkurunziza', 'Uwamahoro', 'Mukamana', 'Niyonsenga',
  'Nkurunziza', 'Uwimana', 'Mukamunana', 'Nshimiyimana', 'Nkurunziza', 'Uwamahoro', 'Mukamana', 'Niyonsenga', 'Nkurunziza', 'Uwimana',
  'Mukamunana', 'Nshimiyimana', 'Nkurunziza', 'Uwamahoro', 'Mukamana', 'Niyonsenga', 'Nkurunziza', 'Uwimana', 'Mukamunana', 'Nshimiyimana'
];

// Generate consistent name based on Customer_ID
function generateName(customerId, gender) {
  const seed = parseInt(customerId) % 1000;
  const isMale = gender === 'Male';
  const firstNames = isMale ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  
  const firstName = firstNames[seed % firstNames.length];
  const lastName = LAST_NAMES[seed % LAST_NAMES.length];
  
  return `${firstName} ${lastName}`;
}

// Mock customer data generator (in production, this would fetch from your database)
export function getCustomerById(customerId) {
  // This is a mock implementation - in production, you'd fetch from your database
  // For now, we'll generate realistic data based on the customer ID
  
  const seed = parseInt(customerId) % 1000;
  const isMale = seed % 2 === 0;
  const gender = isMale ? 'Male' : 'Female';
  
  return {
    id: customerId,
    name: generateName(customerId, gender),
    gender: gender,
    age: 25 + (seed % 50),
    location: ['Kigali', 'Musanze', 'Huye', 'Rubavu'][seed % 4],
    segment: ['Gold', 'Silver', 'Bronze', 'High Risk'][seed % 4],
    accountBalance: 100000 + (seed * 10000),
    avgBalance: 50000 + (seed * 5000),
    balanceHistory: Array.from({length: 6}, (_, i) => ({
      balance: 100000 + (seed * 10000) + (i * 5000)
    })),
    transactions: Array.from({length: Math.max(1, seed % 20)}, (_, i) => ({
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
      amount: 10000 + (seed * 1000),
      category: ['Transfer', 'Payment', 'Withdrawal', 'Deposit'][i % 4]
    })),
    lastTransaction: new Date(Date.now() - (seed % 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    products: ['Savings', 'Current Account', 'Credit Card'].slice(0, 1 + (seed % 3)),
    digitalUsage: {
      mobileApp: seed % 3 === 0 ? 0 : Math.floor(seed / 10),
      onlineBanking: seed % 4 === 0 ? 0 : Math.floor(seed / 15),
      atmUsage: Math.floor(seed / 20),
      cardUsage: Math.floor(seed / 25)
    },
    creditAccounts: seed % 3 === 0 ? [] : [{
      balance: 50000 + (seed * 5000),
      limit: 200000 + (seed * 10000)
    }],
    loginHistory: Array.from({length: Math.max(1, seed % 15)}, (_, i) => ({
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
    })),
    supportInteractions: Array.from({length: seed % 5}, (_, i) => ({
      date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      type: 'Support'
    })),
    complaintsDetails: Array.from({length: seed % 3}, (_, i) => ({
      date: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      type: 'Complaint'
    })),
    paymentHistory: Array.from({length: seed % 10}, (_, i) => ({
      date: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString(),
      daysLate: i % 3 === 0 ? Math.floor(seed / 100) : 0
    })),
    creditScore: 600 + (seed % 200),
    incomeHistory: Array.from({length: 6}, (_, i) => ({
      amount: 500000 + (seed * 10000) + (i * 10000)
    })),
    channelUsage: {
      branch: Math.floor(seed / 20),
      mobile: Math.floor(seed / 10),
      online: Math.floor(seed / 15),
      atm: Math.floor(seed / 25),
      phone: Math.floor(seed / 30)
    },
    activityPatterns: Array.from({length: 7}, (_, i) => ({
      hour: 9 + (i * 2),
      activity: Math.floor(seed / 10)
    })),
    historicalData: Array.from({length: 12}, (_, i) => ({
      month: i,
      activity: Math.floor(seed / 15)
    })),
    region: ['Kigali', 'Musanze', 'Huye', 'Rubavu'][seed % 4],
    branch: ['BR01', 'BR02', 'BR03', 'BR04'][seed % 4],
    accountOpenDate: new Date(Date.now() - (seed * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  };
}

// Search customers by name or ID
export function searchCustomers(query, limit = 10) {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  // Generate a few sample customers for search
  for (let i = 0; i < limit; i++) {
    const customerId = `C${1000 + i}`;
    const customer = getCustomerById(customerId);
    
    if (customer.name.toLowerCase().includes(searchTerm) || 
        customer.id.toLowerCase().includes(searchTerm)) {
      results.push(customer);
    }
  }
  
  return results;
}
