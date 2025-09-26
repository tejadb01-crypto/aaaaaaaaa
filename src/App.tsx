import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor, RootState } from './store/store';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Interviewee } from './pages/Interviewee';
import { Interviewer } from './pages/Interviewer';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { ErrorModal } from './components/ErrorModal';
import { setErrorHandler, ErrorModalData } from './utils/errorHandler';
import { checkUnfinishedSession, resetInterview } from './store/interviewSlice';
import { clearCurrentCandidate } from './store/candidateSlice';
import { MessageCircle, BarChart3 } from 'lucide-react';

function AppContent() {
  const [currentError, setCurrentError] = useState<ErrorModalData | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const dispatch = useDispatch();
  
  const { hasUnfinishedSession, candidateId } = useSelector((state: RootState) => state.interview);
  const { currentCandidate } = useSelector((state: RootState) => state.candidate);

  useEffect(() => {
    // Set up error handler
    setErrorHandler(setCurrentError);
    
    // Check for unfinished sessions
    dispatch(checkUnfinishedSession());
  }, [dispatch]);

  useEffect(() => {
    if (hasUnfinishedSession && !showWelcomeBack) {
      setShowWelcomeBack(true);
    }
  }, [hasUnfinishedSession, showWelcomeBack]);

  const handleContinueInterview = () => {
    setShowWelcomeBack(false);
  };

  const handleStartNewInterview = () => {
    dispatch(resetInterview());
    dispatch(clearCurrentCandidate());
    setShowWelcomeBack(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <div className="container mx-auto px-4 py-6 h-screen flex flex-col">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              AI Interview Assistant
            </h1>
            <p className="text-gray-600">
              Streamlined interview process powered by AI
            </p>
          </header>

          {/* Mobile: Stack vertically, Desktop: Tabs */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Tabs */}
            <div className="hidden lg:block">
              <Tabs defaultValue="interviewee" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="interviewee" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Interviewee
                  </TabsTrigger>
                  <TabsTrigger value="interviewer" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Interviewer
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="interviewee" className="flex-1">
                  <Interviewee />
                </TabsContent>
                
                <TabsContent value="interviewer" className="flex-1">
                  <Interviewer />
                </TabsContent>
              </Tabs>
            </div>

            {/* Mobile/Tablet: Router-based navigation */}
            <div className="lg:hidden flex-1">
              <div className="mb-4 flex rounded-lg bg-gray-200 p-1">
                <Routes>
                  <Route path="/interviewer" element={
                    <div className="flex w-full">
                      <button 
                        onClick={() => window.history.pushState({}, '', '/')}
                        className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        <MessageCircle className="h-4 w-4 inline mr-2" />
                        Interviewee
                      </button>
                      <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-white text-gray-900 shadow-sm">
                        <BarChart3 className="h-4 w-4 inline mr-2" />
                        Interviewer
                      </button>
                    </div>
                  } />
                  <Route path="*" element={
                    <div className="flex w-full">
                      <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-white text-gray-900 shadow-sm">
                        <MessageCircle className="h-4 w-4 inline mr-2" />
                        Interviewee
                      </button>
                      <button 
                        onClick={() => window.history.pushState({}, '', '/interviewer')}
                        className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                      >
                        <BarChart3 className="h-4 w-4 inline mr-2" />
                        Interviewer
                      </button>
                    </div>
                  } />
                </Routes>
              </div>

              <Routes>
                <Route path="/" element={<Interviewee />} />
                <Route path="/interviewer" element={<Interviewer />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </div>

        {/* Modals */}
        <WelcomeBackModal
          isOpen={showWelcomeBack}
          onContinue={handleContinueInterview}
          onStartNew={handleStartNewInterview}
          candidateName={currentCandidate?.name}
        />

        <ErrorModal
          error={currentError}
          onClose={() => setCurrentError(null)}
        />
      </Router>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

export default App;