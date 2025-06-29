import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();

  const sidebarItems = [
    {
      icon: '🏠',
      title: 'Dashboard',
      path: '/dashboard',
      color: 'from-purple-500 to-cyan-500'
    },
    {
      icon: '🎨',
      title: 'Frontend Developer',
      path: '/dashboard/frontend-developer',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: '💻',
      title: 'Code Generator',
      path: '/dashboard/code-generator',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🗺️',
      title: 'Roadmap Generator',
      path: '/dashboard/roadmap-generator',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '📊',
      title: 'Time Complexity',
      path: '/dashboard/time-complexity',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🧮',
      title: 'Algorithm Explainer',
      path: '/dashboard/algorithm-explainer',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔌',
      title: 'API Generator',
      path: '/dashboard/api-generator',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '💬',
      title: 'Recent Chats',
      path: '/dashboard/recent-chats',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  // Show dashboard home content only when on /dashboard route
  const isDashboardHome = location.pathname === '/dashboard';

  return (
    <div className="h-screen flex">
      {/* Sidebar - Fixed Height, Non-scrollable */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-64 bg-black/80 backdrop-blur-xl border-r border-purple-500/20 flex-shrink-0 h-screen"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-purple-500/20 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
                🚀
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Dev Tools</h2>
                <p className="text-xs text-gray-400">Development Suite</p>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation - Fixed, Non-scrollable */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  location.pathname === item.path
                    ? 'bg-purple-600/20 border border-purple-500/50 text-purple-300'
                    : 'text-gray-300 hover:bg-black/50 hover:text-white hover:border border-purple-500/30'
                }`}
              >
                <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-sm group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <span className="font-medium text-sm">{item.title}</span>
              </Link>
        ))}
      </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-purple-500/20 flex-shrink-0">
            <div className="bg-black/50 rounded-xl p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {user?.firstName || user?.username || 'User'}
                  </p>
                  <p className="text-gray-400 text-xs">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Content Area */}
        <div className="py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Show Dashboard Home Content or Outlet */}
            {isDashboardHome ? (
              <>
                {/* Welcome Header */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-12"
                >
                  <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl">
                        👋
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold text-white">
                          Welcome back, {user?.firstName || user?.username || 'Developer'}!
                        </h1>
                        <p className="text-gray-300 text-lg">
                          Ready to build something amazing with AI?
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-300">6</div>
                        <div className="text-sm text-gray-300">AI Tools Available</div>
                      </div>
                      <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-cyan-300">24/7</div>
                        <div className="text-sm text-gray-300">AI Assistance</div>
                      </div>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-300">100%</div>
                        <div className="text-sm text-gray-300">Free to Use</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* AI Tools Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⚡</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">AI Development Tools</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        icon: '💻',
                        title: 'Code Generator',
                        description: 'Generate production-ready code in multiple programming languages with AI assistance.',
                        path: '/dashboard/code-generator',
                        color: 'from-purple-500 to-pink-500',
                        gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
                        border: 'border-purple-500/30'
                      },
                      {
                        icon: '🗺️',
                        title: 'Roadmap Generator',
                        description: 'Create personalized learning roadmaps for any technology or domain.',
                        path: '/dashboard/roadmap-generator',
                        color: 'from-blue-500 to-cyan-500',
                        gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
                        border: 'border-blue-500/30'
                      },
                      {
                        icon: '📊',
                        title: 'Time Complexity Analyzer',
                        description: 'Analyze the time and space complexity of your algorithms with detailed insights.',
                        path: '/dashboard/time-complexity',
                        color: 'from-green-500 to-emerald-500',
                        gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
                        border: 'border-green-500/30'
                      },
                      {
                        icon: '🧮',
                        title: 'Algorithm Explainer',
                        description: 'Get comprehensive explanations of algorithms with examples and use cases.',
                        path: '/dashboard/algorithm-explainer',
                        color: 'from-orange-500 to-red-500',
                        gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
                        border: 'border-orange-500/30'
                      },
                      {
                        icon: '🔌',
                        title: 'API Generator',
                        description: 'Generate RESTful APIs with proper documentation and validation.',
                        path: '/dashboard/api-generator',
                        color: 'from-indigo-500 to-purple-500',
                        gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
                        border: 'border-indigo-500/30'
                      },
                      {
                        icon: '🎨',
                        title: 'Frontend Developer',
                        description: 'Create beautiful frontend components with modern frameworks and responsive design.',
                        path: '/dashboard/frontend-developer',
                        color: 'from-pink-500 to-rose-500',
                        gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
                        border: 'border-pink-500/30'
                      }
                    ].map((tool, index) => (
                      <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group"
                      >
                        <Link to={tool.path}>
                          <div className={`${tool.gradient} backdrop-blur-xl border ${tool.border} rounded-2xl p-6 h-full transition-all duration-300 hover:border-opacity-60 hover:shadow-2xl hover:shadow-purple-500/10`}>
                            <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                              {tool.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-4">
                              {tool.description}
                            </p>
                            <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                              <span>Launch Tool</span>
                              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="mb-12"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🚀</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: '💬',
                        title: 'Recent Chats',
                        description: 'View your conversation history',
                        path: '/dashboard/recent-chats',
                        color: 'from-cyan-500 to-blue-500'
                      }
                    ].map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="group"
                      >
                        <Link to={action.path}>
                          <div className="bg-black/40 backdrop-blur-xl border border-gray-600/30 rounded-xl p-6 transition-all duration-300 hover:border-purple-500/50 hover:bg-black/60">
                            <div className="flex items-center space-x-4">
                              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300`}>
                                {action.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                                  {action.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Getting Started */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📈</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">Getting Started</h2>
                  </div>

                  <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                        <div className="text-purple-300 text-sm font-medium mb-2">1. Choose a Tool</div>
                        <p className="text-gray-400 text-xs">Select from our collection of AI-powered development tools</p>
                      </div>
                      <div className="bg-cyan-600/20 border border-cyan-500/30 rounded-xl p-4">
                        <div className="text-cyan-300 text-sm font-medium mb-2">2. Describe Your Needs</div>
                        <p className="text-gray-400 text-xs">Provide clear requirements for the best AI assistance</p>
                      </div>
                      <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-4">
                        <div className="text-green-300 text-sm font-medium mb-2">3. Get Results</div>
                        <p className="text-gray-400 text-xs">Receive high-quality, production-ready code and solutions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            ) : (
              // Render child routes using Outlet
      <Outlet />
            )}
          </div>
        </div>
      </div>
  </div>
);
};

export default Dashboard; 