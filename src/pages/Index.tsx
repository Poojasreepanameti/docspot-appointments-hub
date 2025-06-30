
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to dashboard which will handle authentication routing
  return <Navigate to="/dashboard" replace />;
};

export default Index;
