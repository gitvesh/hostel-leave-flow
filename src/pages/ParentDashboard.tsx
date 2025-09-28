import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { OtpModal } from '@/components/OtpModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { LeaveRequest } from '@/types/leave';
import { Shield, Calendar, MessageSquare, Phone } from 'lucide-react';
import { format } from 'date-fns';

// Mock data for parent dashboard
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Family wedding ceremony',
    startDate: '2024-01-15',
    endDate: '2024-01-18',
    contactDetails: '+91-9876543210',
    status: 'pending_otp',
    appliedDate: '2024-01-10',
    reviewedBy: 'Dr. Sarah Wilson',
    comments: 'Approved by warden. Awaiting parent confirmation via OTP.'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Medical emergency',
    startDate: '2024-01-05',
    endDate: '2024-01-07',
    contactDetails: '+91-9876543210',
    status: 'approved',
    appliedDate: '2024-01-03',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedDate: '2024-01-04',
    comments: 'Emergency leave approved. OTP verified by parent.'
  }
];

export default function ParentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [otpModalOpen, setOtpModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch child's leave requests
    const fetchLeaveRequests = async () => {
      // Filter requests for the current parent's child
      const childRequests = mockLeaveRequests.filter(
        request => request.studentId === user?.studentId
      );
      setLeaveRequests(childRequests);
    };

    fetchLeaveRequests();
  }, [user?.studentId]);

  const handleOtpVerify = async (otp: string) => {
    if (!selectedLeaveId) return;

    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OTP verification (in real app, this would be validated by backend)
    if (otp === '123456') {
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === selectedLeaveId 
            ? { ...request, status: 'approved' as const, reviewedDate: new Date().toISOString() }
            : request
        )
      );
    } else {
      throw new Error('Invalid OTP');
    }
  };

  const openOtpModal = (leaveId: string) => {
    setSelectedLeaveId(leaveId);
    setOtpModalOpen(true);
  };

  const closeOtpModal = () => {
    setSelectedLeaveId(null);
    setOtpModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  };

  const selectedLeave = leaveRequests.find(leave => leave.id === selectedLeaveId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and approve your child's leave requests
          </p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leaveRequests.length}</div>
              <p className="text-xs text-muted-foreground">This academic year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending OTP</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequests.filter(req => req.status === 'pending_otp').length}
              </div>
              <p className="text-xs text-muted-foreground">Requires your approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {leaveRequests.filter(req => req.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Your child's leave requests and their current status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaveRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No leave requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date Applied</TableHead>
                      <TableHead>Leave Period</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          {formatDate(request.appliedDate)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div>{formatDate(request.startDate)}</div>
                            <div className="text-sm text-muted-foreground">
                              to {formatDate(request.endDate)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {calculateDuration(request.startDate, request.endDate)}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="truncate" title={request.reason}>
                              {request.reason}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={request.status} />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            <p className="text-sm text-muted-foreground truncate" title={request.comments}>
                              {request.comments || 'No comments'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {request.status === 'pending_otp' && (
                            <Button
                              size="sm"
                              onClick={() => openOtpModal(request.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Shield className="h-4 w-4 mr-1" />
                              Enter OTP
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* OTP Verification Modal */}
        <OtpModal
          isOpen={otpModalOpen}
          onClose={closeOtpModal}
          onVerify={handleOtpVerify}
          leaveId={selectedLeaveId || ''}
          studentName={selectedLeave?.studentName || ''}
        />
      </main>
    </div>
  );
}