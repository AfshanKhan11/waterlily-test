import React, { useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useSurveyStore } from '@/store/surveyStore'
import { useNavigate } from 'react-router-dom'

const SessionList = () => {
  const { isLoading, sessions, error, loadUserSessions } = useSurveyStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadUserSessions();
  }, [loadUserSessions]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatSessionId = (id: string) => {
    return id.length > 10 ? `${id.substring(0, 10)}...` : id;
  };

  const getCompletionPercentage = (answerCount: number) => {
    const totalQuestions = 15; // Based on your questions array
    return Math.round((answerCount / totalQuestions) * 100);
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <LoadingSpinner size='lg' text='Loading your survey sessions...' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
        <Card className='p-8 text-center max-w-md w-full'>
          <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-red-600' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-800 mb-2'>Error Loading Sessions</h2>
          <p className='text-gray-600 mb-6'>{error}</p>
          <Button onClick={loadUserSessions}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4 '>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>Your Survey Sessions</h1>
            <p className='text-gray-600'>View all your completed surveys</p>
          </div>
          <div className='space-x-2'>

          <Button 
            onClick={() => navigate('/home')}
            className='mt-4 sm:mt-0'
            variant='secondary'
          >
            Go Home
          </Button>
          <Button 
            onClick={() => navigate('/survey')}
            className='mt-4 sm:mt-0'
          >
            Start New Survey
          </Button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <Card className='p-8 text-center'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-8 h-8 text-gray-400' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h2 className='text-xl font-bold text-gray-800 mb-2'>No Surveys Yet</h2>
            <p className='text-gray-600 mb-6'>You haven't completed any surveys yet. Start your first survey to see results here.</p>
            <Button onClick={() => navigate('/survey')} size='lg'>
              Start Your First Survey
            </Button>
          </Card>
        ) : (
          <div className='grid  gap-6'>
            {sessions.map((session) => {
              const completionPercentage = getCompletionPercentage(session.answer_count);
              
              return (
                <Card key={session.survey_form_id} className='hover:shadow-lg transition-shadow duration-300'>
                  <div className='p-6'>
                    {/* Session Header */}
                    <div className='mb-4'>
                      <div className='flex justify-between items-start mb-2'>
                        <h2 className='text-lg font-semibold text-gray-800'>
                          {formatSessionId(session.survey_form_id)}
                        </h2>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          completionPercentage === 100 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {completionPercentage}% Complete
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className='w-full bg-gray-200 rounded-full h-2 mb-2'>
                        <div 
                          className={`h-2 rounded-full ${
                            completionPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Session Details */}
                    <div className='space-y-3 text-sm text-gray-600 mb-4'>
                      <div className='flex justify-between'>
                        <span className='flex items-center'>
                          <svg className='w-4 h-4 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          Duration
                        </span>
                        <span className='font-medium'>
                          {Math.round(
                            (new Date(session.last_created_at).getTime() - 
                             new Date(session.first_created_at).getTime()) / 60000
                          )} min
                        </span>
                      </div>
                      
                      <div className='flex justify-between'>
                        <span className='flex items-center'>
                          <svg className='w-4 h-4 mr-1' fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Completed
                        </span>
                        <span className='font-medium'>{formatDate(session.last_created_at)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => navigate(`/sessions/${session.survey_form_id}`)}
                      className='w-full'
                      variant={ 'outline'}
                    >
                       {/* {completionPercentage === 100 ? 'View Results' : 'Continue Survey'} */}
                    View Response
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;