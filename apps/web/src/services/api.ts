import { API_CONFIG } from '@/config/api'

interface Question {
  question: string;
  options: string[];
  correct_index: number;
}

interface QuizResponse {
  status: string;
  questions: Question[];
  metadata: {
    original_text_length: number;
    was_summarized: boolean;
    num_questions: number;
  };
}

export async function generateQuiz(file: File): Promise<QuizResponse> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.generateQuiz}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erro ao gerar questionário');
    }

    return response.json();
  } catch (error) {
    console.error('Erro ao gerar questionário:', error);
    throw error;
  }
}