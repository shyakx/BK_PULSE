// Churn Prediction Model Service
// This service handles model training, prediction, and feature engineering

export class ChurnModelService {
  constructor() {
    this.modelVersion = '1.0.0';
    this.featureStore = new Map();
    this.model = null;
    this.isTrained = false;
  }

  // Feature Engineering Methods
  static createFeatureSet(customerData) {
    const features = {
      // Demographics
      age: customerData.age || 0,
      gender: customerData.gender === 'M' ? 1 : 0,
      location: this.encodeLocation(customerData.location),
      
      // Account Features
      accountAge: this.calculateAccountAge(customerData.accountOpenDate),
      totalBalance: customerData.totalBalance || 0,
      avgBalance: customerData.avgBalance || 0,
      balanceVolatility: this.calculateBalanceVolatility(customerData.balanceHistory),
      
      // Transaction Patterns
      transactionFrequency: this.calculateTransactionFrequency(customerData.transactions),
      avgTransactionAmount: this.calculateAvgTransactionAmount(customerData.transactions),
      transactionDiversity: this.calculateTransactionDiversity(customerData.transactions),
      lastTransactionDays: this.calculateDaysSinceLastTransaction(customerData.lastTransactionDate),
      
      // Product Usage
      productCount: customerData.products?.length || 0,
      digitalAdoption: this.calculateDigitalAdoption(customerData.digitalUsage),
      creditUtilization: this.calculateCreditUtilization(customerData.creditAccounts),
      
      // Engagement Metrics
      loginFrequency: this.calculateLoginFrequency(customerData.loginHistory),
      supportInteractions: customerData.supportInteractions?.length || 0,
      complaintCount: customerData.complaints?.length || 0,
      
      // Risk Indicators
      paymentDelays: this.calculatePaymentDelays(customerData.paymentHistory),
      creditScore: customerData.creditScore || 0,
      incomeStability: this.calculateIncomeStability(customerData.incomeHistory),
      
      // Behavioral Patterns
      channelPreference: this.encodeChannelPreference(customerData.channelUsage),
      timeOfDayActivity: this.calculateTimeOfDayActivity(customerData.activityPatterns),
      seasonalBehavior: this.calculateSeasonalBehavior(customerData.historicalData),
      
      // External Factors
      economicIndicators: this.getEconomicIndicators(customerData.region),
      marketConditions: this.getMarketConditions(customerData.segment)
    };

    return features;
  }

  // Feature Engineering Helper Methods
  static encodeLocation(location) {
    const locationMap = {
      'Kigali': 1,
      'Musanze': 2,
      'Huye': 3,
      'Rubavu': 4,
      'Other': 0
    };
    return locationMap[location] || 0;
  }

  static calculateAccountAge(openDate) {
    if (!openDate) return 0;
    const now = new Date();
    const open = new Date(openDate);
    return Math.floor((now - open) / (1000 * 60 * 60 * 24 * 365)); // Years
  }

