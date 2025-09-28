import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LeaveRequest, LeaveStatus } from '@/types/leave';
import { History, Filter, Download, Calendar } from 'lucide-react';

// Mock data with more historical records
const mockHistoryData: LeaveRequest[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    hostelName: 'Krishna Hostel',
    roomNumber: 'A-201',
    reason: 'Family emergency - cousin\'s wedding',
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
    startDate: '2023-12-20',
    endDate: '2023-12-22',
    contactDetails: '+91 9876543210',
    status: 'approved',
    appliedDate: '2023-12-15',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedDate: '2023-12-16',
    comments: 'Approved for medical reasons.'
  },
  {
    id: '3',
    studentId: '2',
    studentName: 'Jane Smith',
    hostelName: 'Krishna Hostel',
    roomNumber: 'B-105',
    reason: 'Festival celebration at home',
    startDate: '2023-11-10',
    endDate: '2023-11-12',
    contactDetails: '+91 9876543211',
    status: 'rejected',
    appliedDate: '2023-11-05',
    reviewedBy: 'Dr. Sarah Wilson',
    reviewedDate: '2023-11-06',
    comments: 'Festival leave quota exceeded for this semester.'
  },
  {
    id: '4',
    studentId: '3',
    studentName: 'Mike Johnson',
    hostelName: 'Arjuna Hostel',
    roomNumber: 'C-301',
    reason: 'Job interview preparation',
    startDate: '2023-10-25',
    endDate: '2023-10-27',
    contactDetails: '+91 9876543212',
    status: 'approved',
    appliedDate: '2023-10-20',
    reviewedBy: 'Prof. John Davis',
    reviewedDate: '2023-10-21',
    comments: 'Approved for career development.'
  }
];

export default function LeaveHistory() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Filter data based on user role
  const getFilteredData = () => {
    let data = mockHistoryData;
    
    // If student, show only their requests
    if (user?.role === 'student') {
      data = data.filter(req => req.studentId === user.id);
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter(req => 
        req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.hostelName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      data = data.filter(req => req.status === statusFilter);
    }

    // Apply date range filter
    if (dateRange.start) {
      data = data.filter(req => req.appliedDate >= dateRange.start);
    }
    if (dateRange.end) {
      data = data.filter(req => req.appliedDate <= dateRange.end);
    }

    return data.sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  };

  const filteredData = getFilteredData();

  const exportToCSV = () => {
    const headers = ['Applied Date', 'Student Name', 'Hostel', 'Room', 'Reason', 'Start Date', 'End Date', 'Status', 'Reviewed By', 'Comments'];
    const csvData = filteredData.map(req => [
      req.appliedDate,
      req.studentName,
      req.hostelName,
      req.roomNumber,
      req.reason,
      req.startDate,
      req.endDate,
      req.status,
      req.reviewedBy || '',
      req.comments || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    const total = filteredData.length;
    const approved = filteredData.filter(req => req.status === 'approved').length;
    const rejected = filteredData.filter(req => req.status === 'rejected').length;
    const pending = filteredData.filter(req => req.status === 'pending').length;
    
    return { total, approved, rejected, pending };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
              <History className="h-8 w-8" />
              <span>Leave History</span>
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'student' 
                ? 'View your leave request history' 
                : 'Complete history of all leave requests'}
            </p>
          </div>

          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-pending">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </CardTitle>
            <CardDescription>Filter and search through leave history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by student name, reason, or hostel"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LeaveStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">From Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">To Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Request History</span>
            </CardTitle>
            <CardDescription>
              {filteredData.length} record(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applied Date</TableHead>
                    {user?.role !== 'student' && <TableHead>Student</TableHead>}
                    <TableHead>Hostel & Room</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed By</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {new Date(request.appliedDate).toLocaleDateString()}
                      </TableCell>
                      {user?.role !== 'student' && (
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.studentName}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.contactDetails}
                            </p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <div>
                          <p className="font-medium">{request.hostelName}</p>
                          <p className="text-sm text-muted-foreground">Room {request.roomNumber}</p>
                        </div>
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
                        <div className="text-sm">
                          {request.reviewedBy && (
                            <>
                              <p className="font-medium">{request.reviewedBy}</p>
                              <p className="text-muted-foreground">
                                {request.reviewedDate && new Date(request.reviewedDate).toLocaleDateString()}
                              </p>
                            </>
                          )}
                          {!request.reviewedBy && <span className="text-muted-foreground">-</span>}
                        </div>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}