import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, FileText, Phone } from 'lucide-react';
import AppointmentDetails from '@/components/AppointmentDetails';
import RescheduleAppointment from '@/components/RescheduleAppointment';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  location: string;
  consultationFee: number;
  notes?: string;
  visitSummary?: string;
  type?: string;
}

const MyAppointments: React.FC = () => {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const loadAppointments = () => {
      const savedAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
      
      // Mock appointments for demo (will be replaced by real saved appointments)
      const mockAppointments = [
        {
          id: 'mock-1',
          doctorName: 'Dr. Emily Rodriguez',
          doctorSpecialization: 'Pediatrics',
          date: '2023-12-10',
          time: '11:00 AM',
          status: 'Completed' as const,
          location: 'Children\'s Hospital, Chicago',
          consultationFee: 175,
          visitSummary: 'Regular checkup completed. Patient is healthy. Next visit in 6 months.'
        },
        {
          id: 'mock-2',
          doctorName: 'Dr. James Wilson',
          doctorSpecialization: 'Orthopedics',
          date: '2023-11-25',
          time: '3:00 PM',
          status: 'Cancelled' as const,
          location: 'Orthopedic Center, Houston',
          consultationFee: 220,
          notes: 'Knee pain consultation - rescheduled by patient'
        }
      ];

      // Combine saved appointments with mock data
      const allAppointments = [...savedAppointments, ...mockAppointments];
      setAppointments(allAppointments);
    };

    loadAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'Confirmed' || apt.status === 'Pending'
  );

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'Completed' || apt.status === 'Cancelled'
  );

  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: 'Cancelled' as const } : apt
    );
    setAppointments(updatedAppointments);
    
    // Update localStorage
    const savedAppointments = updatedAppointments.filter(apt => !apt.id.startsWith('mock-'));
    localStorage.setItem('userAppointments', JSON.stringify(savedAppointments));
    
    setSelectedAppointment(null);
    toast({
      title: "Appointment Cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setRescheduleAppointment(appointment);
    }
  };

  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, date: newDate, time: newTime, status: 'Pending' as const }
        : apt
    );
    setAppointments(updatedAppointments);
    
    // Update localStorage
    const savedAppointments = updatedAppointments.filter(apt => !apt.id.startsWith('mock-'));
    localStorage.setItem('userAppointments', JSON.stringify(savedAppointments));
    
    setRescheduleAppointment(null);
    toast({
      title: "Appointment Rescheduled",
      description: `Your appointment has been rescheduled to ${new Date(newDate).toLocaleDateString()} at ${newTime}.`,
    });
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const AppointmentCard: React.FC<{ appointment: Appointment; showActions?: boolean }> = ({ 
    appointment, 
    showActions = false 
  }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {appointment.doctorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{appointment.doctorName}</CardTitle>
              <CardDescription>{appointment.doctorSpecialization}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(appointment.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              {appointment.time}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              {appointment.location}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Fee:</span> ${appointment.consultationFee}
            </div>
            {appointment.type && (
              <div className="text-sm">
                <span className="font-medium">Type:</span> {appointment.type}
              </div>
            )}
            {appointment.notes && (
              <div className="text-sm">
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-0.5" />
                  <span className="text-gray-600">{appointment.notes}</span>
                </div>
              </div>
            )}
            {appointment.visitSummary && (
              <div className="text-sm">
                <div className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Visit Summary:</span>
                    <p className="text-gray-600 mt-1">{appointment.visitSummary}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleViewDetails(appointment)}
          >
            View Details
          </Button>
          {showActions && appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRescheduleAppointment(appointment.id)}
              >
                Reschedule
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCancelAppointment(appointment.id)}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your appointments and view visit history</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastAppointments.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  showActions={true}
                />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments.</p>
                  <Button>Book New Appointment</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                />
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment history</h3>
                  <p className="text-gray-500">Your completed appointments will appear here.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Appointment Details Modal */}
        {selectedAppointment && (
          <AppointmentDetails
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
            onCancel={handleCancelAppointment}
            onReschedule={handleRescheduleAppointment}
          />
        )}

        {/* Reschedule Modal */}
        {rescheduleAppointment && (
          <RescheduleAppointment
            appointmentId={rescheduleAppointment.id}
            currentDate={rescheduleAppointment.date}
            currentTime={rescheduleAppointment.time}
            doctorName={rescheduleAppointment.doctorName}
            onClose={() => setRescheduleAppointment(null)}
            onReschedule={handleConfirmReschedule}
          />
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
