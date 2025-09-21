import React from 'react';
import { BarChart3, BookOpen, Users, Trophy, Clock, TrendingUp, Star, Play } from 'lucide-react';

const Dashboard = ({
  stats,
  recentQuizzes,
  recentAttempts,
  onCreateQuiz,
  onViewLibrary,
  onPlayQuiz
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">QuizCraft</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create engaging quizzes, track performance, and make learning interactive for everyone.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onCreateQuiz}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Create Your First Quiz
          </button>
          <button
            onClick={onViewLibrary}
            className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:border-purple-300 hover:text-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Browse Quiz Library
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Active quizzes
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Total participations
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Star className="w-4 h-4 mr-1" />
            Performance metric
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            Success rate
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Quizzes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Quizzes</h2>
            <button
              onClick={onViewLibrary}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
            >
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentQuizzes.length > 0 ? (
              recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {quiz.questions.length} questions • {quiz.difficulty}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Created {formatDate(quiz.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => onPlayQuiz(quiz)}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No quizzes created yet</p>
                <button
                  onClick={onCreateQuiz}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Create Your First Quiz
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentAttempts.length > 0 ? (
              recentAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{attempt.quizTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Score: {Math.round((attempt.score / attempt.totalQuestions) * 100)}% • 
                      Time: {formatDuration(attempt.timeSpent)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(attempt.startedAt)}
                    </p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    (attempt.score / attempt.totalQuestions) >= 0.7 
                      ? 'bg-green-400' 
                      : 'bg-orange-400'
                  }`} />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No quiz attempts yet</p>
                <p className="text-sm text-gray-400 mt-1">Start taking quizzes to see activity here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
