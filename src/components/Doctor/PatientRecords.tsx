
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, User, Phone, Mail, Calendar, FileText } from 'lucide-react';

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  lastVisit: string;
  totalVisits: number;
  medicalHistory: string[];
  currentMedications: string[];
}

const PatientRecords: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  // Mock patient data
  const patients: PatientRecord[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      dateOfBirth: '1985-06-15',
      lastVisit: '2024-01-15',
      totalVisits: 5,
      medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
      currentMedications: ['Metformin 500mg', 'Lisinopril 10mg']
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-0124',
      dateOfBirth: '1990-03-22',
      lastVisit: '2024-01-10',
      totalVisits: 3,
      medicalHistory: ['Allergic Rhinitis'],
      currentMedications: ['Cetirizine 10mg']
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.brown@email.com',
      phone: '+1-555-0125',
      dateOfBirth: '1978-11-08',
      lastVisit: '2024-01-08',
      totalVisits: 8,
      medicalHistory: ['Chronic Back Pain', 'Migraine'],
      currentMedications: ['Ibuprofen 400mg', 'Sumatriptan 50mg']
    }
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Search and view patient information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <Card>
          <CardHeader>
            <CardTitle>Patients ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-medium">{patient.name}</h3>
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                        <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                        <span>•</span>
                        <span>{patient.totalVisits} visits</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPatients.length === 0 && (
                <div className="text-center py-6">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No patients found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                    <p className="text-gray-600">Age: {calculateAge(selectedPatient.dateOfBirth)}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-medium mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedPatient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Born: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Visit History */}
                <div>
                  <h4 className="font-medium mb-3">Visit History</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Total Visits:</span> {selectedPatient.totalVisits}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Last Visit:</span> {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div>
                  <h4 className="font-medium mb-3">Medical History</h4>
                  <div className="space-y-2">
                    {selectedPatient.medicalHistory.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))}
                    {selectedPatient.medicalHistory.length === 0 && (
                      <p className="text-sm text-gray-500">No medical history recorded</p>
                    )}
                  </div>
                </div>

                {/* Current Medications */}
                <div>
                  <h4 className="font-medium mb-3">Current Medications</h4>
                  <div className="space-y-2">
                    {selectedPatient.currentMedications.map((medication, index) => (
                      <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                        {medication}
                      </div>
                    ))}
                    {selectedPatient.currentMedications.length === 0 && (
                      <p className="text-sm text-gray-500">No current medications</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">Select a patient to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientRecords;
