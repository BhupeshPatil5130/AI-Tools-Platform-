import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const Home: React.FC = () => {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: '💻',
      title: 'AI Code Generator',
      description: 'Generate production-ready code in multiple languages with intelligent suggestions and best practices.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/code-generator',
      gradient: 'from-gray-500/20 to-gray-600/20'
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmaps',
      description: 'Create personalized learning paths for any technology or domain with AI-powered recommendations.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/roadmap-generator',
      gradient: 'from-gray-500/20 to-gray-600/20'
    },
    {
      icon: '📊',
      title: 'Complexity Analyzer',
      description: 'Analyze time and space complexity of your algorithms with detailed insights and optimization tips.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/time-complexity',
      gradient: 'from-gray-500/20 to-gray-600/20'
    },
    {
      icon: '🧮',
      title: 'Algorithm Explainer',
      description: 'Get comprehensive explanations of algorithms with examples, complexity analysis, and use cases.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/algorithm-explainer',
      gradient: 'from-gray-500/20 to-gray-600/20'
    },
    {
      icon: '🔌',
      title: 'API Generator',
      description: 'Generate RESTful APIs with proper documentation, validation, and error handling.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/api-generator',
      gradient: 'from-gray-500/20 to-gray-600/20'
    },
    {
      icon: '🎨',
      title: 'Frontend Developer',
      description: 'Create beautiful frontend components and pages with modern frameworks and responsive design.',
      color: 'from-gray-400 to-gray-600',
      path: '/dashboard/frontend-developer',
      gradient: 'from-gray-500/20 to-gray-600/20'
    }
  ];

  const stats = [
    { number: '6+', label: 'AI Tools', icon: '⚡' },
    { number: '10+', label: 'Languages', icon: '🌐' },
    { number: '24/7', label: 'Availability', icon: '🕒' },
    { number: '100%', label: 'Free', icon: '🎉' }
  ];

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Senior Developer",
      company: "TechCorp",
      content: "This AI suite has revolutionized our development workflow. The code generation is incredibly accurate!",
      avatar: "👨‍💻"
    },
    {
      name: "Sarah Johnson",
      role: "Full Stack Engineer",
      company: "StartupXYZ",
      content: "The algorithm explainer helped me understand complex concepts in minutes. Game changer!",
      avatar: "👩‍💻"
    },
    {
      name: "Mike Rodriguez",
      role: "Tech Lead",
      company: "InnovateLab",
      content: "Best AI development tools I've ever used. The API generator saves us hours of work.",
      avatar: "👨‍🔬"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-gray-600/20 backdrop-blur-sm border border-gray-400/30 rounded-full px-6 py-3 mb-6">
              <span className="text-gray-300">🚀</span>
              <span className="text-gray-200 text-sm font-medium">Advanced AI Development Suite</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-white">Development Tools</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your development workflow with our suite of intelligent AI tools. 
              Generate code, analyze algorithms, create roadmaps, and build APIs faster than ever before.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
                  >
                    <span>⚡</span>
                    <span>Go to Dashboard</span>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
                  >
                    <span>🚀</span>
                    <span>Get Started</span>
                  </Link>
                </motion.div>
              )}
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="#features"
                  className="inline-flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border border-gray-600/50"
                >
                  <span>🔍</span>
                  <span>Explore Features</span>
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-300">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                Powerful AI Tools
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to accelerate your development process with the power of artificial intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={feature.path}>
                  <div className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-xl border border-gray-500/20 rounded-2xl p-6 h-full transition-all duration-300 hover:border-gray-400/40 hover:bg-gradient-to-br from-gray-600/30 to-gray-700/30`}>
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-gray-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-gray-300 text-sm font-medium group-hover:text-gray-200 transition-colors">
                      <span>Try it now</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                What Developers Say
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of developers who trust our AI tools to accelerate their development process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-600/30 rounded-2xl p-6 h-full hover:border-gray-500/50 transition-all duration-300">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-300 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gray-600/20 to-gray-700/20 backdrop-blur-xl border border-gray-500/30 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="text-white">Your Development?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of developers who are already using AI to build better software faster.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
              >
                <span>🚀</span>
                <span>Start Building Now</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