  static calculateBalanceVolatility(balanceHistory) {
    if (!balanceHistory || balanceHistory.length < 2) return 0;
    const balances = balanceHistory.map(b => b.balance);
    const mean = balances.reduce((a, b) => a + b, 0) / balances.length;
    const variance = balances.reduce((sum, balance) => sum + Math.pow(balance - mean, 2), 0) / balances.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  static calculateTransactionFrequency(transactions) {
    if (!transactions || transactions.length === 0) return 0;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentTransactions = transactions.filter(t => new Date(t.date) >= thirtyDaysAgo);
    return recentTransactions.length;
  }

  static calculateAvgTransactionAmount(transactions) {
    if (!transactions || transactions.length === 0) return 0;
    const amounts = transactions.map(t => Math.abs(t.amount));
    return amounts.reduce((a, b) => a + b, 0) / amounts.length;
  }

  static calculateTransactionDiversity(transactions) {
    if (!transactions || transactions.length === 0) return 0;
    const categories = new Set(transactions.map(t => t.category));
    return categories.size;
  }

  static calculateDaysSinceLastTransaction(lastTransactionDate) {
    if (!lastTransactionDate) return 999; // High value for no transactions
    const now = new Date();
    const last = new Date(lastTransactionDate);
    return Math.floor((now - last) / (1000 * 60 * 60 * 24));
  }

  static calculateDigitalAdoption(digitalUsage) {
    if (!digitalUsage) return 0;
    const features = ['mobileApp', 'onlineBanking', 'atmUsage', 'cardUsage'];
    const usedFeatures = features.filter(f => digitalUsage[f] > 0).length;
    return usedFeatures / features.length;
  }

  static calculateCreditUtilization(creditAccounts) {
    if (!creditAccounts || creditAccounts.length === 0) return 0;
    let totalUtilization = 0;
    creditAccounts.forEach(account => {
      const utilization = account.balance / account.limit;
      totalUtilization += utilization;
    });
    return totalUtilization / creditAccounts.length;
  }

  static calculateLoginFrequency(loginHistory) {
    if (!loginHistory || loginHistory.length === 0) return 0;
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const recentLogins = loginHistory.filter(l => new Date(l.date) >= thirtyDaysAgo);
    return recentLogins.length;
  }

  static calculatePaymentDelays(paymentHistory) {
    if (!paymentHistory || paymentHistory.length === 0) return 0;
    const delayedPayments = paymentHistory.filter(p => p.daysLate > 0);
    return delayedPayments.length;
  }

  static calculateIncomeStability(incomeHistory) {
    if (!incomeHistory || incomeHistory.length < 2) return 0;
    const incomes = incomeHistory.map(i => i.amount);
    const mean = incomes.reduce((a, b) => a + b, 0) / incomes.length;
    const variance = incomes.reduce((sum, income) => sum + Math.pow(income - mean, 2), 0) / incomes.length;
    return 1 - (Math.sqrt(variance) / mean); // Stability score (0-1)
  }

  static encodeChannelPreference(channelUsage) {
    if (!channelUsage) return 0;
    const channels = ['branch', 'mobile', 'online', 'atm', 'phone'];
    const maxChannel = channels.reduce((max, channel) => 
      channelUsage[channel] > channelUsage[max] ? channel : max
    );
    return channels.indexOf(maxChannel);
  }

  static calculateTimeOfDayActivity(activityPatterns) {
    if (!activityPatterns) return 0;
    const peakHours = activityPatterns.filter(p => p.hour >= 9 && p.hour <= 17).length;
    const totalActivity = activityPatterns.length;
    return totalActivity > 0 ? peakHours / totalActivity : 0;
  }

  static calculateSeasonalBehavior(historicalData) {
    if (!historicalData) return 0;
    const currentMonth = new Date().getMonth();
    const seasonalData = historicalData.filter(d => d.month === currentMonth);
    return seasonalData.length;
  }

  static getEconomicIndicators(region) {
    // Mock economic indicators - in production, this would come from external APIs
    const indicators = {
      'Kigali': { gdp: 1.2, inflation: 0.8, unemployment: 0.6 },
      'Musanze': { gdp: 0.9, inflation: 1.1, unemployment: 0.8 },
      'Huye': { gdp: 0.8, inflation: 1.2, unemployment: 0.9 },
      'Other': { gdp: 0.7, inflation: 1.5, unemployment: 1.1 }
    };
    return indicators[region] || indicators['Other'];
  }

  static getMarketConditions(segment) {
    // Mock market conditions based on customer segment
    const conditions = {
      'Gold': { marketGrowth: 1.3, competition: 0.7, stability: 0.9 },
      'Silver': { marketGrowth: 1.1, competition: 0.8, stability: 0.8 },
      'Bronze': { marketGrowth: 0.9, competition: 1.0, stability: 0.7 },
      'High Risk': { marketGrowth: 0.6, competition: 1.3, stability: 0.5 }
    };
    return conditions[segment] || conditions['Bronze'];
  }

  // Model Training Methods
  async trainModel(trainingData) {
    try {
      console.log('Starting model training...');
      
      // Feature engineering for training data
      const features = trainingData.map(customer => ({
        features: ChurnModelService.createFeatureSet(customer),
        label: customer.churned ? 1 : 0
      }));

      // Split data into training and validation sets
      const splitIndex = Math.floor(features.length * 0.8);
      const trainingSet = features.slice(0, splitIndex);
      const validationSet = features.slice(splitIndex);

      // Train model (in production, this would use a proper ML library)
      const model = await this.trainRandomForest(trainingSet);
      
      // Validate model
      const validationResults = await this.validateModel(model, validationSet);
      
      this.model = model;
      this.isTrained = true;
      
      console.log('Model training completed:', validationResults);
      return {
        success: true,
        modelVersion: this.modelVersion,
        accuracy: validationResults.accuracy,
        precision: validationResults.precision,
        recall: validationResults.recall,
        f1Score: validationResults.f1Score
      };
    } catch (error) {
      console.error('Model training failed:', error);
      return { success: false, error: error.message };
    }
  }

  async trainRandomForest(trainingData) {
    // Simplified Random Forest implementation
    // In production, use libraries like TensorFlow.js, ML5.js, or scikit-learn
    const trees = [];
    const numTrees = 100;
    
    for (let i = 0; i < numTrees; i++) {
      const bootstrapSample = this.bootstrapSample(trainingData);
      const tree = this.buildDecisionTree(bootstrapSample);
      trees.push(tree);
    }
    
    return { trees, featureImportance: this.calculateFeatureImportance(trees) };
  }

  bootstrapSample(data) {
    const sample = [];
    for (let i = 0; i < data.length; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      sample.push(data[randomIndex]);
    }
    return sample;
  }

  buildDecisionTree(data) {
    // Simplified decision tree implementation
    const features = Object.keys(data[0].features);
    const bestSplit = this.findBestSplit(data, features);
    
    if (bestSplit.gain < 0.01 || data.length < 10) {
      return { leaf: true, prediction: this.majorityClass(data) };
    }
    
    const leftData = data.filter(d => d.features[bestSplit.feature] <= bestSplit.threshold);
    const rightData = data.filter(d => d.features[bestSplit.feature] > bestSplit.threshold);
    
    return {
      leaf: false,
      feature: bestSplit.feature,
      threshold: bestSplit.threshold,
      left: this.buildDecisionTree(leftData),
      right: this.buildDecisionTree(rightData)
    };
  }

  findBestSplit(data, features) {
    let bestGain = 0;
    let bestFeature = features[0];
    let bestThreshold = 0;
    
    features.forEach(feature => {
      const values = data.map(d => d.features[feature]).sort((a, b) => a - b);
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        const gain = this.calculateInformationGain(data, feature, threshold);
        if (gain > bestGain) {
          bestGain = gain;
          bestFeature = feature;
          bestThreshold = threshold;
        }
      }
    });
    
    return { feature: bestFeature, threshold: bestThreshold, gain: bestGain };
  }

