# SocratType - Typing Test App

A modern, responsive typing test application built with React, TypeScript, and Tailwind CSS. Perfect for improving your typing speed and accuracy with a beautiful, intuitive interface.

## Features

### 🎯 Core Functionality
- **Multiple Test Modes**: Time-based, word count, and custom text modes
- **Real-time Statistics**: WPM, accuracy, time elapsed, and error tracking
- **Visual Feedback**: Color-coded character highlighting for correct/incorrect typing
- **Progress Tracking**: Real-time progress bar and completion percentage

### 🎨 Modern UI/UX
- **Dark Theme**: Beautiful dark interface with blue accent colors
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for a polished feel
- **Intuitive Controls**: Easy-to-use pause, reset, and settings controls

### ⚙️ Customization
- **Test Settings**: Configurable time limits and word counts
- **Theme Options**: Dark/light theme support (light theme coming soon)
- **Sound Controls**: Toggle sound effects on/off
- **Custom Text**: Type your own text for practice

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd socrattype-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## How to Use

### Starting a Test
1. Click "Start Typing Test" on the home screen
2. Choose your preferred test mode:
   - **Time Mode**: Type as much as you can within a time limit
   - **Word Count**: Type a specific number of words
   - **Custom Text**: Practice with your own text

### During the Test
- **Type the highlighted text** that appears on screen
- **Monitor your progress** with the real-time progress bar
- **Pause/Resume** the test at any time
- **Reset** to start over
- **Press ESC** to quickly reset

### Understanding Results
After completing a test, you'll see:
- **WPM (Words Per Minute)**: Your typing speed
- **Accuracy**: Percentage of correctly typed characters
- **Time Elapsed**: How long the test took
- **Total Errors**: Number of mistakes made
- **Performance Rating**: Based on your WPM and accuracy

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

## Project Structure

```
src/
├── components/
│   ├── TypingTest.tsx    # Main typing test component
│   ├── Stats.tsx         # Results and statistics display
│   └── SettingsPanel.tsx # Settings and configuration
├── App.tsx               # Main application component
├── index.css             # Global styles and Tailwind imports
└── main.tsx              # Application entry point
```

## Future Features

### 🚀 Coming Soon
- **AI-Generated Text**: Local DeepSeek integration for custom text generation
- **Advanced Analytics**: Detailed progress tracking and performance insights
- **Multiplayer Mode**: Compete with friends in real-time
- **Custom Themes**: More color schemes and personalization options
- **Mobile Optimization**: Touch-friendly interface improvements
- **Sound Effects**: Audio feedback for typing actions
- **Export Results**: Save and share your typing statistics

### 🎯 Roadmap
- **Practice Modes**: Focus on specific skills (punctuation, numbers, etc.)
- **Achievement System**: Unlock badges and milestones
- **Leaderboards**: Compare with other users
- **Offline Support**: Work without internet connection
- **Keyboard Layout Support**: Different keyboard layouts and languages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by MonkeyType and other typing test applications
- Built with modern web technologies for optimal performance
- Designed for both beginners and advanced typists

---

**Happy Typing!** 🚀
