import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { addMessage, startInterview, submitAnswer, nextQuestion, startTimer, stopTimer } from '../../store/interviewSlice';
import { updateCandidate } from '../../store/candidateSlice';
import { MessageBubble } from './MessageBubble';
import { Timer } from './Timer';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Upload, Send } from 'lucide-react';
import { parseResume } from '../../utils/fileParser';
import { generateInterviewQuestions, evaluateAnswer, generateSummary } from '../../utils/api';
import { showErrorModal, handleFileUploadError, handleApiError } from '../../utils/errorHandler';

export function Chat() {
  const dispatch = useDispatch();
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [awaitingInfo, setAwaitingInfo] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    questions,
    currentQuestionIndex,
    isInterviewStarted,
    isInterviewCompleted,
    currentTimer,
    isTimerActive,
  } = useSelector((state: RootState) => state.interview);
  
  const { currentCandidate } = useSelector((state: RootState) => state.candidate);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentTimer === 0 && isTimerActive) {
      handleTimeUp();
    }
  }, [currentTimer, isTimerActive]);

  useEffect(() => {
    if (!currentCandidate) {
      dispatch(addMessage({
        type: 'bot',
        content: 'Welcome! Please upload your resume to get started.',
      }));
    }
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      const parsedData = await parseResume(file);
      
      const missingInfo = [];
      if (!parsedData.name) missingInfo.push('name');
      if (!parsedData.email) missingInfo.push('email');
      if (!parsedData.phone) missingInfo.push('phone');

      if (missingInfo.length > 0) {
        setAwaitingInfo(missingInfo);
        dispatch(addMessage({
          type: 'bot',
          content: `I've processed your resume! However, I need some additional information. Please provide your ${missingInfo.join(', ')}.`,
        }));
      } else {
        await createCandidateAndStartInterview(parsedData, file.name);
      }
    } catch (error) {
      handleFileUploadError(error);
    } finally {
      setIsUploading(false);
    }
  };

  const createCandidateAndStartInterview = async (data: any, fileName: string) => {
    try {
      // Create candidate
      dispatch(addMessage({
        type: 'bot',
        content: `Great! I have all your information. Let me generate interview questions based on your background.`,
      }));

      const questions = await generateInterviewQuestions(data.content);
      
      if (questions.length === 0) {
        throw new Error('Failed to generate questions');
      }

      const questionsWithDefaults = questions.map((q, index) => ({
        id: `q_${index}`,
        content: q.content,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        answer: '',
        score: 0,
        timeSpent: 0,
      }));

      dispatch(startInterview({
        candidateId: currentCandidate?.id || '',
        questions: questionsWithDefaults,
      }));

      dispatch(addMessage({
        type: 'bot',
        content: `Perfect! I've prepared 6 questions for you. Let's begin with the first question:`,
      }));

      dispatch(addMessage({
        type: 'bot',
        content: questionsWithDefaults[0].content,
      }));

      dispatch(startTimer());
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    dispatch(addMessage({
      type: 'user',
      content: input,
    }));

    if (awaitingInfo.length > 0) {
      // Handle missing info collection
      const info = input.trim();
      const field = awaitingInfo[0];
      const remaining = awaitingInfo.slice(1);
      
      setAwaitingInfo(remaining);
      
      if (remaining.length > 0) {
        dispatch(addMessage({
          type: 'bot',
          content: `Thank you! Now please provide your ${remaining[0]}.`,
        }));
      } else {
        // All info collected, start interview
        dispatch(addMessage({
          type: 'bot',
          content: `Perfect! Now let me generate interview questions based on your background.`,
        }));
        // Start interview logic here
      }
    } else if (isInterviewStarted && !isInterviewCompleted) {
      await handleAnswerSubmission(input);
    }

    setInput('');
  };

  const handleAnswerSubmission = async (answer: string) => {
    const question = questions[currentQuestionIndex];
    const timeSpent = question.timeLimit - currentTimer;

    dispatch(stopTimer());

    try {
      const score = await evaluateAnswer(question.content, answer);
      
      dispatch(submitAnswer({
        answer,
        score,
        timeSpent,
      }));

      dispatch(addMessage({
        type: 'bot',
        content: `Thank you for your answer! (Score: ${score}/10)`,
      }));

      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          dispatch(nextQuestion());
          dispatch(addMessage({
            type: 'bot',
            content: questions[currentQuestionIndex + 1].content,
          }));
          dispatch(startTimer());
        }, 2000);
      } else {
        // Interview completed
        dispatch(nextQuestion());
        await handleInterviewCompletion();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleTimeUp = async () => {
    if (!isTimerActive || !questions[currentQuestionIndex]) return;
    
    dispatch(addMessage({
      type: 'bot',
      content: 'Time\'s up! Moving to the next question.',
    }));

    await handleAnswerSubmission('No answer provided (time expired)');
  };

  const handleInterviewCompletion = async () => {
    try {
      const totalScore = questions.reduce((sum, q) => sum + q.score, 0);
      const averageScore = Math.round((totalScore / questions.length) * 10) / 10;

      const summary = await generateSummary(questions, currentCandidate?.name || 'Candidate');

      if (currentCandidate) {
        dispatch(updateCandidate({
          id: currentCandidate.id,
          finalScore: averageScore,
          aiSummary: summary,
          status: 'completed',
        }));
      }

      dispatch(addMessage({
        type: 'bot',
        content: `Interview completed! Your final score: ${averageScore}/10. Thank you for your time!`,
      }));
    } catch (error) {
      handleApiError(error);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>AI Interview Assistant</CardTitle>
          {currentQuestion && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length} 
                ({currentQuestion.difficulty})
              </span>
              <Timer />
            </div>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {!currentCandidate && (
            <div className="mt-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Processing...' : 'Upload Resume (PDF/DOCX)'}
              </Button>
            </div>
          )}

          {(currentCandidate || awaitingInfo.length > 0) && !isInterviewCompleted && (
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  awaitingInfo.length > 0 
                    ? `Enter your ${awaitingInfo[0]}...`
                    : 'Type your answer...'
                }
                className="flex-1"
                disabled={!isTimerActive && isInterviewStarted && !isInterviewCompleted}
              />
              <Button type="submit" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}