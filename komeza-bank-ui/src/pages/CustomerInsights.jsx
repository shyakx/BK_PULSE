import React from 'react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar.jsx';
import { useSidebar } from '../components/LayoutWrapper.jsx';

const CustomerInsights = () => {
  const { isCollapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="bg-primary-600 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold">Customer Insights</h1>
            <p className="text-white/80 mt-1">Analytics and customer behavior insights</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card variant="default" shadow="medium">
            <Card.Header>
              <Card.Title>Customer Insights</Card.Title>
              <Card.Description>Customer analytics and insights</Card.Description>
            </Card.Header>
            <Card.Content>
              <p className="text-gray-600">Customer insights functionality will be implemented here.</p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerInsights;
