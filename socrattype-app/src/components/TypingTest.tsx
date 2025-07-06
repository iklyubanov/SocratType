import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Pause, Play, RotateCcw, X } from 'lucide-react'

interface TestSettings {
  mode: 'time' | 'words' | 'custom'
  timeLimit: number
  wordCount: number
  customText: string
  theme: 'dark' | 'light'
  soundEnabled: boolean
}

interface TypingTestProps {
  settings: TestSettings
  onFinish: (stats: {
    wpm: number
    accuracy: number
    timeElapsed: number
    errors: number
    charactersTyped: number
  }) => void
  onReset: () => void
}

// Sample texts for different modes
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creative problem-solving skills.",
  "The internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide.",
  "Artificial intelligence is the simulation of human intelligence in machines that are programmed to think and learn like humans. It has applications in various fields.",
  "Climate change refers to long-term shifts in global or regional climate patterns. It is primarily caused by human activities such as burning fossil fuels."
]

const TypingTest: React.FC<TypingTestProps> = ({ settings, onFinish, onReset }) => {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [isFinished, setIsFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Helper function to properly count words
  const countWords = (input: string): number => {
    const trimmed = input.trim()
    if (trimmed === '') return 0
    return trimmed.split(/\s+/).length
  }

  // Generate text based on settings
  useEffect(() => {
    let generatedText = ''
    
    if (settings.mode === 'custom' && settings.customText.trim()) {
      generatedText = settings.customText
    } else {
      // Use sample texts and repeat if needed
      const baseText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)]
      
      if (settings.mode === 'words') {
        const words = baseText.split(' ')
        const targetWords = Math.min(settings.wordCount, words.length)
        generatedText = words.slice(0, targetWords).join(' ')
        
        // If we need more words, repeat the text
        while (generatedText.split(' ').length < settings.wordCount) {
          generatedText += ' ' + baseText
        }
        generatedText = generatedText.split(' ').slice(0, settings.wordCount).join(' ')
      } else {
        // Time mode - use longer text
        generatedText = baseText
        while (generatedText.length < 500) {
          generatedText += ' ' + baseText
        }
      }
    }
    
    setText(generatedText)
  }, [settings])

  // Timer logic
  useEffect(() => {
    console.log('Timer useEffect:', { startTime, isPaused, isFinished, timeElapsed })
    if (startTime && !isPaused && !isFinished) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        setTimeElapsed(elapsed)
        console.log('Timer tick:', elapsed)
        // Check if time limit reached
        if (settings.mode === 'time' && elapsed >= settings.timeLimit * 1000) {
          finishTest()
        }
      }, 100)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTime, isPaused, isFinished, settings.mode, settings.timeLimit])

  // Calculate WPM and accuracy
  useEffect(() => {
    console.log('WPM/Accuracy useEffect:', { userInput, errors, timeElapsed, startTime })
    if (startTime && timeElapsed > 0) {
      const wordsTyped = countWords(userInput)
      const minutes = timeElapsed / 60000
      const calculatedWpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
      setWpm(calculatedWpm)
      
      const totalCharacters = userInput.length
      const errorRate = totalCharacters > 0 ? (errors / totalCharacters) * 100 : 0
      const calculatedAccuracy = Math.max(0, 100 - errorRate)
      setAccuracy(Math.round(calculatedAccuracy))
    }
  }, [userInput, errors, timeElapsed, startTime])

  const startTest = useCallback(() => {
    console.log('startTest called')
    setStartTime(Date.now())
    setTimeElapsed(0)
    setIsPaused(false)
    setIsFinished(false)
    setCurrentIndex(0)
    setErrors(0)
    setUserInput('')
    setWpm(0)
    setAccuracy(100)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const pauseTest = useCallback(() => {
    setIsPaused(!isPaused)
  }, [isPaused])

  const finishTest = useCallback(() => {
    setIsFinished(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const finalStats = {
      wpm,
      accuracy,
      timeElapsed,
      errors,
      charactersTyped: userInput.length
    }
    
    onFinish(finalStats)
  }, [wpm, accuracy, timeElapsed, errors, userInput.length, onFinish])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log('Input changed:', value)
    if (!startTime && value.length > 0) {
      console.log('Calling startTest()')
      startTest()
    }
    if (isFinished) return
    setUserInput(value)
    // Check for errors
    let newErrors = 0
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        newErrors++
      }
    }
    setErrors(newErrors)
    // Check if test is complete
    if (settings.mode === 'words') {
      const wordsTyped = countWords(value)
      if (wordsTyped >= settings.wordCount) {
        finishTest()
      }
    } else if (value.length >= text.length) {
      finishTest()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      pauseTest()
    }
  }

  const getProgressPercentage = () => {
    if (settings.mode === 'words') {
      const wordsTyped = countWords(userInput)
      return Math.min((wordsTyped / settings.wordCount) * 100, 100)
    } else {
      return Math.min((userInput.length / text.length) * 100, 100)
    }
  }

  const getTimeRemaining = () => {
    if (settings.mode !== 'time') return null
    const remaining = Math.max(0, settings.timeLimit * 1000 - timeElapsed)
    const seconds = Math.ceil(remaining / 1000)
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with controls */}
      <div className={`card ${
        settings.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Mode: </span>
              <span className={`font-semibold ${
                settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              }`}>
                {settings.mode === 'time' ? `${settings.timeLimit}s` : 
                 settings.mode === 'words' ? `${settings.wordCount} words` : 'Custom'}
              </span>
            </div>
            
            {startTime && (
              <div className="text-sm">
                <span className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Time: </span>
                <span className={`font-mono font-semibold ${
                  settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {formatTime(timeElapsed)}
                </span>
              </div>
            )}
            
            {getTimeRemaining() && (
              <div className="text-sm">
                <span className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Remaining: </span>
                <span className={`font-mono font-semibold ${
                  getTimeRemaining() === '0:00' ? 'text-red-400' : 
                  settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {getTimeRemaining()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {startTime && (
              <button
                onClick={pauseTest}
                className={`p-2 rounded-lg transition-colors ${
                  settings.theme === 'dark'
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}
            
            <button
              onClick={onReset}
              className={`p-2 rounded-lg transition-colors ${
                settings.theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className={`w-full h-2 rounded-full ${
            settings.theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Progress: {getProgressPercentage().toFixed(1)}%
            </span>
            <span className={settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              {settings.mode === 'words' 
                ? `${countWords(userInput)}/${settings.wordCount} words`
                : `${userInput.length}/${text.length} characters`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Live stats */}
      {startTime && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`card text-center ${
            settings.theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className={`text-2xl font-bold ${
              wpm >= 80 ? 'text-green-400' : 
              wpm >= 60 ? 'text-yellow-400' : 
              wpm >= 40 ? 'text-blue-400' : 
              settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {wpm}
            </div>
            <div className={`text-xs ${
              settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>WPM</div>
          </div>
          
          <div className={`card text-center ${
            settings.theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className={`text-2xl font-bold ${
              accuracy >= 95 ? 'text-green-400' : 
              accuracy >= 85 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {accuracy}%
            </div>
            <div className={`text-xs ${
              settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Accuracy</div>
          </div>
          
          <div className={`card text-center ${
            settings.theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className={`text-2xl font-bold ${
              settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {errors}
            </div>
            <div className={`text-xs ${
              settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Errors</div>
          </div>
          
          <div className={`card text-center ${
            settings.theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200 shadow-lg'
          }`}>
            <div className={`text-2xl font-bold ${
              settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {userInput.length}
            </div>
            <div className={`text-xs ${
              settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Characters</div>
          </div>
        </div>
      )}

      {/* Text display */}
      <div className={`card p-6 ${
        settings.theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200 shadow-lg'
      }`}>
        <div className={`text-lg leading-relaxed font-mono ${
          settings.theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {text.split('').map((char, index) => {
            let className = ''
            if (index < userInput.length) {
              if (userInput[index] === char) {
                className = 'text-green-400'
              } else {
                className = 'text-red-400 bg-red-400/20'
              }
            } else if (index === userInput.length) {
              className = `${settings.theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'} ${settings.theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`
            }
            return (
              <span key={index} className={className}>
                {char}
              </span>
            )
          })}
        </div>
      </div>

      {/* Input field */}
      <div className="card p-4">
        <label htmlFor="typing-input" className="sr-only">Typing Input</label>
        <input
          id="typing-input"
          name="typing-input"
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isPaused || isFinished}
          placeholder={isPaused ? "Press ESC to resume..." : "Start typing here..."}
          className={`w-full p-4 text-lg font-mono border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
            settings.theme === 'dark'
              ? 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500 focus:border-primary-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500'
          } ${isPaused ? 'opacity-50' : ''}`}
        />
        <div className={`text-sm mt-2 ${
          settings.theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Press ESC to pause/resume • Type to start the test
        </div>
      </div>
    </div>
  )
}

export default TypingTest 