
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Search, History, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userAppointments, setUserAppointments] = useState<any[]>([]);

  // Load user appointments from localStorage
  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
    setUserAppointments(savedAppointments);
  }, []);

  // Filter upcoming appointments
  const upcomingAppointments = userAppointments.filter(apt => 
    apt.status === 'Confirmed' || apt.status === 'Pending'
  );

  const quickActions = [
    {
      title: 'Find Doctors',
      description: 'Browse and book appointments',
      icon: Search,
      color: 'text-blue-600',
      path: '/find-doctors'
    },
    {
      title: 'My Appointments',
      description: 'View and manage appointments',
      icon: Calendar,
      color: 'text-green-600',
      path: '/appointments'
    },
    {
      title: 'Medical History',
      description: 'Access your records',
      icon: History,
      color: 'text-purple-600',
      path: '/medical-history'
    },
    {
      title: 'Profile Settings',
      description: 'Update your information',
      icon: Settings,
      color: 'text-orange-600',
      path: '/profile'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Manage your appointments and health records</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/find-doctors')}
        >
          <Search className="mr-2 h-4 w-4" />
          Find Doctors
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length > 0 ? `Next appointment soon` : 'No upcoming appointments'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAppointments.length + 2}</div>
            <p className="text-xs text-muted-foreground">
              Since joining DocSpot
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Doctors</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Doctors you've visited multiple times
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled appointments with doctors
              </CardDescription>
            </div>
            <Button 
              variant="outline"
              onClick={() => navigate('/appointments')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.doctorSpecialization}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by booking your first appointment.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/find-doctors')}>
                  <Search className="mr-2 h-4 w-4" />
                  Browse Doctors
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card 
            key={action.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(action.path)}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <action.icon className={`h-8 w-8 ${action.color} mb-2`} />
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm text-gray-600 text-center">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PatientDashboard;
