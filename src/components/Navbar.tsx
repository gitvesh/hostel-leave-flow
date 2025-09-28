import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Home, History, Users, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-foreground">
            Hostel Leave Management
          </h1>
          
          <div className="flex items-center space-x-4">
            <Button
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2"
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            
            <Button
              variant={isActive('/history') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/history')}
              className="flex items-center space-x-2"
            >
              <History className="h-4 w-4" />
              <span>History</span>
            </Button>

            {(user.role === 'admin' || user.role === 'warden') && (
              <Button
                variant={isActive('/admin') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Manage Requests</span>
              </Button>
            )}

            {user.role === 'parent' && (
              <Button
                variant={isActive('/parent') ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/parent')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Parent Panel</span>
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="font-medium text-foreground">{user.name}</span>
            <span className="text-muted-foreground ml-2">({user.role})</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}