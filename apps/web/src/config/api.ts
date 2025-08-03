const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl && process.env.NODE_ENV === 'production') {
    console.error('NEXT_PUBLIC_API_URL is not set in production environment');
    throw new Error('API URL not configured');
  }

  return apiUrl || 'http://localhost:8000';
};

export const API_CONFIG = {
  baseUrl: getApiUrl(),
  endpoints: {
    generateQuiz: '/generate-quiz',
    cache: '/api/cache',
    results: '/api/results'
  }
} as const;