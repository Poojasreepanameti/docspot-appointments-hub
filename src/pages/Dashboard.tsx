
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import PatientDashboard from '@/components/Dashboard/PatientDashboard';
import DoctorDashboard from '@/components/Dashboard/DoctorDashboard';
import AdminDashboard from '@/components/Dashboard/AdminDashboard';
import Navbar from '@/components/Layout/Navbar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    if (!user) return null;

    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
