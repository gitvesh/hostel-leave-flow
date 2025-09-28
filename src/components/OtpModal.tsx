import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  leaveId: string;
  studentName: string;
}

export function OtpModal({ isOpen, onClose, onVerify, leaveId, studentName }: OtpModalProps) {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP',
        variant: 'destructive'
      });
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otp);
      toast({
        title: 'OTP Verified',
        description: `Leave request for ${studentName} has been approved`,
        variant: 'default'
      });
      onClose();
      setOtp('');
    } catch (error) {
      toast({
        title: 'OTP Verification Failed',
        description: 'Invalid or expired OTP. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    setOtp('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogDescription>
            Enter the 6-digit OTP sent to your registered email/SMS to approve the leave request for <strong>{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            className="justify-center"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          
          <p className="text-sm text-muted-foreground text-center">
            Didn't receive the OTP? Check your spam folder or contact the hostel administration.
          </p>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleVerify} disabled={isVerifying || otp.length !== 6}>
            {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify & Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}