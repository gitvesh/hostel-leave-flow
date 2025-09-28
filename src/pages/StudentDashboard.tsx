import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LeaveRequest, LeaveFormData } from '@/types/leave';
import { PlusCircle, Calendar, MapPin, Phone, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Family emergency - attending cousin\'s wedding',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    contactDetails: '+91 9876543210',
    status: 'approved',
    appliedDate: '2024-01-10',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedDate: '2024-01-12',
    comments: 'Approved. Please ensure you return on time.'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Medical checkup at home',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    contactDetails: '+91 9876543210',
    status: 'pending',
    appliedDate: '2024-01-28'
  }
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState(mockLeaveRequests);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<LeaveFormData>({
    reason: '',
    startDate: '',
    endDate: '',
    contactDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start >= end) {
      toast({
        title: "Invalid dates",
        description: "End date must be after start date",
        variant: "destructive"
      });
      return;
    }

    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      studentId: user?.id || '',
      studentName: user?.name || '',
      hostelName: user?.hostelName || '',
      roomNumber: user?.roomNumber || '',
      ...formData,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    setFormData({ reason: '', startDate: '', endDate: '', contactDetails: '' });
    setShowForm(false);
    
    toast({
      title: "Leave request submitted",
      description: "Your request has been sent for approval",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Manage your leave requests</p>
          </div>
          
          <Button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Apply for Leave</span>
          </Button>
        </div>

        {/* Student Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Your Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hostel</p>
                <p className="font-medium">{user?.hostelName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Room</p>
                <p className="font-medium">{user?.roomNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leave Application Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Apply for Leave</span>
              </CardTitle>
              <CardDescription>
                Fill out the form below to request leave from the hostel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a detailed reason for your leave request"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Details</Label>
                  <Input
                    id="contact"
                    type="tel"
                    placeholder="Phone number where you can be reached"
                    value={formData.contactDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactDetails: e.target.value }))}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit">Submit Request</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Your Leave Requests</span>
            </CardTitle>
            <CardDescription>
              Track the status of your submitted leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaveRequests.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No leave requests found. Click "Apply for Leave" to submit your first request.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {new Date(request.appliedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(request.startDate).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              to {new Date(request.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-muted-foreground">
                            {request.comments || '-'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}