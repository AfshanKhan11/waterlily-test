import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useSurveyStore } from '@/store/surveyStore'
import { questions } from '@/data/questions';

interface SessionResponse {
  question_id: number;
  answer: string | number;
  createdAt: string;
}


const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { getSessionResponses, sessions } = useSurveyStore();
  const [responses, setResponses] = useState<SessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = sessions.find((session) => session.survey_form_id === sessionId);

  useEffect(() => {
    const loadSessionDetails = async () => {
      if (!sessionId) {
        setError("Session ID is required");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const sessionResponses = await getSessionResponses(sessionId);
        setResponses(sessionResponses);
      } catch (err: any) {
        setError(err.message || "Failed to load session details");
      } finally {
        setIsLoading(false);
      }
    };

    loadSessionDetails();
  }, [sessionId, getSessionResponses]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getQuestionText = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question ? question.title : `Question ${questionId}`;
  };

  const getQuestionDescription = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    return question?.description || '';
  };

  const formatAnswer = (answer: string | number, questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return answer.toString();

    if (question.type === "multi-choice") {
      return answer.toString().split(';').join(', ');
    }
    
    return answer.toString();
  };

  const getUniqueQuestions = () => {
    const uniqueQuestionIds = new Set(responses.map(r => r.question_id));
    return Array.from(uniqueQuestionIds).sort();
  };

  const getLatestResponse = (questionId: number) => {
    const questionResponses = responses
      .filter(r => r.question_id === questionId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return questionResponses[0]; // Return the latest response
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading session details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center max-w-md w-full">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Button onClick={() => navigate("/sessions")}>Back to Sessions</Button>
        </Card>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="p-6 text-center max-w-md w-full">
          <div className="text-red-500 mb-4">Error: No session ID provided</div>
          <Button onClick={() => navigate("/sessions")}>Back to Sessions</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Session Details</h1>
            {session && (
              <p className="text-gray-600">
                Session ID: <span className="font-mono">{session.survey_form_id}</span>
              </p>
            )}
          </div>
          <Button 
            onClick={() => navigate("/sessions")} 
            variant="outline"
            className="mt-4 sm:mt-0"
          >
            Back to Sessions
          </Button>
        </div>

        {/* Session Summary */}
        {session && (
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{session.answer_count}</div>
                <div className="text-sm text-gray-600">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {formatDate(session.first_created_at)}
                </div>
                <div className="text-sm text-gray-600">Started</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {formatDate(session.last_created_at)}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {Math.round(
                    (new Date(session.last_created_at).getTime() - 
                     new Date(session.first_created_at).getTime()) / 60000
                  )} min
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
            </div>
          </Card>
        )}

        {/* Responses */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Survey Responses</h2>
          
          {responses.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <p className="text-gray-500">No responses found for this session.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {getUniqueQuestions().map((questionId, index) => {
                const latestResponse = getLatestResponse(questionId);
                const question = questions.find(q => q.id === questionId);
                
                return (
                  <div key={questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Q{questionId}: {getQuestionText(questionId)}
                        </h3>
                        {getQuestionDescription(questionId) && (
                          <p className="text-sm text-gray-600 mb-2">
                            {getQuestionDescription(questionId)}
                          </p>
                        )}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-blue-800 font-medium">
                            {formatAnswer(latestResponse.answer, questionId)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Answered on: {formatDate(latestResponse.createdAt)}</span>
                      {question?.required && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Required
                        </span>
                      )}
                    </div>

                    {/* Show response history if there are multiple responses for the same question */}
                    {responses.filter(r => r.question_id === questionId).length > 1 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Response History ({responses.filter(r => r.question_id === questionId).length} answers):
                        </p>
                        <div className="space-y-2">
                          {responses
                            .filter(r => r.question_id === questionId)
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map((response, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm">
                                <span>{formatAnswer(response.answer, questionId)}</span>
                                <span className="text-gray-400">{formatDate(response.createdAt)}</span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Debug info - remove in production */}
        {/* {process.env.NODE_ENV === 'development' && responses.length > 0 && (
          <Card className="p-4 mt-6 bg-gray-100">
            <details>
              <summary className="cursor-pointer font-medium text-gray-700">Debug Info</summary>
              <pre className="text-xs mt-2 overflow-auto">
                {JSON.stringify(responses, null, 2)}
              </pre>
            </details>
          </Card>
        )} */}
      </div>
    </div>
  );
};

export default SessionDetail;