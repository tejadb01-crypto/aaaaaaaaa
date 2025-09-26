import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Message } from '../../store/interviewSlice';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[80%] ${isBot ? 'order-2' : 'order-1'}`}>
        <Card className={`${isBot ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              {isBot ? (
                <Bot className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              ) : (
                <User className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${isBot ? 'text-blue-900' : 'text-green-900'}`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${isBot ? 'text-blue-500' : 'text-green-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}