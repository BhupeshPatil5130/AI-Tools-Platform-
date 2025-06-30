import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';
import { SignInButton, SignOutButton } from '@clerk/clerk-react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '⚡' },
    { path: '/dashboard/code-generator', label: 'Code Generator', icon: '💻' },
    { path: '/dashboard/roadmap-generator', label: 'Roadmap', icon: '🗺️' },
    { path: '/dashboard/time-complexity', label: 'Complexity', icon: '📊' },
    { path: '/dashboard/algorithm-explainer', label: 'Algorithms', icon: '🧮' },
    { path: '/dashboard/api-generator', label: 'API Generator', icon: '🔌' },
    { path: '/dashboard/frontend-developer', label: 'Frontend', icon: '🎨' },
    { path: '/dashboard/recent-chats', label: 'Chats', icon: '💬' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-purple-500/20"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                🤖
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AI DevTools
                </h1>
                <p className="text-xs text-gray-400 -mt-1">Advanced AI Development Suite</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, 3).map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-purple-600/80 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName || user?.username}
                    </p>
                    <p className="text-xs text-gray-400">Welcome back!</p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <SignOutButton>
                    <button className="bg-red-600/80 hover:bg-red-500/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg">
                      Sign Out
                    </button>
                  </SignOutButton>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
            <SignInButton>
                  <button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                    Sign In
                  </button>
            </SignInButton>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-purple-500/20 fixed top-0 left-0 w-full h-full z-50 overflow-y-auto"
          >
            <div className="px-4 py-8 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.indexOf(item) * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center space-x-3 ${
                      isActive(item.path)
                        ? 'bg-purple-600/80 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-purple-600/20 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
