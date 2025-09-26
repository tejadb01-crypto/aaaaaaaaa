import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { RefreshCcw, X } from 'lucide-react';

interface WelcomeBackModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStartNew: () => void;
  candidateName?: string;
}

export function WelcomeBackModal({ isOpen, onContinue, onStartNew, candidateName }: WelcomeBackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-blue-600" />
            Welcome Back!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            {candidateName 
              ? `Hello ${candidateName}, you have an unfinished interview session.`
              : 'You have an unfinished interview session.'
            }
          </p>
          
          <p className="text-sm text-gray-500">
            Would you like to continue where you left off or start a new interview?
          </p>
          
          <div className="flex gap-3 pt-4">
            <Button onClick={onContinue} className="flex-1">
              Continue Interview
            </Button>
            <Button onClick={onStartNew} variant="outline" className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Start New
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}