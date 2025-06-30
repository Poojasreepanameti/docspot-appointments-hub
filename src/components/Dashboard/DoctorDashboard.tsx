
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, FileText, Phone, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DoctorScheduleManager from '@/components/Doctor/DoctorScheduleManager';
import PatientRecords from '@/components/Doctor/PatientRecords';
import VisitSummaryManager from '@/components/Doctor/VisitSummaryManager';

interface DoctorAppointment {
  id: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  date: string;
  time: string;
  type: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  notes?: string;
  consultationFee: number;
}

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedView, setSelectedView] = useState<'dashboard' | 'schedule' | 'patients' | 'summaries'>('dashboard');
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);

  // Load doctor's appointments from localStorage
  useEffect(() => {
    const loadDoctorAppointments = () => {
      // For demo purposes, we'll create some mock appointments for the doctor
      // In a real app, this would filter appointments by doctor ID
      const mockAppointments: DoctorAppointment[] = [
        {
          id: '1',
          patientName: 'John Smith',
          patientPhone: '+1-555-0123',
          patientEmail: 'john.smith@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '9:00 AM',
          type: 'Regular Consultation',
          status: 'Confirmed',
          notes: 'Follow-up for chest pain evaluation',
          consultationFee: 200
        },
        {
          id: '2',
          patientName: 'Emily Davis',
          patientPhone: '+1-555-0124',
          patientEmail: 'emily.davis@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '10:30 AM',
          type: 'Follow-up',
          status: 'Pending',
          notes: 'Blood pressure check',
          consultationFee: 150
        },
        {
          id: '3',
          patientName: 'Michael Brown',
          patientPhone: '+1-555-0125',
          patientEmail: 'michael.brown@email.com',
          date: new Date().toISOString().split('T')[0],
          time: '2:00 PM',
          type: 'Check-up',
          status: 'Confirmed',
          notes: 'Annual physical examination',
          consultationFee: 175
        }
      ];

      setAppointments(mockAppointments);
    };

    loadDoctorAppointments();
  }, []);

  const todaysAppointments = appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const pendingAppointments = appointments.filter(apt => apt.status === 'Pending');

  const handleConfirmAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Confirmed' as const } : apt
    ));
    toast({
      title: "Appointment Confirmed",
      description: "The appointment has been confirmed successfully.",
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Cancelled' as const } : apt
    ));
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been cancelled.",
    });
  };

  const handleCompleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Completed' as const } : apt
    ));
    toast({
      title: "Visit Completed",
      description: "The appointment has been marked as completed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedView !== 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedView('dashboard')}
          >
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">
            {selectedView === 'schedule' && 'Schedule Management'}
            {selectedView === 'patients' && 'Patient Records'}
            {selectedView === 'summaries' && 'Visit Summaries'}
          </h1>
        </div>
        
        {selectedView === 'schedule' && <DoctorScheduleManager />}
        {selectedView === 'patients' && <PatientRecords />}
        {selectedView === 'summaries' && <VisitSummaryManager />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Good morning, Dr. {user?.name?.split(' ').pop()}!</h1>
          <p className="text-gray-600">You have {todaysAppointments.length} appointments today</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setSelectedView('summaries')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Visit Summaries
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setSelectedView('schedule')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Manage Schedule
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todaysAppointments.filter(apt => apt.status === 'Confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              Require your approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              Unique patients served
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              Average patient rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Requests & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Appointment Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Requests</CardTitle>
            <CardDescription>
              Pending appointments requiring your approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">
                          {appointment.date} at {appointment.time}
                        </p>
                        {appointment.notes && (
                          <p className="text-xs text-gray-500 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleConfirmAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No pending appointment requests</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Your appointments for today, {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.length > 0 ? (
                todaysAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {appointment.patientName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{appointment.patientName}</h3>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                        <p className="text-sm text-gray-500">{appointment.time}</p>
                        {appointment.patientPhone && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {appointment.patientPhone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.status === 'Confirmed' && (
                        <Button 
                          size="sm"
                          onClick={() => handleCompleteAppointment(appointment.id)}
                        >
                          Complete Visit
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedView('schedule')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">Schedule Management</h3>
            <p className="text-sm text-gray-600 text-center">Set availability and time slots</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedView('patients')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <User className="h-8 w-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Patient Records</h3>
            <p className="text-sm text-gray-600 text-center">Access patient information</p>
          </CardContent>
        </Card>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedView('summaries')}
        >
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Visit Summaries</h3>
            <p className="text-sm text-gray-600 text-center">Create and manage summaries</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Clock className="h-8 w-8 text-orange-600 mb-2" />
            <h3 className="font-semibold">Reports & Analytics</h3>
            <p className="text-sm text-gray-600 text-center">View practice analytics</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
