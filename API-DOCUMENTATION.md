# SocratType - Comprehensive API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component APIs](#component-apis)
4. [Type Definitions](#type-definitions)
5. [Utility Functions](#utility-functions)
6. [Styling System](#styling-system)
7. [Configuration](#configuration)
8. [Development Guidelines](#development-guidelines)
9. [Usage Examples](#usage-examples)

## Project Overview

SocratType is a modern typing test application built with React, TypeScript, and Tailwind CSS. It provides a clean, responsive interface for improving typing speed and accuracy with real-time feedback and comprehensive statistics.

### Technology Stack
- **React 19** - Modern React with hooks and strict mode
- **TypeScript 5.8** - Type-safe development with strict configuration
- **Vite 7.0** - Fast build tool and development server
- **Tailwind CSS 4.1** - Utility-first CSS framework with custom design system
- **Framer Motion 12** - Smooth animations and transitions
- **Lucide React** - Beautiful, consistent icons

### Core Features
- Multiple test modes (time-based, word count, custom text)
- Real-time typing feedback with color-coded characters
- Comprehensive statistics and performance analysis
- Responsive design for all devices
- Dark theme with customizable settings
- Keyboard shortcuts and accessibility features

## Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── TypingTest.tsx   # Main typing test logic
│   ├── Stats.tsx        # Results and statistics display
│   └── SettingsPanel.tsx # Configuration panel
├── App.tsx              # Root application component
├── main.tsx             # Application entry point
├── index.css            # Global styles and Tailwind imports
└── vite-env.d.ts        # Vite type definitions
```

### State Management
The application uses React's built-in state management with hooks:
- **useState** for component-level state
- **useEffect** for side effects and lifecycle management
- **useCallback** for performance optimization
- **useRef** for DOM access and timers

### Data Flow
1. **App.tsx** manages global application state and routing between views
2. **TypingTest.tsx** handles typing logic and real-time feedback
3. **Stats.tsx** displays results after test completion
4. **SettingsPanel.tsx** manages user preferences and test configuration

## Component APIs

### App Component

Main application component that orchestrates the entire typing test experience.

#### State Interface
```typescript
interface TestSettings {
  mode: 'time' | 'words' | 'custom'
  timeLimit: number
  wordCount: number
  customText: string
  theme: 'dark' | 'light'
  soundEnabled: boolean
}

interface TestStats {
  wpm: number
  accuracy: number
  timeElapsed: number
  errors: number
  charactersTyped: number
}

type TestState = 'idle' | 'typing' | 'finished'
```

#### Key Functions
- **startTest()** - Initiates a new typing test
- **finishTest(stats)** - Handles test completion and statistics
- **resetTest()** - Resets application to initial state

#### Usage Example
```typescript
import App from './App'

// The App component is self-contained and requires no props
function Root() {
  return <App />
}
```

---

### TypingTest Component

Core typing test functionality with real-time feedback and progress tracking.

#### Props Interface
```typescript
interface TypingTestProps {
  settings: {
    mode: 'time' | 'words' | 'custom'
    timeLimit: number
    wordCount: number
    customText: string
  }
  onFinish: (stats: {
    wpm: number
    accuracy: number
    timeElapsed: number
    errors: number
    charactersTyped: number
  }) => void
  onReset: () => void
}
```

#### Key Features
- **Real-time character highlighting** - Visual feedback for correct/incorrect typing
- **Progress tracking** - Dynamic progress bar and completion percentage
- **Timer management** - Precise timing with pause/resume functionality
- **Error detection** - Accurate error counting and correction feedback
- **Keyboard shortcuts** - ESC to reset, intuitive controls

#### State Management
```typescript
const [text, setText] = useState<string>('')
const [userInput, setUserInput] = useState<string>('')
const [currentIndex, setCurrentIndex] = useState<number>(0)
const [errors, setErrors] = useState<number>(0)
const [startTime, setStartTime] = useState<number | null>(null)
const [timeElapsed, setTimeElapsed] = useState<number>(0)
const [isPaused, setIsPaused] = useState<boolean>(false)
const [isFinished, setIsFinished] = useState<boolean>(false)
```

#### Key Functions

##### `handleInputChange(e: React.ChangeEvent<HTMLInputElement>)`
Processes user typing input and updates state accordingly.
- Starts timer on first keystroke
- Updates current typing position
- Calculates real-time error count
- Prevents input beyond text length

##### `getCharacterClass(index: number): string`
Returns CSS class for character styling based on typing state.
- `'typing-correct'` - Correctly typed character (green)
- `'typing-incorrect'` - Incorrectly typed character (red background)
- `'typing-current'` - Current typing position (blue underline)
- `'typing-upcoming'` - Not yet typed (gray)

##### `formatTime(ms: number): string`
Formats milliseconds into MM:SS display format.

##### `finishTest()`
Calculates final statistics and calls parent completion handler.

#### Usage Example
```typescript
import TypingTest from './components/TypingTest'

function MyApp() {
  const settings = {
    mode: 'time' as const,
    timeLimit: 60,
    wordCount: 50,
    customText: ''
  }

  const handleFinish = (stats) => {
    console.log('Test completed:', stats)
  }

  const handleReset = () => {
    console.log('Test reset')
  }

  return (
    <TypingTest
      settings={settings}
      onFinish={handleFinish}
      onReset={handleReset}
    />
  )
}
```

---

### Stats Component

Displays comprehensive test results with visual feedback and performance analysis.

#### Props Interface
```typescript
interface StatsProps {
  stats: {
    wpm: number
    accuracy: number
    timeElapsed: number
    errors: number
    charactersTyped: number
  }
  onRestart: () => void
  onNewTest: () => void
}
```

#### Key Features
- **Performance categorization** - Visual feedback based on WPM and accuracy
- **Detailed metrics** - Characters per minute, error rate, average word length
- **Color-coded results** - Dynamic colors based on performance levels
- **Animated displays** - Smooth entry animations for engaging experience

#### Performance Analysis Functions

##### `getAccuracyColor(accuracy: number): string`
Returns color class based on accuracy percentage:
- 95%+ → `'text-green-400'` (Excellent)
- 85%+ → `'text-yellow-400'` (Good)
- <85% → `'text-red-400'` (Needs improvement)

##### `getWpmColor(wpm: number): string`
Returns color class based on words per minute:
- 80+ → `'text-green-400'` (Expert)
- 60+ → `'text-yellow-400'` (Advanced)
- 40+ → `'text-blue-400'` (Intermediate)
- <40 → `'text-gray-400'` (Beginner)

##### `getPerformanceMessage(): { message: string, icon: LucideIcon, color: string }`
Provides motivational feedback based on combined performance metrics:
- **Excellent**: 80+ WPM, 95%+ accuracy → Trophy icon, encouraging message
- **Great**: 60+ WPM, 90%+ accuracy → Trending up icon, progress message
- **Good**: 40+ WPM, 85%+ accuracy → Target icon, focus message
- **Practice**: Below thresholds → Zap icon, motivational message

#### Calculated Metrics
- **Characters per Minute** - `(charactersTyped / timeElapsed) * 60000`
- **Average Word Length** - `charactersTyped / wpm`
- **Error Rate** - `(errors / charactersTyped) * 100`

#### Usage Example
```typescript
import Stats from './components/Stats'

function ResultsPage() {
  const testStats = {
    wpm: 65,
    accuracy: 92,
    timeElapsed: 60000,
    errors: 8,
    charactersTyped: 320
  }

  const handleRestart = () => {
    // Restart same test
  }

  const handleNewTest = () => {
    // Start new test with different settings
  }

  return (
    <Stats
      stats={testStats}
      onRestart={handleRestart}
      onNewTest={handleNewTest}
    />
  )
}
```

---

### SettingsPanel Component

Configuration panel for customizing test parameters and application preferences.

#### Props Interface
```typescript
interface SettingsPanelProps {
  settings: {
    mode: 'time' | 'words' | 'custom'
    timeLimit: number
    wordCount: number
    customText: string
    theme: 'dark' | 'light'
    soundEnabled: boolean
  }
  onSettingsChange: (settings: TestSettings) => void
  onClose: () => void
}
```

#### Key Features
- **Test mode selection** - Radio buttons for time, word count, or custom text modes
- **Dynamic options** - Conditional inputs based on selected mode
- **Theme switching** - Dark/light theme selection (light theme pending)
- **Sound preferences** - Toggle for audio feedback
- **Future features preview** - Information about upcoming enhancements

#### Configuration Options

##### Time Mode Settings
Available time limits:
- 15 seconds
- 30 seconds
- 1 minute (default)
- 2 minutes
- 5 minutes

##### Word Count Mode Settings
Available word counts:
- 10 words
- 25 words
- 50 words (default)
- 100 words
- 200 words

##### Custom Text Mode
- Textarea for user-provided text
- No length restrictions
- Preserves formatting and spacing

#### Key Functions

##### `updateSetting(key: string, value: any)`
Updates a specific setting while preserving other configuration values.

#### Usage Example
```typescript
import SettingsPanel from './components/SettingsPanel'

function ConfigurationView() {
  const [settings, setSettings] = useState({
    mode: 'time' as const,
    timeLimit: 60,
    wordCount: 50,
    customText: '',
    theme: 'dark' as const,
    soundEnabled: true
  })

  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <button onClick={() => setShowSettings(true)}>
        Settings
      </button>
      
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  )
}
```

## Type Definitions

### Core Types
```typescript
// Test configuration types
type TestMode = 'time' | 'words' | 'custom'
type TestState = 'idle' | 'typing' | 'finished'
type Theme = 'dark' | 'light'

// Settings interface
interface TestSettings {
  mode: TestMode
  timeLimit: number
  wordCount: number
  customText: string
  theme: Theme
  soundEnabled: boolean
}

// Statistics interface
interface TestStats {
  wpm: number
  accuracy: number
  timeElapsed: number
  errors: number
  charactersTyped: number
}

// Performance analysis types
interface PerformanceMessage {
  message: string
  icon: LucideIcon
  color: string
}
```

### Component Prop Types
```typescript
// App component types
interface AppState {
  testState: TestState
  settings: TestSettings
  showSettings: boolean
  stats: TestStats
}

// TypingTest component types
interface TypingTestProps {
  settings: Pick<TestSettings, 'mode' | 'timeLimit' | 'wordCount' | 'customText'>
  onFinish: (stats: TestStats) => void
  onReset: () => void
}

// Stats component types
interface StatsProps {
  stats: TestStats
  onRestart: () => void
  onNewTest: () => void
}

// SettingsPanel component types
interface SettingsPanelProps {
  settings: TestSettings
  onSettingsChange: (settings: TestSettings) => void
  onClose: () => void
}
```

## Utility Functions

### Time Formatting
```typescript
/**
 * Formats milliseconds into MM:SS format
 * @param ms - Time in milliseconds
 * @returns Formatted time string (e.g., "1:23")
 */
function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
```

### Character Classification
```typescript
/**
 * Determines CSS class for character based on typing state
 * @param index - Character position in text
 * @param currentIndex - Current typing position
 * @param userInput - User's typed text
 * @param originalText - Original text to type
 * @returns CSS class name for styling
 */
function getCharacterClass(
  index: number,
  currentIndex: number,
  userInput: string,
  originalText: string
): string {
  if (index < currentIndex) {
    return userInput[index] === originalText[index] 
      ? 'typing-correct' 
      : 'typing-incorrect'
  } else if (index === currentIndex) {
    return 'typing-current'
  } else {
    return 'typing-upcoming'
  }
}
```

### Statistics Calculations
```typescript
/**
 * Calculates words per minute based on characters typed and time
 * @param charactersTyped - Total characters typed
 * @param timeElapsed - Time in milliseconds
 * @returns Words per minute (rounded)
 */
function calculateWPM(charactersTyped: number, timeElapsed: number): number {
  const minutes = timeElapsed / 60000
  const wordsTyped = charactersTyped / 5 // Standard: 5 characters = 1 word
  return minutes > 0 ? Math.round(wordsTyped / minutes) : 0
}

/**
 * Calculates typing accuracy percentage
 * @param totalCharacters - Total characters in text
 * @param errors - Number of errors made
 * @returns Accuracy percentage (rounded)
 */
function calculateAccuracy(totalCharacters: number, errors: number): number {
  return totalCharacters > 0 
    ? Math.round(((totalCharacters - errors) / totalCharacters) * 100) 
    : 0
}
```

## Styling System

### Tailwind Configuration

The application uses a custom Tailwind CSS configuration with extended color palette and typography.

#### Color Palette
```javascript
colors: {
  primary: {
    50: '#f0f9ff',   // Lightest blue
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',  // UI accent color
    500: '#0ea5e9',  // Primary brand
    600: '#0284c7',  // Primary hover
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'   // Darkest blue
  },
  gray: {
    50: '#f9fafb',   // Lightest gray
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',  // Text secondary
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',  // UI secondary
    800: '#1f2937',  // UI primary
    900: '#111827'   // Background
  }
}
```

#### Typography
```javascript
fontFamily: {
  'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
  'sans': ['Inter', 'system-ui', 'sans-serif'],
}
```

### CSS Component Classes

#### Typing-Specific Classes
```css
.typing-text {
  @apply font-mono text-lg leading-relaxed;
}

.typing-correct {
  @apply text-green-400;
}

.typing-incorrect {
  @apply text-red-400 bg-red-400/20;
}

.typing-current {
  @apply bg-primary-500/20 border-b-2 border-primary-500;
}

.typing-upcoming {
  @apply text-gray-400;
}
```

#### Button Components
```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white 
         font-medium py-2 px-4 rounded-lg 
         transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-700 hover:bg-gray-600 text-gray-100 
         font-medium py-2 px-4 rounded-lg 
         transition-colors duration-200;
}
```

#### Layout Components
```css
.card {
  @apply bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700;
}
```

### Animation Classes
```javascript
animation: {
  'fade-in': 'fadeIn 0.5s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

## Configuration

### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Sample Text Configuration
```typescript
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creative problem-solving skills that can be developed through practice.",
  // ... additional sample texts
]
```

## Development Guidelines

### Code Organization
- Keep components focused and single-responsibility
- Use TypeScript interfaces for all props and state
- Implement proper error boundaries
- Follow React best practices for hooks

### Performance Considerations
- Use `useCallback` for functions passed as props
- Implement `React.memo` for expensive components when needed
- Optimize re-renders with proper dependency arrays
- Use `useRef` for timers and DOM access

### Accessibility
- Provide keyboard shortcuts (ESC to reset)
- Use semantic HTML elements
- Ensure proper focus management
- Test with screen readers

### Testing Strategy
- Unit tests for utility functions
- Component tests for user interactions
- Integration tests for complete workflows
- Performance tests for typing accuracy

### Future Development
- AI text generation integration
- Multiplayer functionality
- Advanced analytics
- Mobile optimization
- Additional themes

## Usage Examples

### Basic Integration
```typescript
import React, { useState } from 'react'
import App from './App'

function TypingApp() {
  return (
    <div className="min-h-screen">
      <App />
    </div>
  )
}

export default TypingApp
```

### Custom Implementation
```typescript
import React, { useState } from 'react'
import TypingTest from './components/TypingTest'
import Stats from './components/Stats'

function CustomTypingFlow() {
  const [isTestComplete, setIsTestComplete] = useState(false)
  const [testStats, setTestStats] = useState(null)

  const settings = {
    mode: 'words' as const,
    timeLimit: 60,
    wordCount: 100,
    customText: ''
  }

  const handleTestComplete = (stats) => {
    setTestStats(stats)
    setIsTestComplete(true)
  }

  const handleReset = () => {
    setIsTestComplete(false)
    setTestStats(null)
  }

  return (
    <div className="container mx-auto p-4">
      {!isTestComplete ? (
        <TypingTest
          settings={settings}
          onFinish={handleTestComplete}
          onReset={handleReset}
        />
      ) : (
        <Stats
          stats={testStats}
          onRestart={() => setIsTestComplete(false)}
          onNewTest={handleReset}
        />
      )}
    </div>
  )
}
```

### Settings Integration
```typescript
import React, { useState } from 'react'
import SettingsPanel from './components/SettingsPanel'

function SettingsDemo() {
  const [settings, setSettings] = useState({
    mode: 'time' as const,
    timeLimit: 60,
    wordCount: 50,
    customText: '',
    theme: 'dark' as const,
    soundEnabled: true
  })

  const [showPanel, setShowPanel] = useState(false)

  return (
    <div>
      <button onClick={() => setShowPanel(true)}>
        Open Settings
      </button>
      
      <div>Current mode: {settings.mode}</div>
      <div>Sound: {settings.soundEnabled ? 'On' : 'Off'}</div>
      
      {showPanel && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowPanel(false)}
        />
      )}
    </div>
  )
}
```

### Performance Monitoring
```typescript
import React, { useState, useEffect } from 'react'
import TypingTest from './components/TypingTest'

function PerformanceTracker() {
  const [allStats, setAllStats] = useState([])

  const handleTestComplete = (stats) => {
    setAllStats(prev => [...prev, { ...stats, timestamp: Date.now() }])
  }

  const averageWPM = allStats.length > 0 
    ? allStats.reduce((sum, stat) => sum + stat.wpm, 0) / allStats.length 
    : 0

  const averageAccuracy = allStats.length > 0
    ? allStats.reduce((sum, stat) => sum + stat.accuracy, 0) / allStats.length
    : 0

  return (
    <div>
      <div className="mb-4">
        <h2>Performance Summary</h2>
        <p>Tests completed: {allStats.length}</p>
        <p>Average WPM: {Math.round(averageWPM)}</p>
        <p>Average Accuracy: {Math.round(averageAccuracy)}%</p>
      </div>
      
      <TypingTest
        settings={{
          mode: 'time',
          timeLimit: 60,
          wordCount: 50,
          customText: ''
        }}
        onFinish={handleTestComplete}
        onReset={() => {}}
      />
    </div>
  )
}
```

---

## API Reference Quick Guide

### Component Props Summary

| Component | Required Props | Optional Props | Return Type |
|-----------|---------------|----------------|-------------|
| App | None | None | JSX.Element |
| TypingTest | settings, onFinish, onReset | None | JSX.Element |
| Stats | stats, onRestart, onNewTest | None | JSX.Element |
| SettingsPanel | settings, onSettingsChange, onClose | None | JSX.Element |

### Event Handler Signatures

```typescript
// TypingTest events
onFinish: (stats: TestStats) => void
onReset: () => void

// Stats events  
onRestart: () => void
onNewTest: () => void

// SettingsPanel events
onSettingsChange: (settings: TestSettings) => void
onClose: () => void
```

### Key Keyboard Shortcuts

| Key | Action | Component |
|-----|--------|-----------|
| ESC | Reset test | TypingTest |
| Any key | Start typing | TypingTest |
| Click outside | Close panel | SettingsPanel |

This documentation provides a complete reference for integrating and extending the SocratType application. All components are designed to be reusable and customizable for different use cases while maintaining type safety and performance.