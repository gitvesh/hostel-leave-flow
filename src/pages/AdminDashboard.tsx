import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types/leave';
import { Users, CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockAllRequests: LeaveRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Family emergency - attending cousin\'s wedding ceremony. This is an important family event that I cannot miss.',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    contactDetails: '+91 9876543210',
    status: 'pending',
    appliedDate: '2024-01-28'
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'Jane Smith',
    hostelName: 'Krishna Hostel',
    roomNumber: 'B-105',
    reason: 'Medical checkup at home - routine health examination',
    startDate: '2024-02-05',
    endDate: '2024-02-07',
    contactDetails: '+91 9876543211',
    status: 'pending',
    appliedDate: '2024-01-30'
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Mike Johnson',
    hostelName: 'Arjuna Hostel',
    roomNumber: 'C-301',
    reason: 'Job interview in hometown',
    startDate: '2024-02-10',
    endDate: '2024-02-12',
    contactDetails: '+91 9876543212',
    status: 'approved',
    appliedDate: '2024-01-25',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedDate: '2024-01-27',
    comments: 'Approved for career opportunity. Best of luck!'
  }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockAllRequests);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionComments, setActionComments] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    const comments = actionComments.trim();
    
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? {
            ...req,
            status: action === 'approve' ? 'approved' : 'rejected',
            reviewedBy: user?.name || '',
            reviewedDate: new Date().toISOString().split('T')[0],
            comments: comments || (action === 'approve' ? 'Approved' : 'Rejected')
          }
        : req
    ));

    setActionComments('');
    setSelectedRequest(null);
    
    toast({
      title: `Request ${action === 'approve' ? 'approved' : 'rejected'}`,
      description: `Leave request for ${requests.find(r => r.id === requestId)?.studentName} has been ${action === 'approve' ? 'approved' : 'rejected'}`,
    });
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const getStatusStats = () => {
    const pending = requests.filter(r => r.status === 'pending').length;
    const approved = requests.filter(r => r.status === 'approved').length;
    const rejected = requests.filter(r => r.status === 'rejected').length;
    return { pending, approved, rejected, total: requests.length };
  };

  const stats = getStatusStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {user?.role === 'admin' ? 'Admin' : 'Warden'} Dashboard
          </h1>
          <p className="text-muted-foreground">Manage student leave requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-pending" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{stats.approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Leave Requests</CardTitle>
            <CardDescription>
              Review and manage student leave requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Hostel & Room</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.studentName}</p>
                          <p className="text-sm text-muted-foreground">
                            {request.contactDetails}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.hostelName}</p>
                          <p className="text-sm text-muted-foreground">Room {request.roomNumber}</p>
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
                        {new Date(request.appliedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedRequest(request)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Leave Request Details</DialogTitle>
                                <DialogDescription>
                                  Review and take action on this leave request
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedRequest && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">Student Name</p>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.studentName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Contact</p>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.contactDetails}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Hostel</p>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.hostelName}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Room</p>
                                      <p className="text-sm text-muted-foreground">{selectedRequest.roomNumber}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium mb-2">Reason for Leave</p>
                                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                      {selectedRequest.reason}
                                    </p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm font-medium">Start Date</p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(selectedRequest.startDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">End Date</p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(selectedRequest.endDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-sm font-medium">Current Status</p>
                                    <StatusBadge status={selectedRequest.status} className="mt-1" />
                                  </div>

                                  {selectedRequest.status === 'pending' && (
                                    <div className="space-y-4 border-t pt-4">
                                      <div>
                                        <label className="text-sm font-medium">Comments (Optional)</label>
                                        <Textarea
                                          placeholder="Add any comments for the student..."
                                          value={actionComments}
                                          onChange={(e) => setActionComments(e.target.value)}
                                          className="mt-1"
                                          rows={3}
                                        />
                                      </div>
                                      
                                      <div className="flex space-x-2">
                                        <Button
                                          onClick={() => handleAction(selectedRequest.id, 'approve')}
                                          className="flex items-center space-x-2"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          <span>Approve</span>
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleAction(selectedRequest.id, 'reject')}
                                          className="flex items-center space-x-2"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          <span>Reject</span>
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  {selectedRequest.status !== 'pending' && selectedRequest.comments && (
                                    <div className="border-t pt-4">
                                      <p className="text-sm font-medium mb-2">Review Comments</p>
                                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                        {selectedRequest.comments}
                                      </p>
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Reviewed by {selectedRequest.reviewedBy} on{' '}
                                        {selectedRequest.reviewedDate && new Date(selectedRequest.reviewedDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {request.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAction(request.id, 'approve')}
                                className="bg-success hover:bg-success/80"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAction(request.id, 'reject')}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}