import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Star, Clock, Calendar } from 'lucide-react';
import BookAppointment from '@/components/BookAppointment';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: string;
  rating: number;
  experience: number;
  availability: string[];
  profileImage?: string;
  consultationFee: number;
}

const FindDoctors: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Mock doctors data
  const allDoctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      location: 'New York',
      rating: 4.8,
      experience: 12,
      availability: ['Monday', 'Tuesday', 'Wednesday'],
      consultationFee: 200
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      location: 'Los Angeles',
      rating: 4.9,
      experience: 8,
      availability: ['Tuesday', 'Thursday', 'Friday'],
      consultationFee: 150
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      location: 'Chicago',
      rating: 4.7,
      experience: 15,
      availability: ['Monday', 'Wednesday', 'Friday'],
      consultationFee: 175
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      specialization: 'Orthopedics',
      location: 'Houston',
      rating: 4.6,
      experience: 20,
      availability: ['Tuesday', 'Wednesday', 'Thursday'],
      consultationFee: 220
    },
    {
      id: '5',
      name: 'Dr. Lisa Thompson',
      specialization: 'Neurology',
      location: 'Miami',
      rating: 4.9,
      experience: 18,
      availability: ['Monday', 'Thursday', 'Friday'],
      consultationFee: 250
    }
  ];

  const specializations = ['All', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology'];
  const locations = ['All', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'];

  const filteredDoctors = allDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = !selectedSpecialization || 
                                 selectedSpecialization === 'All' || 
                                 doctor.specialization === selectedSpecialization;
    const matchesLocation = !selectedLocation || 
                           selectedLocation === 'All' || 
                           doctor.location === selectedLocation;
    
    return matchesSearch && matchesSpecialization && matchesLocation;
  });

  const handleBookAppointment = (doctorId: string) => {
    const doctor = allDoctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
    }
  };

  const handleConfirmBooking = (appointmentData: any) => {
    // Save appointment to localStorage (in a real app, this would be saved to a database)
    const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
    const newAppointment = {
      id: Date.now().toString(),
      ...appointmentData
    };
    localStorage.setItem('userAppointments', JSON.stringify([...existingAppointments, newAppointment]));
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${appointmentData.doctorName} has been booked for ${new Date(appointmentData.date).toLocaleDateString()} at ${appointmentData.time}.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
          <p className="text-gray-600">Search and book appointments with qualified doctors</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search Doctors</Label>
                <Input
                  id="search"
                  placeholder="Search by name or specialization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">{filteredDoctors.length} doctors found</p>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.profileImage} />
                    <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {doctor.experience} years experience
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Available: {doctor.availability.join(', ')}
                  </div>
                  <div className="pt-2">
                    <Badge variant="secondary">
                      ${doctor.consultationFee} consultation fee
                    </Badge>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleBookAppointment(doctor.id)}
                >
                  Book Appointment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-gray-500">No doctors found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {/* Book Appointment Modal */}
        {selectedDoctor && (
          <BookAppointment
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
            onBook={handleConfirmBooking}
          />
        )}
      </div>
    </div>
  );
};

export default FindDoctors;
