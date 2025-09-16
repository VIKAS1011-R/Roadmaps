# Original Static Version

This directory contains the original static HTML/CSS/JavaScript implementation of the Java Learning Roadmap application.

## Files

- `index.html` - Complete HTML structure with all page templates
- `app.js` - Full application logic in vanilla JavaScript
- `style.css` - Complete CSS with design system and all component styles

## How to Run

Simply open `index.html` in a web browser, or serve the files using a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

## Architecture

- **Vanilla JavaScript**: Class-based `JavaRoadmapApp` with no external dependencies
- **Single HTML File**: All page templates in one file with CSS visibility control
- **CSS Custom Properties**: Complete design system with light/dark mode support
- **Session Storage**: Client-side authentication and progress persistence

## Key Features

- Complete authentication system with validation
- Interactive roadmap with 40 topics across 7 phases
- Progress tracking and statistics
- Search and filter functionality
- Modal-based topic status updates
- Responsive design

This version was converted to Next.js/React while preserving all functionality and design.