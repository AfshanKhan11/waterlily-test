import React, { useState, useEffect } from "react";
import { useSurveyStore } from "@/store/surveyStore";
import { questions } from "@/data/questions";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ProgressBar from "@/components/ProgressBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentQuestionIndex,
    nextQuestion,
    previousQuestion,
    submitResponse,
    isLoading,
    error,
    startSurvey,
    isCompleted,
    completeSurvey,
    survey_form_id,
    responses
  } = useSurveyStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Safely get current response
  const currentResponse = responses.find(r => r.question_id === currentQuestion?.id);
  const currentAnswer = currentResponse?.answer?.toString() || "";

  // Initialize selected answer based on previous response
  useEffect(() => {
    if (currentAnswer) {
      setSelectedAnswer(currentAnswer);
    } else {
      setSelectedAnswer("");
    }
    setHasAttemptedSubmit(false);
  }, [currentQuestionIndex, currentAnswer]);

  // Start survey when component mounts
  useEffect(() => {
    if (!survey_form_id && !isCompleted) {
      startSurvey();
    }
  }, [survey_form_id, isCompleted, startSurvey]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setHasAttemptedSubmit(false);
  };

  const handleNext = async () => {
    if (!currentQuestion) return;

    if (currentQuestion.required && !selectedAnswer) {
      setHasAttemptedSubmit(true);
      return;
    }

    const success = await submitResponse({
      question_id: currentQuestion.id,
      answer: selectedAnswer
    });

    if (success) {
      if (currentQuestionIndex < questions.length - 1) {
        nextQuestion();
      } else {
        completeSurvey();
        navigate("/survey-complete");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      previousQuestion();
    }
  };

  if (isCompleted) {
    completeSurvey();
    navigate("/survey-complete");
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading survey..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <ProgressBar value={progress} className="mb-6" showLabel={false} />
        </div>

        {/* Question Card */}
        <Card className="p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {currentQuestion.title}
            </h2>
            {currentQuestion.description && (
              <p className="text-gray-600 mb-4">{currentQuestion.description}</p>
            )}
            {currentQuestion.required && (
              <p className="text-sm text-red-500">* Required</p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div
                key={option}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedAnswer === option
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  }`}
                onClick={() => handleAnswerSelect(option)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${selectedAnswer === option
                        ? "border-blue-500"
                        : "border-gray-300"
                      }`}
                  >
                    {selectedAnswer === option && (
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                </div>
              </div>
            ))}
          </div>

          {hasAttemptedSubmit && !selectedAnswer && (
            <p className="text-red-500 text-sm mt-3">Please select an answer to continue</p>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0 || isLoading}
            className="min-w-[120px]"
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            isLoading={isLoading}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finish Survey" : "Next"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Survey;