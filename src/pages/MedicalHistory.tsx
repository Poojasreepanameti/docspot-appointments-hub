
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Calendar, User, Activity, AlertCircle } from 'lucide-react';

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  specialization: string;
  diagnosis: string;
  treatment: string;
  prescription?: string[];
  notes?: string;
  documents?: string[];
}

interface HealthMetric {
  id: string;
  type: 'Blood Pressure' | 'Weight' | 'Blood Sugar' | 'Heart Rate';
  value: string;
  date: string;
  unit: string;
  status: 'Normal' | 'High' | 'Low';
}

const MedicalHistory: React.FC = () => {
  const [medicalRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      date: '2023-12-10',
      doctorName: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      diagnosis: 'Annual Health Checkup',
      treatment: 'Routine examination completed',
      prescription: ['Vitamin D3 - 1000 IU daily'],
      notes: 'Patient is in good health. Continue current lifestyle. Next checkup in 12 months.',
      documents: ['Lab Results - Blood Panel', 'Vaccination Record Update']
    },
    {
      id: '2',
      date: '2023-08-15',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      diagnosis: 'Mild Hypertension',
      treatment: 'Lifestyle modifications recommended',
      prescription: ['Lisinopril 5mg - Once daily', 'Low sodium diet'],
      notes: 'Blood pressure slightly elevated. Recommended diet changes and regular exercise.',
      documents: ['ECG Report', 'Blood Pressure Monitoring Chart']
    },
    {
      id: '3',
      date: '2023-05-22',
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      diagnosis: 'Seasonal Allergies',
      treatment: 'Antihistamine therapy',
      prescription: ['Cetirizine 10mg - As needed', 'Moisturizing cream'],
      notes: 'Allergic reaction to pollen. Symptoms should subside with medication.',
      documents: ['Allergy Test Results']
    }
  ]);

  const [healthMetrics] = useState<HealthMetric[]>([
    { id: '1', type: 'Blood Pressure', value: '120/80', date: '2024-01-10', unit: 'mmHg', status: 'Normal' },
    { id: '2', type: 'Weight', value: '70', date: '2024-01-10', unit: 'kg', status: 'Normal' },
    { id: '3', type: 'Blood Sugar', value: '95', date: '2024-01-05', unit: 'mg/dL', status: 'Normal' },
    { id: '4', type: 'Heart Rate', value: '72', date: '2024-01-10', unit: 'bpm', status: 'Normal' },
    { id: '5', type: 'Blood Pressure', value: '135/85', date: '2023-12-15', unit: 'mmHg', status: 'High' },
    { id: '6', type: 'Weight', value: '72', date: '2023-12-15', unit: 'kg', status: 'Normal' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-red-100 text-red-800';
      case 'Low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <Activity className="h-4 w-4" />;
      case 'High': case 'Low': return <AlertCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const handleDownloadDocument = (documentName: string) => {
    console.log('Downloading document:', documentName);
    // TODO: Implement document download
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Medical History</h1>
          <p className="text-gray-600">Access your complete medical records and health metrics</p>
        </div>

        <Tabs defaultValue="records" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="records" className="space-y-4">
            {medicalRecords.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
                      <CardDescription>
                        {record.doctorName} • {record.specialization}
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(record.date).toLocaleDateString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Treatment</h4>
                        <p className="text-gray-600">{record.treatment}</p>
                      </div>
                      
                      {record.prescription && record.prescription.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Prescription</h4>
                          <ul className="space-y-1">
                            {record.prescription.map((med, index) => (
                              <li key={index} className="text-gray-600">• {med}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {record.notes && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Doctor's Notes</h4>
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}
                      
                      {record.documents && record.documents.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Related Documents</h4>
                          <div className="space-y-2">
                            {record.documents.map((doc, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadDocument(doc)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {doc}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Blood Pressure', 'Weight', 'Blood Sugar', 'Heart Rate'].map((metricType) => {
                const latestMetric = healthMetrics
                  .filter(m => m.type === metricType)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                
                return (
                  <Card key={metricType}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{metricType}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {latestMetric ? (
                        <div>
                          <div className="text-2xl font-bold">{latestMetric.value}</div>
                          <div className="text-xs text-gray-500">{latestMetric.unit}</div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge className={getStatusColor(latestMetric.status)}>
                              {getStatusIcon(latestMetric.status)}
                              <span className="ml-1">{latestMetric.status}</span>
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(latestMetric.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-gray-500">No data</div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthMetrics
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(metric.status)}
                        <div>
                          <div className="font-medium">{metric.type}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(metric.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">{metric.value} {metric.unit}</div>
                          <Badge className={getStatusColor(metric.status)}>
                            {metric.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Medical Documents</CardTitle>
                <CardDescription>
                  Download and view your medical documents and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicalRecords.flatMap(record => 
                    record.documents?.map((doc, index) => ({
                      name: doc,
                      date: record.date,
                      doctor: record.doctorName,
                      type: doc.includes('Lab') ? 'Lab Result' : 
                            doc.includes('ECG') ? 'Test Result' :
                            doc.includes('Vaccination') ? 'Vaccination' : 'Report'
                    })) || []
                  ).map((document, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <FileText className="h-8 w-8 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <h4 className="font-medium">{document.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{document.doctor}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(document.date).toLocaleDateString()}
                            </p>
                            <Badge variant="secondary" className="mt-2">
                              {document.type}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => handleDownloadDocument(document.name)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MedicalHistory;
