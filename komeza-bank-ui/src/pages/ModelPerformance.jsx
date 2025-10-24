import React from 'react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const ModelPerformance = () => {
  const { isCollapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="bg-primary-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Model Performance</h1>
            <p className="text-white/80 mt-1">Churn prediction model health and accuracy</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Model Performance</Card.Title>
              <Card.Description>Churn model performance metrics</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600">Model performance monitoring will be implemented here.</p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModelPerformance;
