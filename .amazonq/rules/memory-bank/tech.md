# Technology Stack and Development Setup

## Programming Languages and Versions

### Primary Languages
- **TypeScript** (~5.8.2) - Main development language with strict typing
- **JavaScript (ES2022)** - Target compilation for modern browser support
- **JSX/TSX** - React component syntax with TypeScript integration

### Configuration Languages
- **JSON** - Configuration files and metadata
- **CSS** - Styling with Tailwind CSS framework
- **SQL** - Database setup scripts (db_setup.sql)

## Core Technologies

### Frontend Framework
- **React** (^19.2.0) - Modern React with latest features
- **React DOM** (^19.2.0) - DOM rendering for React components
- **React Router DOM** (^7.9.6) - Client-side routing and navigation

### Backend Integration
- **Supabase** (@supabase/supabase-js ^2.86.0) - Backend-as-a-Service
  - Database management
  - File storage
  - Authentication
  - Real-time subscriptions

### PDF Processing
- **pdf-lib** (^1.17.1) - Client-side PDF manipulation
  - PDF splitting functionality
  - PDF rotation capabilities
  - Document merging and processing

### File Handling
- **downloadjs** (^1.4.7) - Client-side file download management

## Build System and Development Tools

### Build Configuration
- **Vite** (^6.2.0) - Modern build tool and development server
- **@vitejs/plugin-react** (^5.0.0) - React integration for Vite
- **TypeScript compiler** with ES2022 target

### Styling Framework
- **Tailwind CSS** (^4.1.17) - Utility-first CSS framework
- **@tailwindcss/forms** (^0.5.10) - Form styling utilities
- **@tailwindcss/container-queries** (^0.1.1) - Container query support
- **PostCSS** (^8.5.6) - CSS processing
- **Autoprefixer** (^10.4.22) - CSS vendor prefixing

### TypeScript Configuration
```json
{
  "target": "ES2022",
  "module": "ESNext",
  "jsx": "react-jsx",
  "moduleResolution": "bundler",
  "allowImportingTsExtensions": true,
  "noEmit": true
}
```

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
- **Node.js** - Required prerequisite
- **GEMINI_API_KEY** - Environment variable for AI integration
- **.env.local** - Local environment configuration

## Project Configuration Files

### Build and Development
- **vite.config.ts** - Vite build configuration
- **tsconfig.json** - TypeScript compiler options
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS processing setup

### Package Management
- **package.json** - Dependencies and scripts
- **package-lock.json** - Dependency lock file

### Version Control
- **.gitignore** - Git exclusion patterns

## Architecture Decisions

### Module System
- **ESNext modules** with bundler resolution
- **Path aliases** (@/* for root-relative imports)
- **Isolated modules** for better build performance

### Development Experience
- **Hot module replacement** via Vite
- **TypeScript strict mode** for type safety
- **Modern JavaScript features** (ES2022 target)