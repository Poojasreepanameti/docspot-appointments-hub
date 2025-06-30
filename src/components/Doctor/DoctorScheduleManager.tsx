
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Plus, X } from 'lucide-react';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface DaySchedule {
  day: string;
  isWorking: boolean;
  timeSlots: TimeSlot[];
}

const DoctorScheduleManager: React.FC = () => {
  const { toast } = useToast();
  const [consultationFee, setConsultationFee] = useState('200');
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    {
      day: 'Monday',
      isWorking: true,
      timeSlots: [
        { id: '1', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: '2', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]
    },
    {
      day: 'Tuesday',
      isWorking: true,
      timeSlots: [
        { id: '3', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: '4', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]
    },
    {
      day: 'Wednesday',
      isWorking: true,
      timeSlots: [
        { id: '5', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: '6', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]
    },
    {
      day: 'Thursday',
      isWorking: true,
      timeSlots: [
        { id: '7', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: '8', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]
    },
    {
      day: 'Friday',
      isWorking: true,
      timeSlots: [
        { id: '9', startTime: '09:00', endTime: '12:00', isAvailable: true },
        { id: '10', startTime: '14:00', endTime: '17:00', isAvailable: true }
      ]
    },
    {
      day: 'Saturday',
      isWorking: false,
      timeSlots: []
    },
    {
      day: 'Sunday',
      isWorking: false,
      timeSlots: []
    }
  ]);

  const toggleWorkingDay = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, isWorking: !day.isWorking, timeSlots: !day.isWorking ? [] : day.timeSlots }
        : day
    ));
  };

  const addTimeSlot = (dayIndex: number) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: [
              ...day.timeSlots,
              {
                id: Date.now().toString(),
                startTime: '09:00',
                endTime: '10:00',
                isAvailable: true
              }
            ]
          }
        : day
    ));
  };

  const removeTimeSlot = (dayIndex: number, slotId: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? { ...day, timeSlots: day.timeSlots.filter(slot => slot.id !== slotId) }
        : day
    ));
  };

  const updateTimeSlot = (dayIndex: number, slotId: string, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev => prev.map((day, index) => 
      index === dayIndex 
        ? {
            ...day,
            timeSlots: day.timeSlots.map(slot => 
              slot.id === slotId ? { ...slot, [field]: value } : slot
            )
          }
        : day
    ));
  };

  const saveSchedule = () => {
    // Save to localStorage
    localStorage.setItem('doctorSchedule', JSON.stringify({ schedule, consultationFee }));
    toast({
      title: "Schedule Updated",
      description: "Your schedule and consultation fee have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Consultation Fee */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Fee</CardTitle>
          <CardDescription>Set your consultation fee for appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="fee" className="text-sm font-medium">Fee ($)</Label>
            <Input
              id="fee"
              type="number"
              value={consultationFee}
              onChange={(e) => setConsultationFee(e.target.value)}
              className="w-32"
            />
            <Button onClick={saveSchedule} className="ml-auto">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Set your working hours for each day of the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {schedule.map((day, dayIndex) => (
              <div key={day.day} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={day.isWorking}
                      onCheckedChange={() => toggleWorkingDay(dayIndex)}
                    />
                    <h3 className="text-lg font-medium">{day.day}</h3>
                    {!day.isWorking && <Badge variant="secondary">Day Off</Badge>}
                  </div>
                  {day.isWorking && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addTimeSlot(dayIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Time Slot
                    </Button>
                  )}
                </div>

                {day.isWorking && (
                  <div className="space-y-3 ml-6">
                    {day.timeSlots.map((slot) => (
                      <div key={slot.id} className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <Input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'startTime', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) => updateTimeSlot(dayIndex, slot.id, 'endTime', e.target.value)}
                            className="w-32"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTimeSlot(dayIndex, slot.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {day.timeSlots.length === 0 && (
                      <p className="text-sm text-gray-500 ml-6">No time slots added</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorScheduleManager;
