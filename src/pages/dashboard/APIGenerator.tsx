import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aiToolsAPI, chatAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '@clerk/clerk-react';

interface FormData {
  description: string;
  framework: string;
  features: string[];
  authentication: string;
  database: string;
}

interface GeneratedAPI {
  overview: string;
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
    parameters: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
    response: {
      status: number;
      data: any;
      description: string;
    };
  }>;
  models: Array<{
    name: string;
    fields: Array<{
      name: string;
      type: string;
      required: boolean;
      description: string;
    }>;
  }>;
  setup: {
    installation: string[];
    configuration: string[];
    environment: string[];
  };
  code: {
    server: string;
    routes: string;
    models: string;
    middleware: string;
  };
  testing: {
    examples: string[];
    tools: string[];
  };
  deployment: {
    platforms: string[];
    steps: string[];
  };
}

interface FormErrors {
  description?: string;
}

const APIGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    description: '',
    framework: 'express',
    features: [],
    authentication: 'jwt',
    database: 'mongodb'
  });
  const [generatedAPI, setGeneratedAPI] = useState<GeneratedAPI | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<number>>(new Set());
  const { getToken, isSignedIn } = useAuth();

  const frameworks = [
    { value: 'express', label: 'Express.js', icon: '⚡', color: 'from-green-500 to-emerald-500' },
    { value: 'fastapi', label: 'FastAPI', icon: '🐍', color: 'from-blue-500 to-cyan-500' },
    { value: 'spring', label: 'Spring Boot', icon: '☕', color: 'from-red-500 to-pink-500' },
    { value: 'django', label: 'Django', icon: '🐘', color: 'from-purple-500 to-violet-500' },
    { value: 'flask', label: 'Flask', icon: '🍶', color: 'from-orange-500 to-red-500' },
    { value: 'laravel', label: 'Laravel', icon: '🔥', color: 'from-red-600 to-pink-600' },
    { value: 'rails', label: 'Ruby on Rails', icon: '💎', color: 'from-red-600 to-pink-600' },
    { value: 'gin', label: 'Gin (Go)', icon: '🚀', color: 'from-cyan-500 to-blue-500' }
  ];

  const features = [
    'User Authentication',
    'File Upload',
    'Email Notifications',
    'Real-time Updates',
    'Data Validation',
    'Rate Limiting',
    'Caching',
    'Logging',
    'Error Handling',
    'API Documentation',
    'Testing Suite',
    'Database Migrations',
    'Search Functionality',
    'Pagination',
    'Filtering',
    'Sorting'
  ];

  const authenticationTypes = [
    { value: 'jwt', label: 'JWT Tokens', icon: '🔐' },
    { value: 'session', label: 'Session-based', icon: '🎫' },
    { value: 'oauth', label: 'OAuth 2.0', icon: '🔑' },
    { value: 'api-key', label: 'API Keys', icon: '🗝️' },
    { value: 'none', label: 'No Authentication', icon: '🚫' }
  ];

  const databases = [
    { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
    { value: 'postgresql', label: 'PostgreSQL', icon: '🐘' },
    { value: 'mysql', label: 'MySQL', icon: '🐬' },
    { value: 'sqlite', label: 'SQLite', icon: '💾' },
    { value: 'redis', label: 'Redis', icon: '🔴' },
    { value: 'firebase', label: 'Firebase', icon: '🔥' }
  ];

  const sampleAPIs = [
    'E-commerce API with product management and orders',
    'Social media API with posts, comments, and user profiles',
    'Task management API with projects and team collaboration',
    'Blog API with articles, categories, and comments',
    'File storage API with upload, download, and sharing',
    'Booking system API with reservations and availability',
    'Chat application API with real-time messaging',
    'Analytics API with data collection and reporting'
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

  const handleFeatureChange = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const toggleEndpointExpansion = (index: number) => {
    setExpandedEndpoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const generateEndpointCode = (endpoint: any, framework: string) => {
    if (framework === 'express') {
      return `app.${endpoint.method.toLowerCase()}('${endpoint.path}', async (req, res) => {
  try {
    // Extract parameters
    ${endpoint.parameters?.map((param: any) => 
      `const ${param.name} = req.${param.type === 'body' ? 'body' : 'params'}.${param.name};`
    ).join('\n    ') || '// No parameters required'}

    // Your business logic here
    // Example: const result = await YourModel.find({ ${endpoint.parameters?.map((p: any) => p.name).join(', ') || ''} });

    // Return response
    res.status(${endpoint.response.status}).json({
      success: true,
      data: ${JSON.stringify(endpoint.response.data, null, 2)},
      message: '${endpoint.response.description}'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});`;
    } else if (framework === 'fastapi') {
      return `@app.${endpoint.method.toLowerCase()}("${endpoint.path}")
async def ${endpoint.path.replace(/[^a-zA-Z0-9]/g, '_')}(${endpoint.parameters?.map((param: any) => 
  `${param.name}: ${param.type === 'string' ? 'str' : param.type === 'number' ? 'int' : 'bool'}`
).join(', ') || ''}):
    try:
        # Your business logic here
        # Example: result = await your_model.find({${endpoint.parameters?.map((p: any) => p.name).join(', ') || ''}})
        
        return {
            "success": True,
            "data": ${JSON.stringify(endpoint.response.data, null, 2)},
            "message": "${endpoint.response.description}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")`;
    } else {
      return `// ${framework} implementation
// Add your framework-specific code here`;
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'API description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'API description must be at least 10 characters';
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
    setGeneratedAPI(null);

    try {
      const response = await aiToolsAPI.generateAPI(formData) as { data: GeneratedAPI };
      setGeneratedAPI(response.data);
      toast.success('API generated successfully!');
      
      // Save chat if signed in
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            await chatAPI.saveChat([
              { role: 'user', content: `Generate ${formData.framework} API for: ${formData.description}` },
              { role: 'assistant', content: JSON.stringify(response.data, null, 2) },
            ], token);
          }
        } catch (chatError) {
          console.error('Failed to save chat:', chatError);
        }
      }
    } catch (error) {
      console.error('API generation error:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate API';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      description: '',
      framework: 'express',
      features: [],
      authentication: 'jwt',
      database: 'mongodb'
    });
    setGeneratedAPI(null);
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
                🔌
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI API Generator
                </h1>
                <p className="text-gray-300 text-lg">
                  Generate complete REST APIs with endpoints, models, authentication, and documentation.
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
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">⚙️</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generate API</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    API Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`w-full rounded-xl border-2 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 resize-none text-sm px-4 py-3 transition-all duration-300 ${errors.description ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-purple-600/50'}`}
                    placeholder="Describe your API requirements, entities, and functionality..."
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-400 flex items-center">
                      <span className="mr-1">⚠️</span>
                      {errors.description}
                    </p>
                  )}
                </div>

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
                    {frameworks.map((framework) => (
                      <option key={framework.value} value={framework.value} className="text-white bg-black">
                        {framework.icon} {framework.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="authentication" className="block text-sm font-medium text-gray-300 mb-2">
                    Authentication
                  </label>
                  <select
                    id="authentication"
                    name="authentication"
                    value={formData.authentication}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {authenticationTypes.map((auth) => (
                      <option key={auth.value} value={auth.value} className="text-white bg-black">
                        {auth.icon} {auth.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="database" className="block text-sm font-medium text-gray-300 mb-2">
                    Database
                  </label>
                  <select
                    id="database"
                    name="database"
                    value={formData.database}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 appearance-none transition-all duration-300 text-sm"
                  >
                    {databases.map((db) => (
                      <option key={db.value} value={db.value} className="text-white bg-black">
                        {db.icon} {db.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Features (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {features.map((feature) => (
                      <motion.button
                        key={feature}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleFeatureChange(feature)}
                        className={`p-2 text-xs rounded-lg transition-all duration-300 border ${
                          formData.features.includes(feature)
                            ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                            : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50'
                        }`}
                      >
                        {feature}
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
                        Generating API...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <span className="mr-2">🚀</span>
                        Generate API
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

              {/* Sample APIs */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Sample APIs
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {sampleAPIs.slice(0, 4).map((api, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, description: api })}
                      className="text-left p-3 text-xs bg-orange-600/20 hover:bg-orange-600/30 text-white rounded-lg transition-all duration-300 border border-orange-600/30 hover:border-orange-500/50"
                    >
                      {api}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Generated API Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🔌</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Generated API</h2>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div className="text-center">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-600/30 border-t-cyan-500 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    <p className="text-gray-300 text-sm">AI is generating your API...</p>
                  </div>
                </div>
              ) : generatedAPI ? (
                <div className="space-y-6 flex-1 overflow-y-auto">
                  {/* Overview */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">📋 Overview</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {typeof generatedAPI.overview === 'object' ? (
                          <pre>{JSON.stringify(generatedAPI.overview, null, 2)}</pre>
                        ) : (
                          generatedAPI.overview
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Endpoints */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">🔗 API Endpoints</h3>
                    <div className="space-y-3">
                      {generatedAPI.endpoints.slice(0, 4).map((endpoint, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-black/50 p-4 rounded-xl border border-purple-600/50"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 text-xs rounded font-mono ${
                                endpoint.method === 'GET' ? 'bg-green-600/20 text-green-300 border border-green-600/50' :
                                endpoint.method === 'POST' ? 'bg-blue-600/20 text-blue-300 border border-blue-600/50' :
                                endpoint.method === 'PUT' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-600/50' :
                                'bg-red-600/20 text-red-300 border border-red-600/50'
                              }`}>
                                {endpoint.method}
                              </span>
                              <span className="text-white font-mono text-sm">{endpoint.path}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleEndpointExpansion(index)}
                              className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {expandedEndpoints.has(index) ? '📄' : '💻'}
                            </motion.button>
                          </div>
                          <p className="text-gray-300 text-sm mb-3">
                            {typeof endpoint.description === 'object' ? (
                              <pre>{JSON.stringify(endpoint.description, null, 2)}</pre>
                            ) : (
                              endpoint.description
                            )}
                          </p>
                          
                          {/* Parameters */}
                          {endpoint.parameters && endpoint.parameters.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-xs font-medium text-purple-300 mb-2">Parameters:</h5>
                              <div className="space-y-1">
                                {endpoint.parameters.map((param, paramIndex) => (
                                  <div key={paramIndex} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">
                                      {typeof param.name === 'object' ? JSON.stringify(param.name) : param.name}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-purple-300 font-mono">
                                        {typeof param.type === 'object' ? JSON.stringify(param.type) : param.type}
                                      </span>
                                      {param.required && (
                                        <span className="text-red-400 text-xs">required</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Expandable Code Implementation */}
                          {expandedEndpoints.has(index) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4"
                            >
                              <div className="bg-black/70 p-4 rounded-lg border border-purple-600/30">
                                <h5 className="text-xs font-medium text-purple-300 mb-2 flex items-center">
                                  <span className="mr-2">💻</span>
                                  Implementation Code
                                </h5>
                                <pre className="text-xs text-green-300 overflow-x-auto whitespace-pre-wrap">
{generateEndpointCode(endpoint, formData.framework)}
                                </pre>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Models */}
                  {generatedAPI.models.length > 0 && (
                    <div>
                      <h3 className="font-medium text-purple-400 mb-3 text-sm">📊 Data Models</h3>
                      <div className="space-y-3">
                        {generatedAPI.models.slice(0, 2).map((model, index) => (
                          <div key={index} className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                            <h4 className="text-white font-medium mb-2">
                              {typeof model.name === 'object' ? JSON.stringify(model.name) : model.name}
                            </h4>
                            <div className="space-y-1">
                              {model.fields.slice(0, 4).map((field, fieldIndex) => (
                                <div key={fieldIndex} className="flex items-center justify-between text-xs">
                                  <span className="text-gray-300">
                                    {typeof field.name === 'object' ? JSON.stringify(field.name) : field.name}
                                  </span>
                                  <span className="text-purple-300 font-mono">
                                    {typeof field.type === 'object' ? JSON.stringify(field.type) : field.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Setup Instructions */}
                  <div>
                    <h3 className="font-medium text-purple-400 mb-3 text-sm">⚙️ Setup Instructions</h3>
                    <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50">
                      <div className="space-y-2">
                        {generatedAPI.setup.installation.slice(0, 3).map((step, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-purple-400 text-sm">•</span>
                            {typeof step === 'object' ? (
                              <pre>{JSON.stringify(step, null, 2)}</pre>
                            ) : (
                              <span className="text-gray-300 text-sm">{step}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">🔌</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Describe your API requirements to generate a complete implementation.
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

export default APIGenerator; 