  calculateInformationGain(data, feature, threshold) {
    const leftData = data.filter(d => d.features[feature] <= threshold);
    const rightData = data.filter(d => d.features[feature] > threshold);
    
    const parentEntropy = this.calculateEntropy(data);
    const leftEntropy = this.calculateEntropy(leftData);
    const rightEntropy = this.calculateEntropy(rightData);
    
    const leftWeight = leftData.length / data.length;
    const rightWeight = rightData.length / data.length;
    
    return parentEntropy - (leftWeight * leftEntropy + rightWeight * rightEntropy);
  }

  calculateEntropy(data) {
    if (data.length === 0) return 0;
    const positive = data.filter(d => d.label === 1).length;
    const negative = data.length - positive;
    
    if (positive === 0 || negative === 0) return 0;
    
    const pPositive = positive / data.length;
    const pNegative = negative / data.length;
    
    return -(pPositive * Math.log2(pPositive) + pNegative * Math.log2(pNegative));
  }

  majorityClass(data) {
    const positive = data.filter(d => d.label === 1).length;
    return positive > data.length / 2 ? 1 : 0;
  }

  calculateFeatureImportance(trees) {
    const importance = {};
    trees.forEach(tree => {
      this.traverseTree(tree, (node) => {
        if (!node.leaf) {
          importance[node.feature] = (importance[node.feature] || 0) + 1;
        }
      });
    });
    
    // Normalize importance scores
    const total = Object.values(importance).reduce((a, b) => a + b, 0);
    Object.keys(importance).forEach(feature => {
      importance[feature] = importance[feature] / total;
    });
    
    return importance;
  }

  traverseTree(node, callback) {
    callback(node);
    if (!node.leaf) {
      this.traverseTree(node.left, callback);
      this.traverseTree(node.right, callback);
    }
  }

