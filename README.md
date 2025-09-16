# Programming Language Learning Roadmap

A comprehensive web application built with Next.js that guides developers through structured learning journeys for various programming languages. Features interactive roadmaps with organized topics and phases, from fundamentals to advanced concepts.

## 🚀 Features

- **Multi-Language Support**: Support for multiple programming languages with dedicated learning paths
- **Structured Learning Paths**: Organized roadmaps with topics across multiple phases
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Interactive Status Management**: Mark topics as pending, learning, on hold, completed, or ignore
- **User Authentication**: Secure registration and login with session management
- **Admin Panel**: Administrative interface for managing languages and content
- **Personal Dashboard**: Customized experience with saved progress
- **Search & Filter**: Find and filter topics by status or keywords
- **Completion Indicators**: Special styling and badges for 100% completed languages
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Automatic theme support with CSS custom properties

## 🛠 Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - Component-based UI library with hooks
- **TypeScript** - Type-safe JavaScript with strict typing
- **MongoDB** - NoSQL database for data persistence
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **CSS Custom Properties** - Design system with theme support

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas account)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd programming-language-roadmap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env.local` file in the root directory
   - Add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/roadmap-app
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Database Setup**
   ```bash
   npm run setup-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── admin/          # Admin panel endpoints
│   │   ├── languages/      # Language data endpoints
│   │   └── user/           # User progress endpoints
│   ├── admin/              # Admin panel pages
│   ├── dashboard/          # Dashboard page
│   ├── learn/[language]/   # Dynamic language learning pages
│   ├── globals.css         # Global styles and design system
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── admin/              # Admin panel components
│   ├── AuthPage.tsx        # Authentication forms
│   ├── AuthProvider.tsx    # Authentication context
│   ├── Dashboard.tsx       # Learning dashboard
│   ├── LandingPage.tsx     # Marketing landing page
│   └── LanguageSelectionPage.tsx # Language selection
├── hooks/                  # Custom React hooks
│   └── useAuth.ts          # Authentication hook
├── lib/                    # Utilities and configurations
│   ├── middleware/         # Authentication middleware
│   ├── mongodb.ts          # Database connection
│   └── types.ts            # TypeScript definitions
└── scripts/                # Database setup scripts
```

## 🗄 Database Schema

The application uses MongoDB with the following collections:

- **users**: User accounts, profiles, and progress data
- **languages**: Programming language definitions and roadmaps
- **topics**: Individual learning topics within languages

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run setup-db` - Initialize database with sample data

## 🎯 Key Features

### For Learners
- Browse available programming languages
- Track learning progress with visual indicators
- Mark topics with different statuses (pending, learning, completed, etc.)
- View completion statistics and progress bars
- Responsive design for all devices

### For Administrators
- Add new programming languages and roadmaps
- Manage existing content through admin panel
- View user statistics and progress
- Secure admin authentication

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Admin role-based access control
- Session management with automatic expiration

## 🌐 Environment Variables

Required environment variables for production:

```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=production
```

## 📱 Browser Support

- Modern browsers supporting ES2020+ features
- React 18 compatible browsers
- CSS Grid and Flexbox support required

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.