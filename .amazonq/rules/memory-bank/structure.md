# Project Structure and Architecture

## Directory Structure

```
Tranfer-file-and-pdf-tool/
├── components/           # Reusable UI components
│   └── Navbar.tsx       # Navigation component
├── pages/               # Application pages/views
│   ├── History.tsx      # File transfer history
│   ├── PdfTools.tsx     # PDF tools overview
│   ├── RotatePdf.tsx    # PDF rotation functionality
│   ├── SplitPdf.tsx     # PDF splitting functionality
│   ├── Status.tsx       # Operation status display
│   ├── Upload.tsx       # File upload interface
│   └── Welcome.tsx      # Landing/welcome page
├── services/            # Business logic and external integrations
│   ├── fileService.ts   # File handling operations
│   ├── pdfService.ts    # PDF processing logic
│   └── supabaseClient.ts # Database and storage client
├── App.tsx              # Main application component
├── constants.ts         # Application constants
├── types.ts             # TypeScript type definitions
├── index.tsx            # Application entry point
└── Configuration files  # Build and development setup
```

## Core Components and Relationships

### Application Layer (App.tsx)
- **Main application shell** with routing configuration
- **Navigation integration** using React Router
- **Global state management** and context providers

### Page Components (/pages)
- **Feature-specific pages** implementing distinct functionalities
- **Upload.tsx** - Primary file upload interface
- **PdfTools.tsx** - Hub for PDF manipulation tools
- **SplitPdf.tsx & RotatePdf.tsx** - Specialized PDF processing
- **History.tsx** - File transfer tracking and management
- **Status.tsx** - Real-time operation feedback

### Service Layer (/services)
- **fileService.ts** - Handles file operations and transfers
- **pdfService.ts** - PDF manipulation using pdf-lib
- **supabaseClient.ts** - Database and cloud storage integration

### Shared Components (/components)
- **Navbar.tsx** - Application navigation and branding
- **Reusable UI elements** for consistent user experience

## Architectural Patterns

### Frontend Architecture
- **React functional components** with hooks for state management
- **Component-based architecture** for modularity and reusability
- **Page-based routing** using React Router for SPA navigation

### Service-Oriented Design
- **Separation of concerns** between UI and business logic
- **Service layer abstraction** for external API interactions
- **Modular service design** for file and PDF operations

### Data Flow
- **Unidirectional data flow** following React patterns
- **Service layer integration** for backend communication
- **State management** at component and application levels

### Technology Integration
- **Supabase integration** for backend services and storage
- **PDF-lib integration** for client-side PDF processing
- **Vite build system** for modern development workflow