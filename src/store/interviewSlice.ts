import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
}

export interface Question {
  id: string;
  content: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number; // in seconds
  answer: string;
  score: number;
  timeSpent: number;
}

interface InterviewState {
  messages: Message[];
  questions: Question[];
  currentQuestionIndex: number;
  isInterviewStarted: boolean;
  isInterviewCompleted: boolean;
  currentTimer: number;
  isTimerActive: boolean;
  candidateId: string | null;
  hasUnfinishedSession: boolean;
}

const initialState: InterviewState = {
  messages: [],
  questions: [],
  currentQuestionIndex: 0,
  isInterviewStarted: false,
  isInterviewCompleted: false,
  currentTimer: 0,
  isTimerActive: false,
  candidateId: null,
  hasUnfinishedSession: false,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const newMessage: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
    },
    startInterview: (state, action: PayloadAction<{ candidateId: string; questions: Question[] }>) => {
      state.candidateId = action.payload.candidateId;
      state.questions = action.payload.questions;
      state.isInterviewStarted = true;
      state.currentQuestionIndex = 0;
      state.hasUnfinishedSession = true;
    },
    submitAnswer: (state, action: PayloadAction<{ answer: string; score: number; timeSpent: number }>) => {
      if (state.questions[state.currentQuestionIndex]) {
        state.questions[state.currentQuestionIndex].answer = action.payload.answer;
        state.questions[state.currentQuestionIndex].score = action.payload.score;
        state.questions[state.currentQuestionIndex].timeSpent = action.payload.timeSpent;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        state.currentTimer = state.questions[state.currentQuestionIndex].timeLimit;
      } else {
        state.isInterviewCompleted = true;
        state.isTimerActive = false;
        state.hasUnfinishedSession = false;
      }
    },
    setTimer: (state, action: PayloadAction<number>) => {
      state.currentTimer = action.payload;
    },
    startTimer: (state) => {
      state.isTimerActive = true;
      if (state.questions[state.currentQuestionIndex]) {
        state.currentTimer = state.questions[state.currentQuestionIndex].timeLimit;
      }
    },
    stopTimer: (state) => {
      state.isTimerActive = false;
    },
    tickTimer: (state) => {
      if (state.currentTimer > 0) {
        state.currentTimer--;
      }
    },
    resetInterview: (state) => {
      return { ...initialState };
    },
    checkUnfinishedSession: (state) => {
      state.hasUnfinishedSession = state.isInterviewStarted && !state.isInterviewCompleted;
    },
  },
});

export const {
  addMessage,
  startInterview,
  submitAnswer,
  nextQuestion,
  setTimer,
  startTimer,
  stopTimer,
  tickTimer,
  resetInterview,
  checkUnfinishedSession,
} = interviewSlice.actions;

export default interviewSlice.reducer;