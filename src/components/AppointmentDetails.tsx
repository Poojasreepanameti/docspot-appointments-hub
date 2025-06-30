
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, FileText, Phone, X } from 'lucide-react';

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
}

interface AppointmentDetailsProps {
  appointment: Appointment;
  onClose: () => void;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
}

const AppointmentDetails: React.FC<AppointmentDetailsProps> = ({
  appointment,
  onClose,
  onCancel,
  onReschedule
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Appointment Details</CardTitle>
              <CardDescription>Complete information about your appointment</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Doctor Information */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {appointment.doctorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{appointment.doctorName}</h3>
              <p className="text-gray-600">{appointment.doctorSpecialization}</p>
              <Badge className={getStatusColor(appointment.status)}>
                {appointment.status}
              </Badge>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-sm">{new Date(appointment.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm">{appointment.time}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm">{appointment.location}</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-700">
                <div className="h-5 w-5 mr-3 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
                <div>
                  <p className="font-medium">Consultation Fee</p>
                  <p className="text-sm">${appointment.consultationFee}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Summary */}
          {appointment.notes && (
            <div>
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Appointment Notes</p>
                  <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {appointment.visitSummary && (
            <div>
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium">Visit Summary</p>
                  <p className="text-sm text-gray-600 mt-1">{appointment.visitSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
              <>
                {onReschedule && (
                  <Button variant="outline" onClick={() => onReschedule(appointment.id)}>
                    Reschedule
                  </Button>
                )}
                {onCancel && (
                  <Button variant="outline" onClick={() => onCancel(appointment.id)}>
                    Cancel
                  </Button>
                )}
              </>
            )}
            <Button>
              <Phone className="h-4 w-4 mr-2" />
              Contact Doctor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentDetails;
