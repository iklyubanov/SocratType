import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Pause, RotateCcw, Clock, Target } from 'lucide-react'

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

// Sample text for typing practice
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Pangrams are often used to display font samples and test keyboards.",
  "Programming is the art of telling another human being what one wants the computer to do. It requires logical thinking and creative problem-solving skills that can be developed through practice.",
  "Technology has transformed the way we live and work. From smartphones to artificial intelligence, innovations continue to shape our future. The pace of change accelerates every year.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Every expert was once a beginner who kept practicing and learning from their mistakes.",
  "The best way to predict the future is to invent it. Innovation comes from combining existing ideas in new ways and being willing to take risks and learn from failures."
]

const TypingTest: React.FC<TypingTestProps> = ({ settings, onFinish, onReset }) => {
  const [text, setText] = useState('')
  const [userInput, setUserInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  const finishTest = useCallback(() => {
    setIsFinished(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const minutes = timeElapsed / 60000
    const wordsTyped = userInput.split(' ').length
    const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0
    const accuracy = text.length > 0 ? Math.round(((text.length - errors) / text.length) * 100) : 0

    onFinish({
      wpm,
      accuracy,
      timeElapsed,
      errors,
      charactersTyped: userInput.length
    })
  }, [timeElapsed, userInput, text.length, errors, onFinish])

  // Generate or load text based on settings
  useEffect(() => {
    let newText = ''
    if (settings.mode === 'custom' && settings.customText) {
      newText = settings.customText
    } else {
      // For now, use sample texts. Later this will be replaced with AI-generated text
      const randomIndex = Math.floor(Math.random() * sampleTexts.length)
      newText = sampleTexts[randomIndex]
      
      // If word count mode, limit to specified number of words
      if (settings.mode === 'words') {
        const words = newText.split(' ')
        newText = words.slice(0, settings.wordCount).join(' ')
      }
    }
    setText(newText)
  }, [settings])

  // Timer logic
  useEffect(() => {
    if (startTime && !isPaused && !isFinished) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(Date.now() - startTime)
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTime, isPaused, isFinished])

  // Check for test completion
  useEffect(() => {
    if (currentIndex >= text.length && startTime) {
      finishTest()
    }
  }, [currentIndex, text.length, startTime, finishTest])

  // Time limit check
  useEffect(() => {
    if (settings.mode === 'time' && timeElapsed >= settings.timeLimit * 1000 && startTime) {
      finishTest()
    }
  }, [timeElapsed, settings.mode, settings.timeLimit, startTime, finishTest])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    if (!startTime) {
      setStartTime(Date.now())
    }

    if (value.length <= text.length) {
      setUserInput(value)
      setCurrentIndex(value.length)
      
      // Count errors
      let newErrors = 0
      for (let i = 0; i < value.length; i++) {
        if (value[i] !== text[i]) {
          newErrors++
        }
      }
      setErrors(newErrors)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onReset()
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  const getCharacterClass = (index: number) => {
    if (index < currentIndex) {
      return userInput[index] === text[index] ? 'typing-correct' : 'typing-incorrect'
    } else if (index === currentIndex) {
      return 'typing-current'
    } else {
      return 'typing-upcoming'
    }
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const progress = text.length > 0 ? (currentIndex / text.length) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="font-mono">
              {formatTime(timeElapsed)}
              {settings.mode === 'time' && (
                <span className="text-gray-600"> / {settings.timeLimit}s</span>
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <Target className="w-5 h-5" />
            <span className="font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={togglePause}
            className="btn-secondary flex items-center space-x-2"
            disabled={isFinished}
          >
            <Pause className="w-4 h-4" />
            <span>{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-800 rounded-full h-2">
        <motion.div
          className="bg-primary-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Typing area */}
      <div className="card min-h-[200px] relative">
        <div className="typing-text whitespace-pre-wrap leading-relaxed">
          {text.split('').map((char, index) => (
            <span
              key={index}
              className={`${getCharacterClass(index)} ${
                char === ' ' ? 'bg-gray-700/30' : ''
              }`}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Hidden input for capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 opacity-0 cursor-default"
          autoFocus
          disabled={isPaused || isFinished}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Instructions */}
      <div className="text-center text-gray-400 text-sm">
        <p>Type the text above. Press <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd> to reset.</p>
      </div>
    </motion.div>
  )
}

export default TypingTest 