import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useSurveyStore } from '@/store/surveyStore';

const SurveyComplete: React.FC = () => {
  const navigate = useNavigate();
  const { survey_form_id, resetSurvey } = useSurveyStore();

  const handleViewResults = () => {
    navigate(`/sessions/${survey_form_id}`);
  };

  const handleNewSurvey = () => {
    resetSurvey();
    navigate('/survey');
  };

  const handleReturnHome = () => {
    resetSurvey();
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Survey Completed!</h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for completing the survey. Your responses have been successfully recorded.
        </p>

        {survey_form_id && (
          <p className="text-sm text-gray-500 mb-6">
            Session ID: <span className="font-mono">{survey_form_id}</span>
          </p>
        )}

        <div className="space-y-3">
          {/* <Button
            onClick={handleViewResults}
            className="w-full"
          >
            View Results
          </Button> */}
          
          <Button
            onClick={handleNewSurvey}
            variant="outline"
            className="w-full"
          >
            Start New Survey
          </Button>
          
          <Button
            onClick={handleReturnHome}
            variant="ghost"
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SurveyComplete;