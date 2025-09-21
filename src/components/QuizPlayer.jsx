import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, ChevronLeft, Flag, CheckCircle, XCircle, AlertCircle, Trophy, RotateCcw } from 'lucide-react';

const QuizPlayer = ({ quiz, onComplete, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(null);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    let questions = [...quiz.questions];
    if (quiz.randomizeQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }
    setShuffledQuestions(questions);

    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60);
    }

    const currentQuestion = questions[0];
    if (currentQuestion?.timeLimit) {
      setQuestionTimeRemaining(currentQuestion.timeLimit);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && !isComplete) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isComplete) {
      handleComplete();
    }
  }, [timeRemaining, isComplete]);

  useEffect(() => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    if (questionTimeRemaining !== null && questionTimeRemaining > 0 && !isComplete) {
      const timer = setTimeout(() => setQuestionTimeRemaining(questionTimeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (questionTimeRemaining === 0 && !isComplete) {
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        nextQuestion();
      } else {
        handleComplete();
      }
    }
  }, [questionTimeRemaining, isComplete, currentQuestionIndex, shuffledQuestions.length]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionStartTime(Date.now());

      const nextQuestion = shuffledQuestions[currentQuestionIndex + 1];
      if (nextQuestion?.timeLimit) {
        setQuestionTimeRemaining(nextQuestion.timeLimit);
      } else {
        setQuestionTimeRemaining(null);
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setQuestionStartTime(Date.now());

      const prevQuestion = shuffledQuestions[currentQuestionIndex - 1];
      if (prevQuestion?.timeLimit) {
        setQuestionTimeRemaining(prevQuestion.timeLimit);
      } else {
        setQuestionTimeRemaining(null);
      }
    }
  };

  const handleComplete = () => {
    setIsComplete(true);

    const endTime = Date.now();
    const totalTimeSpent = Math.floor((endTime - startTime) / 1000);

    let score = 0;
    const detailedAnswers = shuffledQuestions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score += question.points;

      return {
        questionId: question.id,
        answer: userAnswer || '',
        isCorrect,
        timeSpent: 30
      };
    });

    const attempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      quizTitle: quiz.title,
      score,
      totalQuestions: shuffledQuestions.length,
      timeSpent: totalTimeSpent,
      answers: detailedAnswers,
      completed: true,
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date(endTime).toISOString()
    };

    setShowResults(true);
    setTimeout(() => onComplete(attempt), 1000);
  };

  const calculateResults = () => {
    let correct = 0;
    let total = shuffledQuestions.length;

    shuffledQuestions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });

    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= quiz.passingScore;

    return { correct, total, percentage, passed };
  };

  if (showResults) {
    const results = calculateResults();

    return (
      <div className="max-w-4xl mx-auto">
        {/* Results UI kept same as TS version */}
        {/* ... */}
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Full JSX UI kept same as TS version */}
      {/* ... */}
    </div>
  );
};

export default QuizPlayer;
