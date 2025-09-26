import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Candidate } from '../../store/candidateSlice';
import { User, Mail, Phone, Calendar, FileText, MessageSquare } from 'lucide-react';

interface CandidateModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
  interviewData?: any;
}

export function CandidateModal({ candidate, isOpen, onClose, interviewData }: CandidateModalProps) {
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {candidate.name} - Interview Details
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(candidate.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{candidate.resumeFileName}</span>
                </div>
              </CardContent>
            </Card>

            {/* Resume Content */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {candidate.resumeContent.substring(0, 500)}...
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Interview Results */}
            {candidate.status === 'completed' && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Interview Score
                      <span className={`text-2xl font-bold ${getScoreColor(candidate.finalScore)}`}>
                        {candidate.finalScore}/10
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* AI Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI-Generated Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {candidate.aiSummary}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Questions and Answers */}
                {interviewData?.questions && interviewData.questions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Questions & Answers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {interviewData.questions.map((question: any, index: number) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">
                              Question {index + 1} - {question.difficulty}
                            </Badge>
                            <span className={`font-bold ${getScoreColor(question.score)}`}>
                              {question.score}/10
                            </span>
                          </div>
                          <p className="font-medium mb-2">{question.content}</p>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm">{question.answer || 'No answer provided'}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Time spent: {question.timeSpent}s / {question.timeLimit}s
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}