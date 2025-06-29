# AI Tools Platform - Frontend

A modern React-based frontend application for AI-powered tools including code generation, algorithm explanation, complexity analysis, and roadmap generation.

## 🚀 Features

- **🤖 AI-Powered Tools**:
  - Code Generation for multiple programming languages
  - Algorithm Explanation with complexity analysis
  - Time Complexity Analysis and optimization
  - Learning Roadmap Generation
  - Frontend Code Generation
  - API Code Generation

- **💬 Chat System**:
  - Save and manage conversation history
  - Real-time chat interface
  - Chat history persistence

- **🔐 Authentication**:
  - Secure user authentication with Clerk
  - Protected routes and features
  - User profile management

- **🎨 Modern UI/UX**:
  - Responsive design with Tailwind CSS
  - Dark/Light mode support
  - Beautiful and intuitive interface
  - Loading states and error handling

- **⚡ Performance**:
  - Fast loading with Vite
  - Optimized bundle size
  - Efficient state management

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **Routing**: React Router
- **Icons**: React Icons
- **Deployment**: Vercel/Netlify ready

## 📋 Prerequisites

- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher)
- Backend API running (see [Backend README](../Backend/README.md))
- Clerk account for authentication

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clerk-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the `clerk-react` directory:
   ```env
   # Backend API URL (Production)
   VITE_API_BASE_URL=https://aibackend-snky.onrender.com/api/ai-tools
   
   # Development Backend URL (for local development)
   # VITE_API_BASE_URL=http://localhost:5001/api/ai-tools
   
   # Environment
   VITE_NODE_ENV=production
   
   # App Configuration
   VITE_APP_NAME=AI Tools Platform
   VITE_APP_VERSION=1.0.0
   
   # Clerk Configuration (if needed)
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
clerk-react/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, etc.
│   │   ├── components/        # Reusable React components
│   │   │   ├── Layout.tsx     # Main layout component
│   │   │   └── Navbar.tsx     # Navigation component
│   │   ├── config/            # Configuration files
│   │   │   └── env.ts         # Environment configuration
│   │   ├── pages/             # Page components
│   │   │   ├── dashboard/     # Dashboard pages
│   │   │   │   ├── AlgorithmExplainer.tsx
│   │   │   │   ├── APIGenerator.tsx
│   │   │   │   ├── CodeGenerator.tsx
│   │   │   │   ├── FrontendDeveloper.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── RecentChats.tsx
│   │   │   │   ├── RoadmapGenerater.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   └── TimeComplexityAnalyzer.tsx
│   │   │   ├── Dashboard.tsx  # Main dashboard
│   │   │   └── Home.tsx       # Home page
│   │   ├── utils/             # Utility functions
│   │   │   └── api.ts         # API integration
│   │   ├── App.tsx            # Main App component
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env                   # Environment variables (create this)
│   ├── package.json           # Dependencies and scripts
│   ├── vite.config.ts         # Vite configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── README.md              # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔌 API Integration

The frontend integrates with the AI Tools Backend API:

### Endpoints Used:
- `POST /api/ai-tools/generate-code` - Generate code solutions
- `POST /api/ai-tools/generate-roadmap` - Create learning roadmaps
- `POST /api/ai-tools/analyze-complexity` - Analyze code complexity
- `POST /api/ai-tools/explain-algorithm` - Explain algorithms
- `POST /api/ai-tools/generate-frontend` - Generate frontend code
- `POST /api/ai-tools/generate-api` - Generate API code
- `GET /api/ai-tools/chats` - Get recent chats
- `POST /api/ai-tools/chats` - Save chat messages
- `DELETE /api/ai-tools/chats/:chatId` - Delete specific chat

### Configuration:
The API base URL is configured via environment variables:
- Development: `http://localhost:5001/api/ai-tools`
- Production: `https://aibackend-snky.onrender.com/api/ai-tools`

## 🎨 UI Components

### Core Components:
- **Layout**: Main application layout with navigation
- **Navbar**: Top navigation bar with user menu
- **Dashboard**: Main dashboard with tool cards
- **Tool Pages**: Individual pages for each AI tool

### Features:
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Beautiful loading animations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client-side validation for all forms
- **Dark Mode**: Toggle between light and dark themes

## 🔐 Authentication

The application uses Clerk for authentication:

### Features:
- Secure user authentication
- Protected routes
- User profile management
- Session management
- Social login options

### Setup:
1. Create a Clerk account
2. Get your publishable key
3. Add it to your `.env` file
4. Configure authentication in your Clerk dashboard

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Set environment variables in your hosting platform

### Environment Variables for Production:
```env
VITE_API_BASE_URL=https://aibackend-snky.onrender.com/api/ai-tools
VITE_NODE_ENV=production
VITE_CLERK_PUBLISHABLE_KEY=your_production_clerk_key
```

## 🔧 Configuration

### Environment Variables:
See [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md) for detailed configuration.

### Vite Configuration:
The application uses Vite for fast development and optimized builds.

### TypeScript Configuration:
Strict TypeScript configuration for better code quality and developer experience.

## 🧪 Testing

### Manual Testing:
1. Test all AI tools functionality
2. Verify authentication flow
3. Test chat system
4. Check responsive design
5. Verify error handling

### Automated Testing:
Add testing libraries like Jest and React Testing Library for automated tests.

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Restart development server after adding `.env` file
   - Check variable names start with `VITE_`
   - Verify file location in `clerk-react` directory

2. **API Connection Issues**
   - Verify backend is running
   - Check API URL in environment variables
   - Test API endpoints directly

3. **Authentication Issues**
   - Verify Clerk configuration
   - Check publishable key
   - Clear browser cache and cookies

4. **Build Issues**
   - Clear `node_modules` and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the troubleshooting section above
- Review the [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
- Check the [Backend README](../Backend/README.md)
- Create an issue in the GitHub repository

## 🔄 Version History

- **v1.0.0** - Initial release with core AI tools functionality
- Added code generation, algorithm explanation, complexity analysis
- Integrated Clerk authentication
- Added chat history management
- Responsive design with Tailwind CSS
- Environment variable configuration
- Production deployment ready

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Clerk](https://clerk.com/) - Authentication
- [Axios](https://axios-http.com/) - HTTP client
