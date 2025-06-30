import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  domain: string;
  experienceLevel: string;
  focusAreas: string[];
}

interface Roadmap {
  domain: string;
  experienceLevel: string;
  estimatedDuration: string;
  overview: string;
  prerequisites: string[];
  phases: Array<{
    name: string;
    description: string;
    topics: string[];
    duration: string;
    resources: string[];
  }>;
  advancedTopics: string[];
  careerPaths: string[];
  tips: string[];
  tools: string[];
  communities: string[];
}

interface FormErrors {
  domain?: string;
}

const RoadmapGenerater: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    domain: '',
    experienceLevel: 'beginner',
    focusAreas: []
  });
  const [generatedRoadmap, setGeneratedRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { getToken, isSignedIn } = useAuth();

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', color: 'from-green-500 to-emerald-500' },
    { value: 'intermediate', label: 'Intermediate', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
    { value: 'advanced', label: 'Advanced', icon: '⚡', color: 'from-purple-500 to-pink-500' }
  ];

  const focusAreas = [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Cloud Computing',
    'Cybersecurity',
    'Game Development',
    'Blockchain',
    'AI/ML',
    'UI/UX Design',
    'Database Management',
    'System Design'
  ];

  const sampleDomains = [
    'Web Development',
    'Mobile App Development',
    'Data Science',
    'Machine Learning',
    'DevOps Engineering',
    'Cloud Architecture',
    'Cybersecurity',
    'Game Development',
    'Blockchain Development',
    'UI/UX Design'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const handleFocusAreaChange = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else if (formData.domain.trim().length < 2) {
      newErrors.domain = 'Domain must be at least 2 characters';
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
    setGeneratedRoadmap(null);

    try {
      const response = await aiToolsAPI.generateRoadmap(formData) as { data: Roadmap };
      setGeneratedRoadmap(response.data);
      toast.success('Learning roadmap generated successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Generate learning roadmap for ${formData.domain} (${formData.experienceLevel} level)` },
              { role: 'assistant', content: JSON.stringify(response.data, null, 2) },
            ], token);
          }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('Roadmap generation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate roadmap';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      domain: '',
      experienceLevel: 'beginner',
      focusAreas: []
    });
    setGeneratedRoadmap(null);
    setErrors({});
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
                🗺️
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Learning Roadmap Generator
                </h1>
                <p className="text-gray-300 text-lg">
                  Create personalized learning paths for any technology or domain with AI-powered recommendations.
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
                  <span className="text-sm">🎯</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generate Roadmap</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Domain
                  </label>
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    value={formData.domain}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 text-sm transition-all duration-300 ${errors.domain ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                    placeholder="e.g., Web Development, Data Science, Machine Learning..."
                  />
                  {errors.domain && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.domain}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level.value} value={level.value} className="text-white bg-black">
                        {level.icon} {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Focus Areas (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {focusAreas.map((area) => (
                      <motion.button
                        key={area}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFocusAreaChange(area)}
                        className={`p-2 text-xs rounded-lg transition-all duration-300 border ${
                          formData.focusAreas.includes(area)
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                            : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {area}
                      </motion.button>
                    ))}
                  </div>
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
                        Generating Roadmap...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Generate Roadmap
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

              {/* Sample Domains */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Popular Domains
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sampleDomains.slice(0, 5).map((domain) => (
                    <motion.button
                      key={domain}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, domain })}
                      className="text-left p-3 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-white rounded-lg transition-all duration-300 border border-blue-600/30 hover:border-blue-500/50"
                    >
                      {domain}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generated Roadmap Results */}
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
                <h2 className="text-xl font-semibold text-purple-300">Learning Roadmap</h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm">AI is creating your personalized learning roadmap...</p>
                  </div>
                </div>
              ) : generatedRoadmap ? (
                <div className="space-y-6 flex-1 overflow-y-auto">
                  {/* Roadmap Overview */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">📋 Overview</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {typeof generatedRoadmap.overview === 'object' ? (
                          <pre>{JSON.stringify(generatedRoadmap.overview, null, 2)}</pre>
                        ) : (
                          generatedRoadmap.overview
                        )}
                      </p>
                      <div className="mt-3 flex items-center space-x-4 text-xs">
                        <span className="text-purple-300">⏱️ {generatedRoadmap.estimatedDuration}</span>
                        <span className="text-cyan-300">📊 {generatedRoadmap.experienceLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Learning Phases */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">🎯 Learning Phases</h3>
                    <div className="space-y-3">
                      {generatedRoadmap.phases.map((phase, index) => (
                        <motion.div
                          key={phase.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-black/50 p-4 rounded-xl border border-purple-600/50"
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <h4 className="text-white font-medium">
                              {typeof phase.name === 'object' ? JSON.stringify(phase.name) : phase.name}
                            </h4>
                            <span className="text-xs text-cyan-300">⏱️ {phase.duration}</span>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">
                            {typeof phase.description === 'object' ? (
                              <pre>{JSON.stringify(phase.description, null, 2)}</pre>
                            ) : (
                              phase.description
                            )}
                          </p>
                          <div className="space-y-1">
                            {phase.topics.slice(0, 3).map((topic, topicIndex) => (
                              <div key={topicIndex} className="text-xs text-gray-400 flex items-center">
                                <span className="mr-2">•</span>
                                {typeof topic === 'object' ? (
                                  <pre>{JSON.stringify(topic, null, 2)}</pre>
                                ) : (
                                  topic
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Resources */}
                  {generatedRoadmap.tools.length > 0 && (
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">🛠️ Tools & Resources</h3>
                      <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                        <div className="flex flex-wrap gap-2">
                          {generatedRoadmap.tools.slice(0, 6).map((tool, index) => (
                            <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded border border-purple-600/50">
                              {typeof tool === 'object' ? (
                                <pre>{JSON.stringify(tool, null, 2)}</pre>
                              ) : (
                                tool
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🗺️</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Enter a domain to generate your personalized learning roadmap.
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

export default RoadmapGenerater; 