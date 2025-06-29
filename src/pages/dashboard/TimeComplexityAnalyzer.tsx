import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  code: string;
  language: string;
}

interface ComplexityAnalysis {
  overview: string;
  timeComplexity: {
    bestCase: string;
    averageCase: string;
    worstCase: string;
    detailedAnalysis: string;
    factors: string[];
    examples: string[];
  };
  spaceComplexity: {
    auxiliary: string;
    total: string;
    detailedAnalysis: string;
    factors: string[];
    memoryUsage: string;
  };
  algorithmAnalysis: {
    algorithmType: string;
    efficiency: string;
    optimizationOpportunities: string[];
    tradeoffs: string[];
    comparison: string;
  };
  codeBreakdown: Array<{
    line: string;
    operation: string;
    complexity: string;
    explanation: string;
  }>;
  optimizationSuggestions: Array<{
    suggestion: string;
    impact: string;
    implementation: string;
    tradeoff: string;
  }>;
  realWorldImplications: {
    scalability: string;
    performance: string;
    useCases: string[];
    limitations: string[];
  };
  visualization: {
    complexityGraph: string;
    comparisonChart: string;
  };
}

interface FormErrors {
  code?: string;
}

const TimeComplexityAnalyzer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    code: '',
    language: 'javascript'
  });
  const [analysis, setAnalysis] = useState<ComplexityAnalysis | null>(null);
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

  const sampleAlgorithms = [
    `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    `function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}`,
    `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`
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

    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.trim().length < 10) {
      newErrors.code = 'Code must be at least 10 characters';
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
    setAnalysis(null);

    try {
      const response = await aiToolsAPI.analyzeComplexity(formData) as { data: ComplexityAnalysis };
      setAnalysis(response.data);
      toast.success('Complexity analysis completed successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Analyze time complexity for ${formData.language} code: ${formData.code.substring(0, 100)}...` },
              { role: 'assistant', content: JSON.stringify(response.data, null, 2) },
            ], token);
          }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('Complexity analysis error:', error);
      const message = error instanceof Error ? error.message : 'Failed to analyze complexity';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      code: '',
      language: 'javascript'
    });
    setAnalysis(null);
    setErrors({});
  };

  const getEfficiencyColor = (efficiency: string) => {
    switch (efficiency.toLowerCase()) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
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
                📊
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Time Complexity Analyzer
                </h1>
                <p className="text-gray-300 text-lg">
                  Analyze the time and space complexity of your algorithms with detailed insights and optimization tips.
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🔍</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Analyze Algorithm</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                    Algorithm Code
                  </label>
                  <textarea
                    id="code"
                    name="code"
                    rows={12}
                    value={formData.code}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 resize-none text-sm px-4 py-3 font-mono transition-all duration-300 ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                    placeholder="Paste your algorithm code here..."
                  />
                  {errors.code && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.code}
                    </p>
                  )}
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
                        Analyzing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🔍</span>
                        Analyze Complexity
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

              {/* Sample Algorithms */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Sample Algorithms
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sampleAlgorithms.slice(0, 3).map((algorithm, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, code: algorithm })}
                      className="text-left p-3 text-xs bg-green-600/20 hover:bg-green-600/30 text-white rounded-lg transition-all duration-300 border border-green-600/30 hover:border-green-500/50 font-mono"
                    >
                      {algorithm.split('\n')[0].replace('function ', '').replace('(', '')}...
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Analysis Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📈</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Complexity Analysis</h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm">AI is analyzing your algorithm complexity...</p>
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-6 flex-1 overflow-y-auto">
                  {/* Overview */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">📋 Overview</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <p className="text-gray-300 text-sm leading-relaxed">{analysis.overview}</p>
                    </div>
                  </div>

                  {/* Time Complexity */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">⏱️ Time Complexity</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        <div className="text-center p-2 bg-green-600/20 rounded border border-green-600/50">
                          <div className="text-xs text-gray-400">Best Case</div>
                          <div className="text-green-300 font-mono">{analysis.timeComplexity.bestCase}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-600/20 rounded border border-blue-600/50">
                          <div className="text-xs text-gray-400">Average Case</div>
                          <div className="text-blue-300 font-mono">{analysis.timeComplexity.averageCase}</div>
                        </div>
                        <div className="text-center p-2 bg-red-600/20 rounded border border-red-600/50">
                          <div className="text-xs text-gray-400">Worst Case</div>
                          <div className="text-red-300 font-mono">{analysis.timeComplexity.worstCase}</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{analysis.timeComplexity.detailedAnalysis}</p>
                    </div>
                  </div>

                  {/* Space Complexity */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">💾 Space Complexity</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-cyan-600/20 rounded border border-cyan-600/50">
                          <div className="text-xs text-gray-400">Auxiliary Space</div>
                          <div className="text-cyan-300 font-mono">{analysis.spaceComplexity.auxiliary}</div>
                        </div>
                        <div className="text-center p-2 bg-purple-600/20 rounded border border-purple-600/50">
                          <div className="text-xs text-gray-400">Total Space</div>
                          <div className="text-purple-300 font-mono">{analysis.spaceComplexity.total}</div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{analysis.spaceComplexity.detailedAnalysis}</p>
                    </div>
                  </div>

                  {/* Algorithm Analysis */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">🧮 Algorithm Analysis</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Type:</span>
                          <span className="text-white text-sm">{analysis.algorithmAnalysis.algorithmType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Efficiency:</span>
                          <span className={`text-sm font-medium ${getEfficiencyColor(analysis.algorithmAnalysis.efficiency)}`}>
                            {analysis.algorithmAnalysis.efficiency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optimization Suggestions */}
                  {analysis.optimizationSuggestions && analysis.optimizationSuggestions.length > 0 && (
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">💡 Optimization Suggestions</h3>
                      <div className="space-y-2">
                        {analysis.optimizationSuggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} className="bg-black/50 p-3 rounded-lg border border-purple-600/50">
                            <div className="text-white text-sm font-medium mb-1">{suggestion.suggestion}</div>
                            <div className="text-gray-400 text-xs">{suggestion.impact}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Paste your algorithm code to analyze its complexity.
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

export default TimeComplexityAnalyzer; 