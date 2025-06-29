import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const Profile: React.FC = () => {
  const { user } = useUser();

  const profileStats = [
    {
      label: 'Tools Used',
      value: '6',
      icon: '🛠️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'Chats Created',
      value: '12',
      icon: '💬',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      label: 'Code Generated',
      value: '24',
      icon: '💻',
      color: 'from-green-500 to-emerald-500'
    },
    {
      label: 'Projects',
      value: '8',
      icon: '📁',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivity = [
    {
      action: 'Generated React component',
      tool: 'Code Generator',
      time: '2 hours ago',
      icon: '💻'
    },
    {
      action: 'Created learning roadmap',
      tool: 'Roadmap Generator',
      time: '1 day ago',
      icon: '🗺️'
    },
    {
      action: 'Analyzed algorithm complexity',
      tool: 'Time Complexity',
      time: '2 days ago',
      icon: '📊'
    },
    {
      action: 'Generated API endpoints',
      tool: 'API Generator',
      time: '3 days ago',
      icon: '🔌'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Profile</h1>
              <p className="text-gray-300">Manage your account and view your activity</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-400 text-sm mb-4">@{user?.username}</p>
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl px-4 py-2">
                  <span className="text-purple-300 text-sm font-medium">Premium Developer</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                    📧
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-gray-400 text-xs">{user?.emailAddresses[0]?.emailAddress}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-sm">
                    📅
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Member Since</p>
                    <p className="text-gray-400 text-xs">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-black/30 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-sm">
                    🔒
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Status</p>
                    <p className="text-green-400 text-xs">Verified Account</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25">
                Edit Profile
              </button>
            </div>
          </motion.div>

          {/* Stats and Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stats Grid */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📊</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Your Stats</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileStats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 text-center transition-all duration-300 hover:border-opacity-60 hover:shadow-lg hover:shadow-purple-500/10">
                      <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center text-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-gray-400 text-sm">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-4 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-lg">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-gray-400 text-sm">{activity.tool}</p>
                      </div>
                      <div className="text-gray-500 text-sm">{activity.time}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-white">Skills & Expertise</h2>
              </div>

              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'MongoDB'].map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-xl p-3 text-center hover:border-opacity-60 transition-all duration-300"
                    >
                      <span className="text-white font-medium">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  </div>
);
};

export default Profile; 