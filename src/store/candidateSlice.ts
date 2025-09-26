import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  resumeContent: string;
  resumeFileName: string;
  createdAt: string;
  finalScore: number;
  aiSummary: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface CandidateState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
}

const initialState: CandidateState = {
  candidates: [],
  currentCandidate: null,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    createCandidate: (state, action: PayloadAction<Omit<Candidate, 'id' | 'createdAt' | 'finalScore' | 'aiSummary' | 'status'>>) => {
      const newCandidate: Candidate = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        finalScore: 0,
        aiSummary: '',
        status: 'pending',
      };
      state.candidates.push(newCandidate);
      state.currentCandidate = newCandidate;
    },
    updateCandidate: (state, action: PayloadAction<Partial<Candidate> & { id: string }>) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
        if (state.currentCandidate?.id === action.payload.id) {
          state.currentCandidate = { ...state.currentCandidate, ...action.payload };
        }
      }
    },
    setCurrentCandidate: (state, action: PayloadAction<string>) => {
      const candidate = state.candidates.find(c => c.id === action.payload);
      state.currentCandidate = candidate || null;
    },
    clearCurrentCandidate: (state) => {
      state.currentCandidate = null;
    },
  },
});

export const { createCandidate, updateCandidate, setCurrentCandidate, clearCurrentCandidate } = candidateSlice.actions;
export default candidateSlice.reducer;