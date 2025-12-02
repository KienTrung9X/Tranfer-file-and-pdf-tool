# Development Guidelines and Standards

## Code Quality Standards

### TypeScript Usage (5/5 files)
- **Strict typing enforcement** - All components use explicit TypeScript interfaces
- **React.FC typing** - Consistent use of `React.FC` for functional components
- **Event typing** - Proper typing for event handlers (`React.DragEvent`, `React.ChangeEvent`)
- **Service typing** - Clear parameter and return type definitions in services

### Import Organization (5/5 files)
```typescript
// External libraries first
import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Internal services and types
import { PdfService } from '../services/pdfService';
import { NavItem } from '../types';
```

### Component Structure (5/5 files)
- **Functional components** with hooks for state management
- **Named exports** for all components (`export const ComponentName`)
- **Consistent component naming** using PascalCase
- **Props destructuring** in component parameters when applicable

## Semantic Patterns Overview

### State Management Patterns (5/5 files)
```typescript
// Boolean state for UI interactions
const [isDragging, setIsDragging] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);

// File handling state
const [file, setFile] = useState<File | null>(null);

// Error handling state
const [error, setError] = useState<string | null>(null);
```

### Event Handler Patterns (4/5 files)
```typescript
// useCallback for performance optimization
const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  // Handler logic
}, []);

// Inline handlers for simple operations
onChange={(e) => setPageRange(e.target.value)}
```

### Service Integration Patterns (3/5 files)
```typescript
// Async service calls with error handling
try {
  await PdfService.splitPdf(file, pageRange);
} catch (err: any) {
  setError(err.message || 'Default error message');
} finally {
  setIsProcessing(false);
}
```

### Navigation Patterns (3/5 files)
```typescript
// React Router integration
import { Link, useLocation } from 'react-router-dom';

// Active route detection
const isActive = (path: string) => {
  return location.pathname.startsWith(path);
};
```

## Internal API Usage and Patterns

### PDF Service Integration (2/5 files)
```typescript
// Service method calls with proper error handling
await PdfService.rotatePdf(file, rotationAngle);
await PdfService.splitPdf(file, pageString);

// File validation before service calls
if (selectedFile.type === 'application/pdf') {
  setFile(selectedFile);
} else {
  setError('Vui lòng chọn file PDF.');
}
```

### Drag and Drop Implementation (3/5 files)
```typescript
// Standard drag and drop handlers
const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(true);
}, []);

const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault();
  setIsDragging(false);
  // Process dropped files
}, []);
```

### File Processing Workflow (3/5 files)
```typescript
// File validation → State update → Service call → Error handling
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const selectedFile = e.target.files[0];
    if (selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    }
  }
};
```

## UI/UX Design Patterns

### Tailwind CSS Conventions (5/5 files)
- **Responsive design** - Mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- **Dark mode support** - Consistent `dark:` variants throughout
- **Color system** - Primary colors with hover states (`bg-primary hover:bg-primary-hover`)
- **Spacing consistency** - Standard padding/margin patterns (`p-4`, `gap-6`, `mb-8`)

### Material Symbols Integration (5/5 files)
```typescript
// Consistent icon usage
<span className="material-symbols-outlined">upload</span>
<span className="material-symbols-outlined">picture_as_pdf</span>
<span className="material-symbols-outlined">progress_activity</span>
```

### Loading States (3/5 files)
```typescript
// Processing state with visual feedback
{isProcessing ? (
  <>
    <span className="material-symbols-outlined animate-spin">progress_activity</span>
    Đang xử lý...
  </>
) : (
  <>
    <span className="material-symbols-outlined">cut</span>
    Tách File PDF
  </>
)}
```

### Error Handling UI (4/5 files)
```typescript
// Conditional error display
{error && <p className="text-red-500 text-sm">{error}</p>}

// Error state styling
className="text-red-500 text-sm text-center"
```

## Code Idioms and Conventions

### Conditional Rendering (5/5 files)
```typescript
// Ternary operators for simple conditions
{qrUrl ? (
  <img src={qrUrl} alt="QR code" />
) : (
  <div className="animate-pulse">Loading...</div>
)}

// Logical AND for conditional display
{showCopyFeedback && <span>Copied!</span>}
```

### CSS Class Composition (5/5 files)
```typescript
// Template literals for dynamic classes
className={`transition-colors duration-200 ${
  isDragging 
    ? 'border-primary bg-primary/5' 
    : 'border-gray-300 hover:border-primary'
}`}
```

### Vietnamese Localization (5/5 files)
- **Consistent Vietnamese text** throughout the application
- **User-friendly error messages** in Vietnamese
- **Descriptive placeholders** and labels in Vietnamese

### File Size Display (2/5 files)
```typescript
// Consistent file size formatting
{(file.size / 1024 / 1024).toFixed(2)} MB
```

## Architecture Decisions

### Component Organization
- **Page components** handle routing and main functionality
- **Service layer** abstracts business logic and external APIs
- **Shared components** provide reusable UI elements

### State Management
- **Local component state** using useState hooks
- **No global state management** - keeping it simple
- **Prop drilling avoided** through proper component structure

### Error Handling Strategy
- **Service-level error throwing** with descriptive messages
- **Component-level error catching** and user feedback
- **Graceful degradation** for failed operations