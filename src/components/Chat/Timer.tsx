import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Clock } from 'lucide-react';
import { useTimer } from '../../hooks/useTimer';

export function Timer() {
  const { currentTimer, isTimerActive } = useTimer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (currentTimer <= 10) return 'text-red-600 bg-red-100';
    if (currentTimer <= 30) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  if (!isTimerActive && currentTimer === 0) return null;

  return (
    <Card className={`${getTimerColor()} border-2`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="text-lg font-bold">
            {formatTime(currentTimer)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}