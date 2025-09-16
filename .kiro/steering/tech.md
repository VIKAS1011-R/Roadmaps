# Technology Stack & Build System

## Frontend Stack
- **Next.js 14**: React framework with App Router
- **React 18**: Component-based UI library with hooks
- **TypeScript**: Type-safe JavaScript with strict typing
- **CSS Custom Properties**: Design system with light/dark mode support

## Architecture
- **Next.js App Router**: File-based routing with server components
- **React Context**: Authentication and state management
- **Custom Hooks**: Reusable logic with `useAuth` hook
- **Session Storage**: Client-side authentication persistence

## Design System
- **CSS Custom Properties**: Comprehensive design token system with light/dark mode support
- **Component-based CSS**: Modular CSS with utility classes
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### File Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utilities, types, and data
- `original-static-version/` - Backup of original HTML/CSS/JS files

### Browser Compatibility
- Modern browsers supporting ES2020+ features
- React 18 compatible browsers
- CSS Grid and Flexbox support required

## Code Conventions
- TypeScript strict mode enabled
- React functional components with hooks
- Custom hooks for shared logic
- CSS-in-JS avoided in favor of CSS custom properties
- Async/await for asynchronous operations