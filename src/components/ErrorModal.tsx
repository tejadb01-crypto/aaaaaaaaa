import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { ErrorModalData } from '../utils/errorHandler';

interface ErrorModalProps {
  error: ErrorModalData | null;
  onClose: () => void;
}

export function ErrorModal({ error, onClose }: ErrorModalProps) {
  if (!error) return null;

  const getIcon = () => {
    switch (error.type) {
      case 'warning': return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      case 'info': return <Info className="h-6 w-6 text-blue-600" />;
      default: return <AlertCircle className="h-6 w-6 text-red-600" />;
    }
  };

  const getColor = () => {
    switch (error.type) {
      case 'warning': return 'border-orange-200 bg-orange-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-red-200 bg-red-50';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {error.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg ${getColor()}`}>
          <p className="text-gray-700">{error.message}</p>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}