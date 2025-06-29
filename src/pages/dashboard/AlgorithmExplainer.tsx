import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  algorithmName: string;
  complexity: string;
}

interface AlgorithmExplanation {
  name: string;
  description: string;
  howItWorks: string;
  pseudocode: string;
  timeComplexity: string;
  spaceComplexity: string;
  useCases: string[];
  advantages: string[];
  disadvantages: string[];
  example: string;
}

interface FormErrors {
  algorithmName?: string;
}

const AlgorithmExplainer: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    algorithmName: '',
    complexity: 'detailed'
  });
  const [explanation, setExplanation] = useState<AlgorithmExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { getToken, isSignedIn } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sampleAlgorithms = [
    'Binary Search',
    'Linear Search',
    'Bubble Sort',
    'Quick Sort',
    'Merge Sort',
    'Insertion Sort',
    'Selection Sort',
    'Heap Sort',
    'Counting Sort',
    'Radix Sort',
    'Bucket Sort',
    'Shell Sort',
    'Dijkstra Algorithm',
    'Kruskal Algorithm',
    'Prim Algorithm',
    'Bellman-Ford Algorithm',
    'Floyd-Warshall Algorithm',
    'A* Search Algorithm',
    'Breadth-First Search',
    'Depth-First Search',
    'Binary Tree Traversal',
    'Dynamic Programming',
    'Greedy Algorithm',
    'Backtracking Algorithm',
    'Divide and Conquer',
    'Two Pointers Technique',
    'Sliding Window Technique',
    'Binary Search Tree',
    'AVL Tree',
    'Red-Black Tree',
    'B-Tree',
    'Trie Data Structure',
    'Hash Table',
    'Stack and Queue',
    'Linked List',
    'Graph Algorithms',
    'String Matching',
    'Pattern Recognition',
    'Machine Learning Algorithms',
    'Cryptographic Algorithms',
    'Compression Algorithms',
    'KMP Algorithm',
    'Rabin-Karp Algorithm',
    'Boyer-Moore Algorithm',
    'Longest Common Subsequence',
    'Longest Increasing Subsequence',
    'Edit Distance',
    'Knapsack Problem',
    'Activity Selection',
    'Huffman Coding',
    'Topological Sort',
    'Strongly Connected Components',
    'Minimum Spanning Tree',
    'Segment Tree',
    'Fenwick Tree',
    'Splay Tree',
    'Treap',
    'Manacher Algorithm',
    'Z Algorithm',
    'Suffix Array',
    'Longest Palindromic Substring',
    'Meet in the Middle',
    'Mo Algorithm',
    'Heavy Light Decomposition',
    'Centroid Decomposition',
    'Euler Tour',
    'Lowest Common Ancestor',
    'Range Queries',
    'Matrix Chain Multiplication',
    'Coin Change Problem',
    'Fibonacci Sequence',
    'Climbing Stairs',
    'House Robber',
    'Word Break',
    'Fractional Knapsack',
    'Job Scheduling',
    'Interval Scheduling',
    'Tim Sort',
    'Cocktail Sort',
    'Gnome Sort',
    'Comb Sort',
    'Interpolation Search',
    'Exponential Search',
    'Jump Search',
    'Fibonacci Search',
    'Ternary Search'
  ];

  const complexityLevels = [
    { value: 'simple', label: 'Simple', icon: '📖', description: 'Basic explanation with key concepts' },
    { value: 'detailed', label: 'Detailed', icon: '📚', description: 'Comprehensive explanation with examples' },
    { value: 'advanced', label: 'Advanced', icon: '🎯', description: 'In-depth analysis with optimizations' }
  ];

  const [filteredAlgorithms, setFilteredAlgorithms] = useState<string[]>([]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData({ ...formData, algorithmName: value });
    
    if (value.trim()) {
      const filtered = sampleAlgorithms.filter(algorithm =>
        algorithm.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredAlgorithms(filtered);
      setShowDropdown(true);
    } else {
      setFilteredAlgorithms([]);
      setShowDropdown(false);
    }
  };

  const handleAlgorithmSelect = (algorithm: string) => {
    setFormData({ ...formData, algorithmName: algorithm });
    setSearchTerm(algorithm);
    setShowDropdown(false);
    setFilteredAlgorithms([]);
  };

  const getHowItWorksSteps = (howItWorks: string | undefined): string[] => {
    if (!howItWorks) return [];
    
    if (typeof howItWorks === 'string') {
      return howItWorks.split('\n').filter(step => step.trim());
    }
    
    return [];
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.algorithmName.trim()) {
      newErrors.algorithmName = 'Algorithm name is required';
    } else if (formData.algorithmName.trim().length < 2) {
      newErrors.algorithmName = 'Algorithm name must be at least 2 characters';
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
    setExplanation(null);

    try {
      const response = await aiToolsAPI.explainAlgorithm(formData) as { data: AlgorithmExplanation };
      setExplanation(response.data);
      toast.success('Algorithm explanation generated successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Explain ${formData.algorithmName} algorithm with ${formData.complexity} complexity level` },
              { role: 'assistant', content: JSON.stringify(response.data, null, 2) },
            ], token);
          }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('Algorithm explanation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to explain algorithm';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      algorithmName: '',
      complexity: 'detailed'
    });
    setExplanation(null);
    setErrors({});
    setSearchTerm('');
    setShowDropdown(false);
    setFilteredAlgorithms([]);
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
                🧮
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Algorithm Explainer
                </h1>
                <p className="text-gray-300 text-lg">
                  Get detailed explanations of algorithms with step-by-step breakdowns, implementations, and real-world applications.
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🔍</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Explain Algorithm</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="algorithmName" className="block text-sm font-medium text-gray-300 mb-2">
                    Algorithm Name
                  </label>
                  <div className="relative">
                    <input
                      id="algorithmName"
                      name="algorithmName"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      onFocus={() => setShowDropdown(true)}
                      className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 text-sm transition-all duration-300 ${errors.algorithmName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                      placeholder="Search algorithms... (e.g., Binary Search, Quick Sort, Dijkstra)"
                    />
                    
                    {/* Search Dropdown */}
                    {showDropdown && (filteredAlgorithms.length > 0 || searchTerm.trim()) && (
                      <div ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-black/90 backdrop-blur-xl border border-purple-600/50 rounded-xl max-h-60 overflow-y-auto">
                        {filteredAlgorithms.length > 0 ? (
                          filteredAlgorithms.slice(0, 10).map((algorithm, index) => (
                            <motion.button
                              key={algorithm}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleAlgorithmSelect(algorithm)}
                              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-purple-600/20 hover:text-white transition-colors border-b border-purple-600/20 last:border-b-0"
                            >
                              {algorithm}
                            </motion.button>
                          ))
                        ) : searchTerm.trim() && (
                          <div className="px-4 py-3 text-sm text-gray-400">
                            No algorithms found matching "{searchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {errors.algorithmName && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.algorithmName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="complexity" className="block text-sm font-medium text-gray-300 mb-2">
                    Complexity Level
                  </label>
                  <select
                    id="complexity"
                    name="complexity"
                    value={formData.complexity}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {complexityLevels.map((level) => (
                      <option key={level.value} value={level.value} className="text-white bg-black">
                        {level.icon} {level.label}
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
                        Explaining...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🧮</span>
                        Explain Algorithm
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
                  Popular Algorithms
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Binary Search',
                    'Quick Sort',
                    'Merge Sort',
                    'Dijkstra Algorithm',
                    'Breadth-First Search',
                    'Depth-First Search',
                    'Dynamic Programming',
                    'Greedy Algorithm'
                  ].map((algorithm) => (
                    <motion.button
                      key={algorithm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAlgorithmSelect(algorithm)}
                      className="text-left p-3 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-white rounded-lg transition-all duration-300 border border-blue-600/30 hover:border-blue-500/50"
                    >
                      {algorithm}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Explanation Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📚</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Algorithm Explanation</h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm">AI is explaining the algorithm...</p>
                  </div>
                </div>
              ) : explanation ? (
                <div className="space-y-6 flex-1 overflow-y-auto">
                  {/* Overview */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">📋 Overview</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <p className="text-gray-300 text-sm leading-relaxed">{explanation.description || 'No description available'}</p>
                    </div>
                  </div>

                  {/* How It Works */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">⚙️ How It Works</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="space-y-3">
                        {(() => {
                          const steps = getHowItWorksSteps(explanation.howItWorks);
                          if (steps.length > 0) {
                            return steps.map((step, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {index + 1}
                                </div>
                                <p className="text-gray-300 text-sm">{step}</p>
                              </div>
                            ));
                          } else {
                            return <p className="text-gray-400 text-sm">No step-by-step explanation available</p>;
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Implementation */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">💻 Implementation</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="mb-3">
                        <span className="text-xs text-gray-400">Pseudocode:</span>
                        <pre className="bg-black/50 p-3 rounded-lg border border-purple-600/50 text-xs text-gray-300 font-mono overflow-x-auto">
                          {explanation.pseudocode || 'No pseudocode available'}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Complexity */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">📊 Complexity Analysis</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div className="text-center p-2 bg-green-600/20 rounded border border-green-600/50">
                          <div className="text-xs text-gray-400">Time Complexity</div>
                          <div className="text-green-300 font-mono text-xs">
                            {explanation.timeComplexity || 'N/A'}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-blue-600/20 rounded border border-blue-600/50">
                          <div className="text-xs text-gray-400">Space Complexity</div>
                          <div className="text-blue-300 font-mono text-sm">{explanation.spaceComplexity || 'N/A'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Use Cases */}
                  {explanation.useCases && explanation.useCases.length > 0 && (
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">🎯 Use Cases</h3>
                      <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                        <div className="grid grid-cols-1 gap-2">
                          {explanation.useCases.slice(0, 4).map((useCase, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-green-400 text-sm">✓</span>
                              <span className="text-gray-300 text-sm">{useCase}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Example */}
                  {explanation.example && (
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">📝 Example</h3>
                      <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                        <p className="text-gray-300 text-sm">{explanation.example}</p>
                      </div>
                    </div>
                  )}

                  {/* Advantages & Disadvantages */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">✅ Advantages</h3>
                      <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                        <div className="space-y-2">
                          {explanation.advantages && explanation.advantages.slice(0, 3).map((advantage, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-green-400 text-sm">•</span>
                              <span className="text-gray-300 text-sm">{advantage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">❌ Disadvantages</h3>
                      <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                        <div className="space-y-2">
                          {explanation.disadvantages && explanation.disadvantages.slice(0, 3).map((disadvantage, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-red-400 text-sm">•</span>
                              <span className="text-gray-300 text-sm">{disadvantage}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🧮</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Enter an algorithm name to get a detailed explanation.
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

export default AlgorithmExplainer; 