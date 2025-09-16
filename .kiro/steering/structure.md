# Project Structure & Organization

## File Organization
```
/
├── .kiro/                     # Kiro IDE configuration
│   └── steering/             # AI assistant guidance files
├── original-static-version/   # Backup of original HTML/CSS/JS files
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Global styles and design system
│   │   ├── layout.tsx        # Root layout component
│   │   └── page.tsx          # Main page component
│   ├── components/           # React components
│   │   ├── AuthPage.tsx      # Login/signup forms
│   │   ├── Dashboard.tsx     # Main dashboard with roadmap
│   │   └── LandingPage.tsx   # Marketing landing page
│   ├── hooks/                # Custom React hooks
│   │   └── useAuth.ts        # Authentication hook and context
│   └── lib/                  # Utilities and data
│       ├── types.ts          # TypeScript type definitions
│       └── roadmapData.ts    # Roadmap phase and topic data
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
└── next.config.js           # Next.js configuration
```

## React Component Architecture

### Main Components
- **`page.tsx`**: Root component with AuthProvider and routing logic
- **`LandingPage`**: Marketing page with hero, features, and CTA sections
- **`AuthPage`**: Unified login/signup form with validation
- **`Dashboard`**: Main app interface with roadmap, progress, and topic management

### Component Patterns
- **Functional Components**: All components use React hooks
- **Props Interface**: TypeScript interfaces for component props
- **State Management**: Local state with useState, global auth with Context
- **Event Handling**: onClick handlers and form submissions

## Authentication Architecture

### `useAuth` Hook
- **AuthProvider**: React Context provider for authentication state
- **Session Management**: sessionStorage for persistence
- **User Management**: Simulated database with Map structure
- **Validation**: Email format and password strength validation

### Key Methods
- `login()` - User authentication with session creation
- `register()` - User registration with validation
- `logout()` - Session cleanup and state reset
- `checkExistingSession()` - Auto-login on app load

## CSS Architecture

### Design System Structure
1. **CSS Custom Properties** - Color tokens, typography, spacing (in globals.css)
2. **Base Styles** - Reset, typography, form elements
3. **Component Styles** - Buttons, cards, modals, forms
4. **Utility Classes** - Spacing, display, alignment helpers
5. **Responsive Design** - Mobile-first with CSS Grid and Flexbox

### Naming Conventions
- **CSS Variables**: `--color-primary`, `--space-16`, `--radius-base`
- **Component Classes**: `.btn`, `.card`, `.form-control`
- **Modifier Classes**: `.btn--primary`, `.btn--outline`, `.btn--sm`
- **Utility Classes**: `.hidden`, `.flex`, `.items-center`

## State Management
- **Authentication State**: React Context with useAuth hook
- **Local Component State**: useState for forms, modals, filters
- **Topic Progress**: Map<number, TopicStatus> for topic statuses
- **Session Persistence**: sessionStorage for user sessions

## TypeScript Integration
- **Strict Mode**: Enabled for type safety
- **Interface Definitions**: User, Topic, Phase, AuthState types
- **Component Props**: Typed interfaces for all component props
- **Hook Returns**: Typed return values for custom hooks