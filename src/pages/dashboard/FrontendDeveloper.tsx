import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  description: string;
  framework: string;
  features: string;
  styling: string;
}

interface FrontendCode {
  description: string;
  framework: string;
  features: string;
  styling: string;
  implementation: string;
  timestamp: string;
}

interface FormErrors {
  description?: string;
}

interface CodeFile {
  name: string;
  content: string;
  language: string;
}

const FrontendDeveloper: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    framework: 'html-css-js',
    features: '',
    styling: 'modern'
  });
  const [generatedFrontend, setGeneratedFrontend] = useState<FrontendCode | null>(null);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const { getToken, isSignedIn } = useAuth();

  const frameworks = [
    { value: 'html-css-js', label: 'HTML/CSS/JavaScript', icon: '🌐', color: 'from-blue-500 to-cyan-500' },
    { value: 'react', label: 'React', icon: '⚛️', color: 'from-cyan-500 to-blue-600' },
    { value: 'angular', label: 'Angular', icon: '🅰️', color: 'from-red-500 to-pink-600' },
    { value: 'vue', label: 'Vue.js', icon: '💚', color: 'from-green-500 to-emerald-600' }
  ];

  const stylingOptions = [
    { value: 'modern', label: 'Modern & Clean', icon: '✨' },
    { value: 'minimal', label: 'Minimalist', icon: '⚪' },
    { value: 'colorful', label: 'Colorful & Vibrant', icon: '🌈' },
    { value: 'dark', label: 'Dark Theme', icon: '🌙' },
    { value: 'glassmorphism', label: 'Glassmorphism', icon: '💎' },
    { value: 'neomorphic', label: 'Neomorphic', icon: '🔲' }
  ];

  const sampleDescriptions = [
    'E-commerce product catalog with search and filters',
    'Todo app with drag and drop functionality',
    'Weather dashboard with real-time updates',
    'Social media feed with infinite scroll',
    'Dashboard with charts and analytics',
    'Portfolio website with animations',
    'Booking system with calendar integration',
    'Chat application with real-time messaging',
    'File upload interface with progress bar',
    'Multi-step form with validation'
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

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const parseCodeFiles = (implementation: string, framework: string): CodeFile[] => {
    const files: CodeFile[] = [];
    
    if (framework === 'html-css-js') {
      // Split HTML, CSS, and JS more effectively
      const htmlMatch = implementation.match(/<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>/i);
      const cssMatch = implementation.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      const jsMatch = implementation.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      
      // Extract HTML content
      if (htmlMatch) {
        let htmlContent = htmlMatch[0];
        
        // Remove style and script tags from HTML
        htmlContent = htmlContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        htmlContent = htmlContent.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        
        files.push({
          name: 'index.html',
          content: htmlContent.trim(),
          language: 'html'
        });
      }
      
      // Extract CSS content
      if (cssMatch && cssMatch.length > 0) {
        let cssContent = '';
        cssMatch.forEach(match => {
          const cssText = match.replace(/<style[^>]*>|<\/style>/gi, '');
          cssContent += cssText + '\n';
        });
        
        if (cssContent.trim()) {
          files.push({
            name: 'styles.css',
            content: cssContent.trim(),
            language: 'css'
          });
        }
      }
      
      // Extract JavaScript content
      if (jsMatch && jsMatch.length > 0) {
        let jsContent = '';
        jsMatch.forEach(match => {
          const jsText = match.replace(/<script[^>]*>|<\/script>/gi, '');
          jsContent += jsText + '\n';
        });
        
        if (jsContent.trim()) {
          files.push({
            name: 'script.js',
            content: jsContent.trim(),
            language: 'javascript'
          });
        }
      }
      
      // If no specific files were found, create a single HTML file
      if (files.length === 0) {
        files.push({
          name: 'index.html',
          content: implementation,
          language: 'html'
        });
      }
    } else if (framework === 'react') {
      // Keep React code in a single file
      files.push({
        name: 'App.jsx',
        content: implementation,
        language: 'jsx'
      });
    } else if (framework === 'angular') {
      // Keep Angular code in a single file
      files.push({
        name: 'app.component.ts',
        content: implementation,
        language: 'typescript'
      });
    } else if (framework === 'vue') {
      // Keep Vue code in a single file
      files.push({
        name: 'App.vue',
        content: implementation,
        language: 'vue'
      });
    }
    
    // If no specific parsing worked, create a single file
    if (files.length === 0) {
      files.push({
        name: 'main.' + getFileExtension(framework),
        content: implementation,
        language: getLanguageForFramework(framework)
      });
    }
    
    return files;
  };

  const getFileExtension = (framework: string): string => {
    switch (framework) {
      case 'react': return 'jsx';
      case 'angular': return 'ts';
      case 'vue': return 'vue';
      default: return 'html';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneratedFrontend(null);
    setCodeFiles([]);

    try {
      const response = await aiToolsAPI.generateFrontend(formData) as { data: FrontendCode };
      setGeneratedFrontend(response.data);
      
      // Parse the implementation into separate files
      const files = parseCodeFiles(response.data.implementation, response.data.framework);
      setCodeFiles(files);
      if (files.length > 0) {
        setActiveFile(files[0].name);
      }
      
      toast.success('Frontend code generated successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Generate frontend code for: ${formData.description} using ${formData.framework}` },
              { role: 'assistant', content: response.data.implementation },
            ], token);
          }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('Frontend generation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate frontend code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      description: '',
      framework: 'html-css-js',
      features: '',
      styling: 'modern'
    });
    setGeneratedFrontend(null);
    setCodeFiles([]);
    setActiveFile('');
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

  const getLanguageForFramework = (framework: string) => {
    switch (framework) {
      case 'react': return 'jsx';
      case 'angular': return 'typescript';
      case 'vue': return 'vue';
      default: return 'html';
    }
  };

  const getActiveFileContent = () => {
    return codeFiles.find(file => file.name === activeFile)?.content || '';
  };

  const getActiveFileLanguage = () => {
    return codeFiles.find(file => file.name === activeFile)?.language || 'text';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'html': return '🌐';
      case 'css': return '🌈';
      case 'js': return '⚡';
      case 'jsx': return '⚛️';
      case 'ts': return '🅰️';
      case 'vue': return '💚';
      default: return '📄';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
      {/* AI Agent Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-8 pb-6">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-2xl animate-pulse">
                  🤖
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI Frontend Developer Agent
                </h1>
                <p className="text-gray-300 text-sm">
                  Advanced AI-powered frontend code generation with intelligent file structuring
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto px-4 pb-8">
        {/* AI Agent Input Panel */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
              <h2 className="text-xl font-semibold text-purple-300">Project Configuration</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Project Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 resize-none text-sm px-4 py-3 transition-all duration-300 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                  placeholder="Describe your frontend project in detail..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <span className="mr-1">⚠️</span>
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="framework" className="block text-sm font-medium text-gray-300 mb-2">
                    Framework
                  </label>
                  <select
                    id="framework"
                    name="framework"
                    value={formData.framework}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {frameworks.map((fw) => (
                      <option key={fw.value} value={fw.value} className="text-white bg-black">
                        {fw.icon} {fw.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="styling" className="block text-sm font-medium text-gray-300 mb-2">
                    Styling
                  </label>
                  <select
                    id="styling"
                    name="styling"
                    value={formData.styling}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {stylingOptions.map((style) => (
                      <option key={style.value} value={style.value} className="text-white bg-black">
                        {style.icon} {style.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Features
                </label>
                <input
                  id="features"
                  name="features"
                  type="text"
                  value={formData.features}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 text-sm transition-all duration-300"
                  placeholder="e.g., Responsive design, animations, form validation..."
                />
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
                      AI Agent Working...
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

            {/* Sample Projects */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <span className="mr-2">💡</span>
                Quick Start Templates
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sampleDescriptions.slice(0, 4).map((desc) => (
                  <motion.button
                    key={desc}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, description: desc })}
                    className="text-left p-3 text-xs bg-purple-600/20 hover:bg-purple-600/30 text-white rounded-lg transition-all duration-300 border border-purple-600/30 hover:border-purple-500/50"
                  >
                    {desc}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Agent Code Output */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-4 border-b border-purple-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💻</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generated Code Structure</h2>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <p className="text-gray-300 text-sm">AI Agent is analyzing and generating your code...</p>
                </div>
              </div>
            ) : generatedFrontend && codeFiles.length > 0 ? (
              <div className="h-[600px] flex flex-col">
                {/* File Tabs */}
                <div className="bg-gray-900/50 border-b border-purple-500/30 p-2">
                  <div className="flex space-x-1 overflow-x-auto">
                    {codeFiles.map((file) => (
                      <motion.button
                        key={file.name}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFile(file.name)}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 whitespace-nowrap flex items-center space-x-2 ${
                          activeFile === file.name
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        <span>{getFileIcon(file.name)}</span>
                        <span>{file.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Code Display */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center p-3 bg-gray-900/30 border-b border-purple-500/20">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">
                        {getFileIcon(activeFile)} {activeFile}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({getActiveFileLanguage().toUpperCase()})
                      </span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyToClipboard(getActiveFileContent())}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs py-1 px-3 rounded-lg transition-colors"
                    >
                      📋 Copy
                    </motion.button>
                  </div>
                  <div className="h-full overflow-auto">
                    <SyntaxHighlighter
                      language={getActiveFileLanguage()}
                      style={tomorrow}
                      customStyle={{
                        margin: 0,
                        fontSize: '12px',
                        lineHeight: '1.4',
                        background: 'transparent',
                        color: '#ffffff',
                        padding: '1rem',
                      }}
                      showLineNumbers={true}
                    >
                      {getActiveFileContent()}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center p-12">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎨</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Configure your project to generate intelligent frontend code
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrontendDeveloper; 