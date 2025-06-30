import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    autoSave: true,
    codeHighlighting: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    dataSharing: false,
    analytics: true
  });

  const settingSections = [
    {
      icon: '🔔',
      title: 'Notifications',
      color: 'from-purple-500 to-pink-500',
      settings: [
        {
          key: 'email',
          label: 'Email Notifications',
          description: 'Receive updates about your account and tools',
          type: 'toggle'
        },
        {
          key: 'push',
          label: 'Push Notifications',
          description: 'Get real-time alerts in your browser',
          type: 'toggle'
        },
        {
          key: 'updates',
          label: 'Product Updates',
          description: 'Stay informed about new features',
          type: 'toggle'
        },
        {
          key: 'marketing',
          label: 'Marketing Emails',
          description: 'Receive promotional content and offers',
          type: 'toggle'
        }
      ]
    },
    {
      icon: '⚙️',
      title: 'Preferences',
      color: 'from-cyan-500 to-blue-500',
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'select',
          options: [
            { value: 'dark', label: 'Dark Theme' },
            { value: 'light', label: 'Light Theme' },
            { value: 'auto', label: 'Auto (System)' }
          ]
        },
        {
          key: 'language',
          label: 'Language',
          description: 'Select your preferred language',
          type: 'select',
          options: [
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Spanish' },
            { value: 'fr', label: 'French' },
            { value: 'de', label: 'German' }
          ]
        },
        {
          key: 'autoSave',
          label: 'Auto Save',
          description: 'Automatically save your work',
          type: 'toggle'
        },
        {
          key: 'codeHighlighting',
          label: 'Code Highlighting',
          description: 'Enable syntax highlighting in code outputs',
          type: 'toggle'
        }
      ]
    },
    {
      icon: '🔒',
      title: 'Privacy & Security',
      color: 'from-green-500 to-emerald-500',
      settings: [
        {
          key: 'profileVisibility',
          label: 'Profile Visibility',
          description: 'Control who can see your profile',
          type: 'select',
          options: [
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
            { value: 'friends', label: 'Friends Only' }
          ]
        },
        {
          key: 'dataSharing',
          label: 'Data Sharing',
          description: 'Allow sharing of usage data for improvements',
          type: 'toggle'
        },
        {
          key: 'analytics',
          label: 'Analytics',
          description: 'Help us improve by sharing anonymous usage data',
          type: 'toggle'
        }
      ]
    }
  ];

  const handleToggle = (sectionKey: string, settingKey: string) => {
    if (sectionKey === 'notifications') {
      setNotifications(prev => ({
        ...prev,
        [settingKey]: !prev[settingKey as keyof typeof prev]
      }));
    } else if (sectionKey === 'preferences') {
      setPreferences(prev => ({
        ...prev,
        [settingKey]: !prev[settingKey as keyof typeof prev]
      }));
    } else if (sectionKey === 'privacy') {
      setPrivacy(prev => ({
        ...prev,
        [settingKey]: !prev[settingKey as keyof typeof prev]
      }));
    }
  };

  const handleSelect = (sectionKey: string, settingKey: string, value: string) => {
    if (sectionKey === 'preferences') {
      setPreferences(prev => ({
        ...prev,
        [settingKey]: value
      }));
    } else if (sectionKey === 'privacy') {
      setPrivacy(prev => ({
        ...prev,
        [settingKey]: value
      }));
    }
  };

  const getCurrentValue = (sectionKey: string, settingKey: string) => {
    if (sectionKey === 'notifications') {
      return notifications[settingKey as keyof typeof notifications];
    } else if (sectionKey === 'preferences') {
      return preferences[settingKey as keyof typeof preferences];
    } else if (sectionKey === 'privacy') {
      return privacy[settingKey as keyof typeof privacy];
    }
    return null;
  };

  return (
    <div className="min-h-screen py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl">
              ⚙️
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-gray-300">Customize your experience and manage your preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + sectionIndex * 0.1 }}
            >
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
                {/* Section Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center text-lg`}>
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{section.title}</h2>
                    <p className="text-gray-400 text-sm">Manage your {section.title.toLowerCase()} preferences</p>
                  </div>
                </div>

                {/* Settings List */}
                <div className="space-y-4">
                  {section.settings.map((setting, settingIndex) => (
                    <motion.div
                      key={setting.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + sectionIndex * 0.1 + settingIndex * 0.05 }}
                      className="flex items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300"
                    >
                      <div className="flex-1">
                        <h3 className="text-white font-medium mb-1">{setting.label}</h3>
                        <p className="text-gray-400 text-sm">{setting.description}</p>
                      </div>

                      <div className="ml-4">
                        {setting.type === 'toggle' && (
                          <button
                            onClick={() => handleToggle(section.title.toLowerCase().replace(/\s+/g, ''), setting.key)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                              getCurrentValue(section.title.toLowerCase().replace(/\s+/g, ''), setting.key)
                                ? 'bg-gradient-to-r from-purple-500 to-cyan-500'
                                : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                getCurrentValue(section.title.toLowerCase().replace(/\s+/g, ''), setting.key)
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}

                        {setting.type === 'select' && (
                          <select
                            value={getCurrentValue(section.title.toLowerCase().replace(/\s+/g, ''), setting.key) as string}
                            onChange={(e) => handleSelect(section.title.toLowerCase().replace(/\s+/g, ''), setting.key, e.target.value)}
                            className="bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60 transition-colors duration-300"
                          >
                            {setting.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-lg">
                  ⚠️
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Account Actions</h2>
                  <p className="text-gray-400 text-sm">Manage your account and data</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center space-x-3 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300 text-left">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-sm">
                    📥
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Export Data</h3>
                    <p className="text-gray-400 text-sm">Download your data</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300 text-left">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-sm">
                    🔄
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Reset Settings</h3>
                    <p className="text-gray-400 text-sm">Restore defaults</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300 text-left">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-sm">
                    🗑️
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Delete Account</h3>
                    <p className="text-gray-400 text-sm">Permanently remove account</p>
                  </div>
                </button>

                <button className="flex items-center space-x-3 p-4 bg-black/30 rounded-xl hover:bg-black/50 transition-colors duration-300 text-left">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-sm">
                    💾
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Save Changes</h3>
                    <p className="text-gray-400 text-sm">Apply all settings</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
      </div>
    </div>
  </div>
);
};

export default Settings; 