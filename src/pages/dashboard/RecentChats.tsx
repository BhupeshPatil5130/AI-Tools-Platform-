import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { chatAPI } from '../../utils/api';
import { useAuth } from '@clerk/clerk-react';

interface Chat {
  _id: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const RecentChats: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      loadChats();
    }
  }, [isSignedIn]);

  const loadChats = async () => {
    try {
      console.log('Loading chats...');
      const token = await getToken();
      console.log('Token obtained:', token ? 'Yes' : 'No');
      
      if (token) {
        const response = await chatAPI.getRecentChats(token);
        console.log('Chats response:', response);
        setChats(response.chats || []);
      } else {
        console.error('No token available');
        toast.error('Authentication token not available');
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
      toast.error(`Failed to load recent chats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error('Authentication token not available');
        return;
      }

      await chatAPI.deleteChat(chatId, token);
      toast.success('Chat deleted successfully');
      
      // Remove the chat from the local state
      setChats(prevChats => prevChats.filter(chat => chat._id !== chatId));
      
      // If the deleted chat was selected, clear the selection
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast.error(`Failed to delete chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getChatPreview = (messages: Chat['messages']) => {
    if (messages.length === 0) return 'No messages';
    
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content;
    
    // Truncate long content
    if (content.length > 100) {
      return content.substring(0, 100) + '...';
    }
    return content;
  };

  const getChatTitle = (messages: Chat['messages']) => {
    if (messages.length === 0) return 'Untitled Chat';
    
    const firstMessage = messages[0];
    const content = firstMessage.content;
    
    // Extract a meaningful title from the first message
    if (content.includes('Generate')) {
      return content.split('Generate')[1]?.split('for:')[0]?.trim() || 'Code Generation';
    } else if (content.includes('Explain')) {
      return content.split('Explain')[1]?.split('algorithm')[0]?.trim() || 'Algorithm Explanation';
    } else if (content.includes('Analyze')) {
      return 'Complexity Analysis';
    } else if (content.includes('roadmap')) {
      return 'Learning Roadmap';
    } else if (content.includes('API')) {
      return 'API Generation';
    } else if (content.includes('frontend')) {
      return 'Frontend Development';
    }
    
    return content.substring(0, 30) + (content.length > 30 ? '...' : '');
  };

  const getChatIcon = (messages: Chat['messages']) => {
    if (messages.length === 0) return '💬';
    
    const firstMessage = messages[0].content.toLowerCase();
    
    if (firstMessage.includes('generate') && firstMessage.includes('code')) return '💻';
    if (firstMessage.includes('explain') && firstMessage.includes('algorithm')) return '🧮';
    if (firstMessage.includes('analyze') && firstMessage.includes('complexity')) return '📊';
    if (firstMessage.includes('roadmap')) return '🗺️';
    if (firstMessage.includes('api')) return '🔌';
    if (firstMessage.includes('frontend')) return '🎨';
    
    return '💬';
  };

  const filteredChats = chats.filter(chat => {
    const title = getChatTitle(chat.messages).toLowerCase();
    const preview = getChatPreview(chat.messages).toLowerCase();
    const search = searchTerm.toLowerCase();
    return title.includes(search) || preview.includes(search);
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Copy error:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
            <p className="text-gray-400">Please sign in to view your recent chats.</p>
          </div>
        </div>
      </div>
    );
  }

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
                💬
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Recent Chats
                </h1>
                <p className="text-gray-300 text-lg">
                  View and manage your AI conversation history across all tools.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="xl:col-span-1"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">📋</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Chat History</h2>
              </div>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-2 border-purple-600/50 bg-black/50 text-white focus:border-purple-400 focus:ring-4 focus:ring-purple-400/20 px-4 py-3 text-sm transition-all duration-300"
                />
              </div>

              {/* Chat List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💬</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {searchTerm ? 'No chats found matching your search.' : 'No chats yet. Start using our AI tools!'}
                    </p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <motion.button
                      key={chat._id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                        selectedChat?._id === chat._id
                          ? 'bg-purple-600/20 border-purple-500/50'
                          : 'bg-black/50 border-purple-600/30 hover:bg-black/70 hover:border-purple-500/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center text-lg">
                          {getChatIcon(chat.messages)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium text-sm truncate">
                            {getChatTitle(chat.messages)}
                          </h3>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {getChatPreview(chat.messages)}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-500 text-xs">
                              {chat.messages.length} messages
                            </span>
                            <span className="text-gray-500 text-xs">
                              {formatDate(chat.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this chat?')) {
                              deleteChat(chat._id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          title="Delete chat"
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Chat Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="xl:col-span-2"
          >
            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm">💬</span>
                </div>
                <h2 className="text-xl font-semibold text-purple-300">Chat Details</h2>
              </div>

              {selectedChat ? (
                <div className="flex-1 overflow-y-auto">
                  {/* Chat Header */}
                  <div className="bg-black/50 p-4 rounded-xl border border-purple-600/50 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">
                          {getChatTitle(selectedChat.messages)}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {formatDate(selectedChat.createdAt)} • {selectedChat.messages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => copyToClipboard(JSON.stringify(selectedChat.messages, null, 2))}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                        >
                          📋 Copy All
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this chat?')) {
                              deleteChat(selectedChat._id);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-500 text-white text-xs py-2 px-3 rounded-lg transition-colors"
                        >
                          🗑️ Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
                    {selectedChat.messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-xl ${
                          message.role === 'user'
                            ? 'bg-purple-600/20 border border-purple-500/50'
                            : 'bg-black/50 border border-purple-600/50'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`text-xs font-medium ${
                              message.role === 'user' ? 'text-purple-300' : 'text-cyan-300'
                            }`}>
                              {message.role === 'user' ? '👤 You' : '🤖 AI'}
                            </span>
                            {message.timestamp && (
                              <span className="text-gray-500 text-xs">
                                {formatDate(message.timestamp)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-300 whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => copyToClipboard(message.content)}
                            className="mt-2 text-purple-400 hover:text-purple-300 text-xs transition-colors"
                          >
                            📋 Copy
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center flex-1 flex items-center justify-center">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💬</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Select a chat from the list to view the conversation.
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

export default RecentChats; 