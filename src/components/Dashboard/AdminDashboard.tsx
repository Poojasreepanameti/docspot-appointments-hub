
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for pending doctor approvals
  const pendingDoctors = [
    {
      id: 1,
      name: 'Dr. Jennifer Wilson',
      specialization: 'Pediatrics',
      location: 'New York, NY',
      licenseNumber: 'NY123456',
      submittedDate: '2024-01-10'
    },
    {
      id: 2,
      name: 'Dr. Robert Martinez',
      specialization: 'Orthopedics',
      location: 'Los Angeles, CA',
      licenseNumber: 'CA789012',
      submittedDate: '2024-01-12'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage the DocSpot platform and monitor activity</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <AlertCircle className="mr-2 h-4 w-4" />
          System Status
        </Button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              {pendingDoctors.length} pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,472</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDoctors.length}</div>
            <p className="text-xs text-muted-foreground">
              Doctor registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Doctor Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Doctor Approvals</CardTitle>
          <CardDescription>
            Review and approve new doctor registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingDoctors.length > 0 ? (
            <div className="space-y-4">
              {pendingDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization} • {doctor.location}</p>
                      <p className="text-sm text-gray-500">
                        License: {doctor.licenseNumber} • Submitted: {doctor.submittedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      Reject
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
              <p className="mt-1 text-sm text-gray-500">
                All doctor registrations have been reviewed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-gray-600 text-center">Manage all platform users</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <UserCheck className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Doctor Approvals</h3>
            <p className="text-sm text-gray-600 text-center">Review doctor registrations</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Appointment Monitor</h3>
            <p className="text-sm text-gray-600 text-center">Monitor all appointments</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <AlertCircle className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="font-semibold">Reports & Analytics</h3>
            <p className="text-sm text-gray-600 text-center">Platform insights and reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
