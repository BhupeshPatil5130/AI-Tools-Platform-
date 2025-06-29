import axios from 'axios';
import { config, getApiUrl, getHealthUrl } from '../config/env';

// Add request timeout
const axiosInstance = axios.create({
  timeout: config.api.timeout,
  headers: { 'Content-Type': 'application/json' }
});

interface GenerateCodeData {
  problemStatement: string;
  language: string;
}

interface GenerateRoadmapData {
  domain: string;
  experienceLevel: string;
  focusAreas: string[];
}

interface AnalyzeComplexityData {
  code: string;
  language: string;
}

interface ExplainAlgorithmData {
  algorithmName: string;
  complexity: string;
}

interface GenerateFrontendData {
  description: string;
  framework: string;
  features: string;
  styling: string;
}

interface GenerateAPIData {
  description: string;
  framework: string;
  features: string[];
  authentication: string;
  database: string;
}

export const aiToolsAPI = {
  generateCode: async (formData: GenerateCodeData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/generate-code'), formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to generate code');
    }
  },

  generateRoadmap: async (data: GenerateRoadmapData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/generate-roadmap'), data);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Roadmap generation failed');
    }
  },

  analyzeComplexity: async (formData: AnalyzeComplexityData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/analyze-complexity'), formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to analyze complexity');
    }
  },

  explainAlgorithm: async (formData: ExplainAlgorithmData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/explain-algorithm'), formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to explain algorithm');
    }
  },

  generateFrontend: async (formData: GenerateFrontendData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/generate-frontend'), formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to generate frontend code');
    }
  },

  generateAPI: async (formData: GenerateAPIData) => {
    try {
      const response = await axiosInstance.post(getApiUrl('/generate-api'), formData);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw new Error('Failed to generate API');
    }
  },

  // Health check method
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get(getHealthUrl());
      return response.data;
    } catch (error: any) {
      throw new Error('Backend service is not available');
    }
  },
};

export const chatAPI = {
  async saveChat(messages: { role: string; content: string; timestamp?: string }[], token: string) {
    try {
      console.log('Saving chat with token:', token ? 'Token present' : 'No token');
      console.log('Messages to save:', messages);
      
      const res = await fetch(getApiUrl('/chats'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ messages }),
      });
      
      console.log('Save chat response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Save chat error:', errorData);
        throw new Error(errorData.error || 'Failed to save chat');
      }
      
      const data = await res.json();
      console.log('Chat saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Save chat error:', error);
      throw error;
    }
  },
  
  async getRecentChats(token: string) {
    try {
      console.log('Getting recent chats with token:', token ? 'Token present' : 'No token');
      
      const res = await fetch(getApiUrl('/chats'), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Get chats response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Get chats error:', errorData);
        throw new Error(errorData.error || 'Failed to fetch recent chats');
      }
      
      const data = await res.json();
      console.log('Chats retrieved successfully:', data);
      return data;
    } catch (error) {
      console.error('Get chats error:', error);
      throw error;
    }
  },

  async deleteChat(chatId: string, token: string) {
    try {
      console.log('Deleting chat:', chatId, 'with token:', token ? 'Token present' : 'No token');
      
      const res = await fetch(getApiUrl(`/chats/${chatId}`), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Delete chat response status:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Delete chat error:', errorData);
        throw new Error(errorData.error || 'Failed to delete chat');
      }
      
      const data = await res.json();
      console.log('Chat deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Delete chat error:', error);
      throw error;
    }
  },
}; 