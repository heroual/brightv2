import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

const quizQuestions = [
  {
    id: 1,
    question: "Combien de fois par jour devriez-vous vous brosser les dents ?",
    options: [
      "Une fois",
      "Deux fois",
      "Trois fois",
      "Après chaque repas"
    ],
    correctAnswer: 1,
    explanation: "Il est recommandé de se brosser les dents au moins deux fois par jour, le matin et le soir."
  },
  {
    id: 2,
    question: "Pendant combien de temps devriez-vous vous brosser les dents ?",
    options: [
      "30 secondes",
      "1 minute",
      "2 minutes",
      "5 minutes"
    ],
    correctAnswer: 2,
    explanation: "Un brossage efficace doit durer au moins 2 minutes pour bien nettoyer toutes les surfaces dentaires."
  },
  {
    id: 3,
    question: "À quelle fréquence devriez-vous changer votre brosse à dents ?",
    options: [
      "Tous les mois",
      "Tous les 3-4 mois",
      "Tous les 6 mois",
      "Une fois par an"
    ],
    correctAnswer: 1,
    explanation: "Il est recommandé de changer sa brosse à dents tous les 3-4 mois ou plus tôt si les poils sont usés."
  }
];

export default function InteractiveQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Quiz terminé !</h3>
        <div className="text-center mb-8">
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {score}/{quizQuestions.length}
          </p>
          <p className="text-gray-600">
            {score === quizQuestions.length
              ? "Parfait ! Vous maîtrisez les bases de l'hygiène dentaire !"
              : "Continuez à apprendre pour améliorer votre score !"}
          </p>
        </div>
        <button
          onClick={resetQuiz}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
        >
          Recommencer le quiz
        </button>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="mb-20">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Testez vos Connaissances</h3>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1}/{quizQuestions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              Score: {score}/{quizQuestions.length}
            </span>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-6">{question.question}</h4>
          
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-lg border-2 transition ${
                  selectedAnswer === null
                    ? 'hover:border-blue-500 hover:bg-blue-50'
                    : selectedAnswer === index
                    ? index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : index === question.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200'
                } ${
                  selectedAnswer === null
                    ? 'border-gray-200'
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {selectedAnswer !== null && (
                    index === question.correctAnswer ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : selectedAnswer === index ? (
                      <XCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    )
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {showExplanation && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">{question.explanation}</p>
          </div>
        )}

        {selectedAnswer !== null && (
          <button
            onClick={handleNextQuestion}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          >
            <span>{currentQuestion === quizQuestions.length - 1 ? 'Terminer' : 'Question suivante'}</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}