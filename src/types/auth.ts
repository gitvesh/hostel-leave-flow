export type UserRole = 'student' | 'admin' | 'warden' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hostelName?: string;
  roomNumber?: string;
  studentId?: string; // For parent role
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}