  // Prediction Methods
  async predictChurn(customerData) {
    if (!this.isTrained) {
      throw new Error('Model not trained yet');
    }
    
    const features = ChurnModelService.createFeatureSet(customerData);
    const prediction = this.predictWithRandomForest(features);
    const confidence = this.calculateConfidence(features);
    
    return {
      churnProbability: prediction,
      confidence: confidence,
      riskLevel: this.categorizeRisk(prediction),
      keyFactors: this.identifyKeyFactors(features)
    };
  }

  predictWithRandomForest(features) {
    const predictions = this.model.trees.map(tree => 
      this.predictWithTree(tree, features)
    );
    
    const avgPrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;
    return avgPrediction;
  }

  predictWithTree(tree, features) {
    if (tree.leaf) {
      return tree.prediction;
    }
    
    if (features[tree.feature] <= tree.threshold) {
      return this.predictWithTree(tree.left, features);
    } else {
      return this.predictWithTree(tree.right, features);
    }
  }

  calculateConfidence(features) {
    // Simplified confidence calculation
    const featureCount = Object.keys(features).length;
    const nonZeroFeatures = Object.values(features).filter(v => v > 0).length;
    return nonZeroFeatures / featureCount;
  }

  categorizeRisk(probability) {
    if (probability >= 0.8) return 'Critical';
    if (probability >= 0.6) return 'High';
    if (probability >= 0.4) return 'Medium';
    if (probability >= 0.2) return 'Low';
    return 'Very Low';
  }

  identifyKeyFactors(features) {
    const factors = [];
    
    if (features.lastTransactionDays > 30) {
      factors.push('No recent transactions');
    }
    if (features.balanceVolatility > 0.5) {
      factors.push('High balance volatility');
    }
    if (features.paymentDelays > 2) {
      factors.push('Multiple payment delays');
    }
    if (features.digitalAdoption < 0.3) {
      factors.push('Low digital engagement');
    }
    if (features.supportInteractions > 3) {
      factors.push('Frequent support interactions');
    }
    
    return factors;
  }

  // Model Validation
  async validateModel(model, validationData) {
    let correct = 0;
    let total = validationData.length;
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    
    validationData.forEach(data => {
      const prediction = this.predictWithRandomForest(data.features);
      const predictedClass = prediction > 0.5 ? 1 : 0;
      const actualClass = data.label;
      
      if (predictedClass === actualClass) {
        correct++;
      }
      
      if (predictedClass === 1 && actualClass === 1) truePositives++;
      if (predictedClass === 1 && actualClass === 0) falsePositives++;
      if (predictedClass === 0 && actualClass === 1) falseNegatives++;
    });
    
    const accuracy = correct / total;
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    
    return { accuracy, precision, recall, f1Score };
  }

  // Model Monitoring
  async monitorModelPerformance(predictions, actuals) {
    const performance = {
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      drift: 0
    };
    
    // Calculate performance metrics
    let correct = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    
    predictions.forEach((pred, index) => {
      const actual = actuals[index];
      const predictedClass = pred > 0.5 ? 1 : 0;
      
      if (predictedClass === actual) correct++;
      if (predictedClass === 1 && actual === 1) truePositives++;
      if (predictedClass === 1 && actual === 0) falsePositives++;
      if (predictedClass === 0 && actual === 1) falseNegatives++;
    });
    
    performance.accuracy = correct / predictions.length;
    performance.precision = truePositives / (truePositives + falsePositives) || 0;
    performance.recall = truePositives / (truePositives + falseNegatives) || 0;
    performance.f1Score = 2 * (performance.precision * performance.recall) / 
      (performance.precision + performance.recall) || 0;
    
    // Calculate drift (simplified)
    const avgPrediction = predictions.reduce((a, b) => a + b, 0) / predictions.length;
    performance.drift = Math.abs(avgPrediction - 0.5); // Distance from baseline
    
    return performance;
  }

  // Model Retraining
  async retrainModel(newData, performanceThreshold = 0.8) {
    const currentPerformance = await this.monitorModelPerformance(
      newData.predictions, 
      newData.actuals
    );
    
    if (currentPerformance.accuracy < performanceThreshold) {
      console.log('Model performance below threshold, retraining...');
      return await this.trainModel(newData.trainingData);
    }
    
    return { success: false, reason: 'Performance still acceptable' };
  }
}

// Export singleton instance
export const churnModelService = new ChurnModelService();
