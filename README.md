# AI-Powered Interview Assistant

A comprehensive React + Redux application for conducting AI-powered interviews with real-time evaluation and candidate management.

## Features

- **Dual Interface**: Interviewee chat interface and Interviewer dashboard
- **AI-Powered**: Powered by Google Gemini AI for question generation, answer evaluation, and summary creation
- **Smart Resume Parsing**: Extract candidate information from PDF/DOCX files
- **Timed Interviews**: 6 questions with varying difficulty levels and time limits
- **Real-time Scoring**: AI evaluates answers and provides instant feedback
- **Persistent Storage**: Uses IndexedDB via redux-persist for data persistence
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop
- **Welcome Back Feature**: Resume unfinished interview sessions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit + redux-persist
- **UI Components**: shadcn/ui + TailwindCSS
- **Routing**: React Router
- **Storage**: IndexedDB
- **AI Integration**: Google Gemini API
- **File Processing**: pdf-parse, mammoth (DOCX)

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ai-interview-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Add your Google Gemini API key to `.env`:
   ```
   REACT_APP_GEMINI_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm start
   ```

## Usage

### For Candidates (Interviewee Tab)

1. Upload your resume (PDF or DOCX)
2. Provide any missing contact information when prompted
3. Answer 6 AI-generated questions within the time limits:
   - 2 Easy questions (20 seconds each)
   - 2 Medium questions (60 seconds each)
   - 2 Hard questions (120 seconds each)
4. Receive real-time AI evaluation and final score

### For Interviewers (Interviewer Tab)

1. View all candidates in a searchable, sortable dashboard
2. See key metrics: total candidates, completion rate, average scores
3. Click on any candidate to view detailed results:
   - Resume content
   - Interview questions and answers
   - AI-generated scores and summary
   - Performance analytics

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── Chat.tsx              # Main chat interface
│   │   ├── MessageBubble.tsx     # Chat message component
│   │   └── Timer.tsx             # Interview timer
│   ├── Dashboard/
│   │   ├── Dashboard.tsx         # Interviewer dashboard
│   │   ├── CandidateCard.tsx     # Candidate preview cards
│   │   └── Modal.tsx             # Detailed candidate view
│   ├── ui/                       # shadcn/ui components
│   ├── WelcomeBackModal.tsx      # Resume session modal
│   └── ErrorModal.tsx            # Error handling modal
├── store/
│   ├── candidateSlice.ts         # Candidate data management
│   ├── interviewSlice.ts         # Interview state management
│   └── store.ts                  # Redux store configuration
├── utils/
│   ├── api.ts                    # Gemini AI integration
│   ├── fileParser.ts             # Resume parsing logic
│   └── errorHandler.ts           # Centralized error handling
├── pages/
│   ├── Interviewee.tsx           # Candidate interface page
│   └── Interviewer.tsx           # Dashboard interface page
├── hooks/
│   └── useTimer.ts               # Custom timer hook
└── App.tsx                       # Main application component
```

## Key Features Explained

### AI Integration
- **Question Generation**: AI analyzes resume content and generates relevant interview questions
- **Answer Evaluation**: Real-time scoring of candidate responses (1-10 scale)
- **Summary Creation**: Comprehensive interview summary with hiring recommendations

### State Persistence
- All interview data persists in IndexedDB
- Resume unfinished sessions after browser refresh/close
- "Welcome Back" modal for interrupted interviews

### Responsive Design
- **Mobile**: Single column, stacked interface
- **Tablet**: Split view layout
- **Desktop**: Tabbed interface with full feature access

### Error Handling
- File upload validation and error messages
- API failure graceful degradation
- Timer interruption handling
- Network connectivity issues

## Environment Variables

Create a `.env` file with:

```
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

## Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler check

## Browser Support

- Modern browsers with ES2020 support
- IndexedDB support required
- File API support for resume uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details