import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  BarChart3, 
  Target,
  Clock,
  Zap
} from 'lucide-react'
import TypingTest from './components/TypingTest'
import Stats from './components/Stats'
import SettingsPanel from './components/SettingsPanel'

type TestMode = 'time' | 'words' | 'custom'
type TestState = 'idle' | 'typing' | 'finished'

interface TestSettings {
  mode: TestMode
  timeLimit: number
  wordCount: number
  customText: string
  theme: 'dark' | 'light'
  soundEnabled: boolean
}

function App() {
  const [testState, setTestState] = useState<TestState>('idle')
  const [settings, setSettings] = useState<TestSettings>({
    mode: 'time',
    timeLimit: 60,
    wordCount: 50,
    customText: '',
    theme: 'dark',
    soundEnabled: true
  })
  const [showSettings, setShowSettings] = useState(false)
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    timeElapsed: 0,
    errors: 0,
    charactersTyped: 0
  })

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (settings.theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
  }, [settings.theme])

  const startTest = useCallback(() => {
    setTestState('typing')
  }, [])

  const finishTest = useCallback((finalStats: typeof stats) => {
    setStats(finalStats)
    setTestState('finished')
  }, [])

  const resetTest = useCallback(() => {
    setTestState('idle')
    setStats({
      wpm: 0,
      accuracy: 0,
      timeElapsed: 0,
      errors: 0,
      charactersTyped: 0
    })
  }, [])

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="border-b backdrop-blur-sm sticky top-0 z-50 transition-colors duration-200 border-gray-200 bg-white/95 dark:border-gray-800 dark:bg-gray-900/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                SocratType
              </h1>
            </motion.div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                title="Statistics"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {testState === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Improve Your Typing Speed
              </h2>
              <p className="text-xl max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
                Practice with AI-generated text in your preferred style. 
                Perfect for mobile typing practice with local text generation.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={startTest}
                className="btn-primary flex items-center space-x-2 text-lg px-8 py-4"
              >
                <Play className="w-5 h-5" />
                <span>Start Typing Test</span>
              </button>
            </div>

            {/* Test Mode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card cursor-pointer hover:border-primary-500/50 transition-colors"
              >
                <Clock className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Time Mode</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Test your speed against the clock
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card cursor-pointer hover:border-primary-500/50 transition-colors"
              >
                <Target className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Word Count</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Type a specific number of words
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card cursor-pointer hover:border-primary-500/50 transition-colors"
              >
                <Settings className="w-8 h-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Custom Text</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Practice with your own content
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {testState === 'typing' && (
          <TypingTest
            settings={settings}
            onFinish={finishTest}
            onReset={resetTest}
          />
        )}

        {testState === 'finished' && (
          <Stats
            stats={stats}
            onRestart={startTest}
            onNewTest={resetTest}
          />
        )}
      </main>

      {/* Settings Panel */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

export default App
