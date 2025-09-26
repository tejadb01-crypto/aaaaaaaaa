import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Candidate } from '../../store/candidateSlice';
import { User, Mail, Phone, Calendar } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{candidate.name}</CardTitle>
          <Badge className={getStatusColor(candidate.status)}>
            {candidate.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            {candidate.email}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            {candidate.phone}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            {new Date(candidate.createdAt).toLocaleDateString()}
          </div>
          
          {candidate.finalScore > 0 && (
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Final Score:</span>
                <span className={`text-lg font-bold ${getScoreColor(candidate.finalScore)}`}>
                  {candidate.finalScore}/10
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}