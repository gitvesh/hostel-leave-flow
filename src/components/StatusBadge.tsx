import { Badge } from '@/components/ui/badge';
import { LeaveStatus } from '@/types/leave';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: LeaveStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: LeaveStatus) => {
    switch (status) {
      case 'pending':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'Pending',
          className: 'bg-pending text-pending-foreground hover:bg-pending/80'
        };
      case 'approved':
        return {
          variant: 'secondary' as const,
          icon: CheckCircle,
          text: 'Approved',
          className: 'bg-success text-success-foreground hover:bg-success/80'
        };
      case 'rejected':
        return {
          variant: 'destructive' as const,
          icon: XCircle,
          text: 'Rejected',
          className: 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
        };
      case 'pending_otp':
        return {
          variant: 'secondary' as const,
          icon: Clock,
          text: 'Pending OTP',
          className: 'bg-blue-500 text-white hover:bg-blue-600'
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
    </Badge>
  );
}