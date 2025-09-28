export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'pending_otp';

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  hostelName: string;
  roomNumber: string;
  reason: string;
  startDate: string;
  endDate: string;
  contactDetails: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  comments?: string;
}

export interface LeaveFormData {
  reason: string;
  startDate: string;
  endDate: string;
  contactDetails: string;
}