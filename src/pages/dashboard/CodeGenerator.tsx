import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  problemStatement: string;
  language: string;
}

interface GeneratedCode {
  code: string;
  language: string;
  problemStatement: string;
}

interface FormErrors {
  problemStatement?: string;
}

const CodeGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    problemStatement: '',
    language: 'javascript'
  });
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { getToken, isSignedIn } = useAuth();

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { value: 'python', label: 'Python', icon: '🐍', color: 'from-blue-500 to-cyan-500' },
    { value: 'java', label: 'Java', icon: '☕', color: 'from-red-500 to-pink-500' },
    { value: 'cpp', label: 'C++', icon: '⚙️', color: 'from-blue-600 to-indigo-600' },
    { value: 'csharp', label: 'C#', icon: '🎯', color: 'from-purple-500 to-violet-500' },
    { value: 'php', label: 'PHP', icon: '🐘', color: 'from-purple-600 to-blue-600' },
    { value: 'ruby', label: 'Ruby', icon: '💎', color: 'from-red-600 to-pink-600' },
    { value: 'go', label: 'Go', icon: '🚀', color: 'from-cyan-500 to-blue-500' },
    { value: 'rust', label: 'Rust', icon: '🦀', color: 'from-orange-500 to-red-500' },
    { value: 'swift', label: 'Swift', icon: '🍎', color: 'from-orange-400 to-red-400' }
  ];

  const sampleProblems = [
    'Implement a binary search algorithm',
    'Create a function to reverse a string',
    'Build a simple calculator with basic operations',
    'Implement a stack data structure',
    'Create a function to find the factorial of a number',
    'Build a simple HTTP server',
    'Implement a linked list with basic operations',
    'Create a function to check if a string is a palindrome',
    'Build a simple database connection',
    'Implement a sorting algorithm (bubble sort)'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    } else if (formData.problemStatement.trim().length < 10) {
      newErrors.problemStatement = 'Problem statement must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneratedCode(null);

    try {
      const response = await aiToolsAPI.generateCode(formData) as { data: GeneratedCode };
      setGeneratedCode(response.data);
      toast.success('Code generated successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Generate ${formData.language} code for: ${formData.problemStatement}` },
              { role: 'assistant', content: response.data.code },
            ], token);
        }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('Code generation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      problemStatement: '',
      language: 'javascript'
    });
    setGeneratedCode(null);
    setErrors({});
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
      <motion.div
          initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
      >
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                💻
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Code Generator
                </h1>
                <p className="text-gray-300 text-lg">
                  Generate production-ready code in multiple programming languages with AI assistance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🎯</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generate Code</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-300 mb-2">
                    Problem Statement
                  </label>
                  <textarea
                    id="problemStatement"
                    name="problemStatement"
                    rows={6}
                    value={formData.problemStatement}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 resize-none text-sm px-4 py-3 transition-all duration-300 ${errors.problemStatement ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                    placeholder="Describe the problem or functionality you want to implement..."
                  />
                  {errors.problemStatement && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.problemStatement}
                    </p>
                  )}
                </div>

            <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                Programming Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value} className="text-white bg-black">
                    {lang.icon} {lang.label}
                  </option>
                ))}
              </select>
            </div>

                <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-3 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Code...
                  </div>
                ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Generate Code
                      </div>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={clearForm}
                    className="bg-gray-800/50 hover:bg-gray-700/50 text-white py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-300 border border-gray-600/50"
              >
                Clear
              </motion.button>
            </div>
          </form>

              {/* Sample Problems */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Sample Problems
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sampleProblems.slice(0, 5).map((problem) => (
                    <motion.button
                      key={problem}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, problemStatement: problem })}
                      className="text-left p-3 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-white rounded-lg transition-all duration-300 border border-purple-600/30 hover:border-purple-500/50"
                    >
                      {problem}
                    </motion.button>
                  ))}
                </div>
              </div>
        </div>
      </motion.div>

          {/* Generated Code Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💻</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generated Code</h2>
      </div>

          {isLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm">AI is analyzing and generating your code...</p>
              </div>
            </div>
          ) : generatedCode ? (
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {/* Code Info */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-2 text-sm">📋 Code Details</h3>
                    <div className="bg-black/50 p-3 rounded-xl border border-purple-600/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-400">Language:</span>
                          <p className="text-purple-300">{generatedCode.language}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Problem:</span>
                          <p className="text-purple-300 truncate">{generatedCode.problemStatement}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Generated Code */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-purple-400 text-sm">💻 Implementation</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(generatedCode.code)}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs py-1 px-3 rounded-lg transition-colors"
                      >
                        📋 Copy Code
                      </motion.button>
                    </div>
              <SyntaxHighlighter
                      language={generatedCode.language}
                style={tomorrow}
                customStyle={{
                  margin: 0,
                        borderRadius: '0.75rem',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  background: 'transparent',
                  color: '#ffffff',
                }}
                showLineNumbers={true}
              >
                      {generatedCode.code}
              </SyntaxHighlighter>
                  </div>
            </div>
          ) : (
            <div className="text-center flex-1 flex items-center justify-center">
              <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💻</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Describe your problem to generate intelligent code.
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator; 