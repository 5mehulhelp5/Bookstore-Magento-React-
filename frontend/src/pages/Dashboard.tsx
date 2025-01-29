import React from 'react';
import Layout from '../components/Layout/Layout';
import OrderHistory from '../components/Dashboard/OrderHistory';

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <OrderHistory />
      </div>
    </Layout>
  );
};

export default Dashboard;
