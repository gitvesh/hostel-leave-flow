export type UserRole = 'student' | 'admin' | 'warden';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  hostelName?: string;
  roomNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}