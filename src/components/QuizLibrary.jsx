import React, { useState } from 'react';
import { Search, Filter, Play, Edit, Trash2, Plus, BookOpen, Clock, Users, Star } from 'lucide-react';

const QuizLibrary = ({ quizzes, attempts, onPlay, onEdit, onDelete, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [...new Set(quizzes.map(quiz => quiz.category))];

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || quiz.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getQuizStats = (quizId) => {
    const quizAttempts = attempts.filter(attempt => attempt.quizId === quizId);
    const totalAttempts = quizAttempts.length;
    const averageScore =
      totalAttempts > 0
        ? Math.round(
            quizAttempts.reduce(
              (sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100,
              0
            ) / totalAttempts
          )
        : 0;

    return { totalAttempts, averageScore };
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Library</h1>
          <p className="text-gray-600 mt-1">Manage and play your quizzes</p>
        </div>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Create New Quiz
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:w-48">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      {filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const stats = getQuizStats(quiz.id);
            return (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group"
              >
                {/* Quiz Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {quiz.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{quiz.description}</p>

                  <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {quiz.questions.length} questions
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {quiz.timeLimit ? `${quiz.timeLimit}m` : 'No limit'}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {stats.totalAttempts} attempts
                    </div>
                  </div>

                  {stats.totalAttempts > 0 && (
                    <div className="flex items-center text-sm mb-4">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      <span className="text-gray-600">Avg Score: {stats.averageScore}%</span>
                    </div>
                  )}

                  {quiz.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {quiz.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {quiz.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{quiz.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Quiz Actions */}
                <div className="px-6 pb-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPlay(quiz)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Play className="w-4 h-4 inline mr-2" />
                      Play
                    </button>
                    <button
                      onClick={() => onEdit(quiz)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this quiz?')) {
                          onDelete(quiz.id);
                        }
                      }}
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? 'No matching quizzes found'
              : 'No quizzes yet'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Create your first quiz to get started with QuizCraft.'}
          </p>
          <button
            onClick={onCreateNew}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Create New Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizLibrary;
