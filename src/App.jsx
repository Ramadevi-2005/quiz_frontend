import React, { useState, useEffect } from 'react';
import { Plus, BookOpen, BarChart3 } from 'lucide-react';
import QuizCreator from './components/QuizCreator';
import QuizPlayer from './components/QuizPlayer';
import Dashboard from './components/Dashboard';
import QuizLibrary from './components/QuizLibrary';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedAttempts = localStorage.getItem('attempts');
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
    
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('attempts', JSON.stringify(attempts));
  }, [attempts]);

  const addQuiz = (quiz) => {
    setQuizzes(prev => [...prev, quiz]);
  };

  const updateQuiz = (updatedQuiz) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === updatedQuiz.id ? updatedQuiz : quiz
    ));
  };

  const deleteQuiz = (quizId) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    setAttempts(prev => prev.filter(attempt => attempt.quizId !== quizId));
  };

  const addAttempt = (attempt) => {
    setAttempts(prev => [...prev, attempt]);
  };

  const stats = {
    totalQuizzes: quizzes.length,
    totalAttempts: attempts.length,
    averageScore: attempts.length > 0 
      ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0) / attempts.length)
      : 0,
    completionRate: attempts.length > 0
      ? Math.round((attempts.filter(a => a.completed).length / attempts.length) * 100)
      : 0
  };

  const handlePlay = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('play');
  };

  const handleEdit = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentView('create');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={stats}
            recentQuizzes={quizzes.slice(-5)}
            recentAttempts={attempts.slice(-10)}
            onCreateQuiz={() => setCurrentView('create')}
            onViewLibrary={() => setCurrentView('library')}
            onPlayQuiz={handlePlay}
          />
        );
      case 'library':
        return (
          <QuizLibrary 
            quizzes={quizzes}
            attempts={attempts}
            onPlay={handlePlay}
            onEdit={handleEdit}
            onDelete={deleteQuiz}
            onCreateNew={() => {
              setSelectedQuiz(null);
              setCurrentView('create');
            }}
          />
        );
      case 'create':
        return (
          <QuizCreator 
            quiz={selectedQuiz}
            onSave={(quiz) => {
              if (selectedQuiz) {
                updateQuiz(quiz);
              } else {
                addQuiz(quiz);
              }
              setSelectedQuiz(null);
              setCurrentView('library');
            }}
            onCancel={() => {
              setSelectedQuiz(null);
              setCurrentView('library');
            }}
          />
        );
      case 'play':
        return selectedQuiz ? (
          <QuizPlayer 
            quiz={selectedQuiz}
            onComplete={(attempt) => {
              addAttempt(attempt);
              setCurrentView('results');
            }}
            onExit={() => {
              setSelectedQuiz(null);
              setCurrentView('library');
            }}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  QuizCraft
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('library')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'library'
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                My Quizzes
              </button>
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setCurrentView('create');
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Create Quiz
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  setSelectedQuiz(null);
                  setCurrentView('create');
                }}
                className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white border-b border-gray-200">
        <div className="flex justify-around py-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === 'dashboard' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('library')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentView === 'library' ? 'text-purple-600 bg-purple-50' : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">Library</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;
