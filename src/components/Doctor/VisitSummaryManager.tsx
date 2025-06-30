
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Plus, Calendar, User } from 'lucide-react';

interface VisitSummary {
  id: string;
  patientName: string;
  patientId: string;
  visitDate: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  medications: string;
  followUpDate?: string;
  notes: string;
}

const VisitSummaryManager: React.FC = () => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visitSummaries, setVisitSummaries] = useState<VisitSummary[]>([
    {
      id: '1',
      patientName: 'John Smith',
      patientId: '1',
      visitDate: '2024-01-15',
      diagnosis: 'Hypertension follow-up',
      symptoms: 'Occasional headaches, fatigue',
      treatment: 'Continue current medication, lifestyle modifications',
      medications: 'Lisinopril 10mg daily',
      followUpDate: '2024-03-15',
      notes: 'Blood pressure well controlled. Patient reports good adherence to medication.'
    },
    {
      id: '2',
      patientName: 'Emily Davis',
      patientId: '2',
      visitDate: '2024-01-10',
      diagnosis: 'Allergic rhinitis',
      symptoms: 'Sneezing, nasal congestion, itchy eyes',
      treatment: 'Antihistamine therapy, environmental modifications',
      medications: 'Cetirizine 10mg daily',
      notes: 'Symptoms improved with current treatment. Advised to avoid known allergens.'
    }
  ]);

  const [newSummary, setNewSummary] = useState<Partial<VisitSummary>>({
    patientName: '',
    visitDate: new Date().toISOString().split('T')[0],
    diagnosis: '',
    symptoms: '',
    treatment: '',
    medications: '',
    followUpDate: '',
    notes: ''
  });

  // Mock patient list for selection
  const patients = [
    { id: '1', name: 'John Smith' },
    { id: '2', name: 'Emily Davis' },
    { id: '3', name: 'Michael Brown' }
  ];

  const handleCreateSummary = () => {
    if (!newSummary.patientName || !newSummary.diagnosis) {
      toast({
        title: "Error",
        description: "Please fill in patient name and diagnosis.",
        variant: "destructive"
      });
      return;
    }

    const summary: VisitSummary = {
      id: Date.now().toString(),
      patientId: patients.find(p => p.name === newSummary.patientName)?.id || '',
      patientName: newSummary.patientName,
      visitDate: newSummary.visitDate || new Date().toISOString().split('T')[0],
      diagnosis: newSummary.diagnosis || '',
      symptoms: newSummary.symptoms || '',
      treatment: newSummary.treatment || '',
      medications: newSummary.medications || '',
      followUpDate: newSummary.followUpDate,
      notes: newSummary.notes || ''
    };

    setVisitSummaries(prev => [summary, ...prev]);
    
    // Save to localStorage
    localStorage.setItem('visitSummaries', JSON.stringify([summary, ...visitSummaries]));
    
    setNewSummary({
      patientName: '',
      visitDate: new Date().toISOString().split('T')[0],
      diagnosis: '',
      symptoms: '',
      treatment: '',
      medications: '',
      followUpDate: '',
      notes: ''
    });
    setShowCreateForm(false);
    
    toast({
      title: "Visit Summary Created",
      description: "The visit summary has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Visit Summaries</h2>
          <p className="text-gray-600">Create and manage patient visit summaries</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          New Summary
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Visit Summary</CardTitle>
            <CardDescription>Document the patient's visit details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Select 
                  value={newSummary.patientName} 
                  onValueChange={(value) => setNewSummary(prev => ({ ...prev, patientName: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.name}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visitDate">Visit Date</Label>
                <Input
                  id="visitDate"
                  type="date"
                  value={newSummary.visitDate}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, visitDate: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={newSummary.diagnosis}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="Primary diagnosis..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="symptoms">Symptoms</Label>
                <Textarea
                  id="symptoms"
                  value={newSummary.symptoms}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="Patient's reported symptoms..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="treatment">Treatment Plan</Label>
                <Textarea
                  id="treatment"
                  value={newSummary.treatment}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, treatment: e.target.value }))}
                  placeholder="Treatment recommendations..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medications">Medications</Label>
                <Textarea
                  id="medications"
                  value={newSummary.medications}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="Prescribed medications..."
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="followUpDate">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={newSummary.followUpDate}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, followUpDate: e.target.value }))}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newSummary.notes}
                  onChange={(e) => setNewSummary(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional observations or notes..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              <Button onClick={handleCreateSummary}>
                Save Summary
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summaries List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visit Summaries</CardTitle>
          <CardDescription>View all patient visit summaries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visitSummaries.map((summary) => (
              <div key={summary.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{summary.patientName}</h3>
                      <p className="text-sm text-gray-600">{summary.diagnosis}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    {new Date(summary.visitDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Symptoms:</span>
                    <p className="text-gray-600 mt-1">{summary.symptoms}</p>
                  </div>
                  <div>
                    <span className="font-medium">Treatment:</span>
                    <p className="text-gray-600 mt-1">{summary.treatment}</p>
                  </div>
                  {summary.medications && (
                    <div>
                      <span className="font-medium">Medications:</span>
                      <p className="text-gray-600 mt-1">{summary.medications}</p>
                    </div>
                  )}
                  {summary.followUpDate && (
                    <div>
                      <span className="font-medium">Follow-up:</span>
                      <p className="text-gray-600 mt-1">{new Date(summary.followUpDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {summary.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="font-medium text-sm">Notes:</span>
                    <p className="text-gray-600 text-sm mt-1">{summary.notes}</p>
                  </div>
                )}
              </div>
            ))}

            {visitSummaries.length === 0 && (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500">No visit summaries created yet</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setShowCreateForm(true)}
                >
                  Create Your First Summary
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitSummaryManager;
