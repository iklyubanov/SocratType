import { motion } from 'framer-motion'
import { Play, RotateCcw, Trophy, Target, Clock, Zap, TrendingUp } from 'lucide-react'

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

const Stats: React.FC<StatsProps> = ({ stats, onRestart, onNewTest }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-400'
    if (accuracy >= 85) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getWpmColor = (wpm: number) => {
    if (wpm >= 80) return 'text-green-400'
    if (wpm >= 60) return 'text-yellow-400'
    if (wpm >= 40) return 'text-blue-400'
    return 'text-gray-600 dark:text-gray-400'
  }

  const getPerformanceMessage = () => {
    if (stats.wpm >= 80 && stats.accuracy >= 95) {
      return { message: "Excellent! You're a typing master!", icon: Trophy, color: "text-yellow-400" }
    } else if (stats.wpm >= 60 && stats.accuracy >= 90) {
      return { message: "Great job! Keep practicing!", icon: TrendingUp, color: "text-green-400" }
    } else if (stats.wpm >= 40 && stats.accuracy >= 85) {
      return { message: "Good progress! Focus on accuracy.", icon: Target, color: "text-blue-400" }
    } else {
      return { message: "Keep practicing! Speed and accuracy will improve.", icon: Zap, color: 'text-gray-600 dark:text-gray-400' }
    }
  }

  const performance = getPerformanceMessage()
  const PerformanceIcon = performance.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Performance Message */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gray-100 dark:bg-gray-800"
        >
          <PerformanceIcon className={`w-8 h-8 ${performance.color}`} />
        </motion.div>
        <h2 className={`text-2xl font-bold ${performance.color}`}>
          {performance.message}
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Zap className="w-6 h-6 text-primary-400" />
          </div>
          <div className={`text-3xl font-bold ${getWpmColor(stats.wpm)}`}>
            {stats.wpm}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">WPM</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Target className="w-6 h-6 text-primary-400" />
          </div>
          <div className={`text-3xl font-bold ${getAccuracyColor(stats.accuracy)}`}>
            {stats.accuracy}%
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Accuracy</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatTime(stats.timeElapsed)}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Time</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-primary-400" />
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {stats.charactersTyped}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Characters</div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Detailed Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Errors:</span>
            <span className="text-red-400 font-mono">{stats.errors}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Characters per Minute:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">
              {stats.timeElapsed > 0 ? Math.round((stats.charactersTyped / stats.timeElapsed) * 60000) : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Average Word Length:</span>
            <span className="font-mono text-gray-900 dark:text-gray-100">
              {stats.charactersTyped > 0 ? Math.round(stats.charactersTyped / (stats.wpm || 1)) : 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Error Rate:</span>
            <span className="text-red-400 font-mono">
              {stats.charactersTyped > 0 ? ((stats.errors / stats.charactersTyped) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onRestart}
          className="btn-primary flex items-center justify-center space-x-2 text-lg px-8 py-4"
        >
          <Play className="w-5 h-5" />
          <span>Try Again</span>
        </button>
        
        <button
          onClick={onNewTest}
          className="btn-secondary flex items-center justify-center space-x-2 text-lg px-8 py-4"
        >
          <RotateCcw className="w-5 h-5" />
          <span>New Test</span>
        </button>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-center text-sm text-gray-600 dark:text-gray-400"
      >
        <p>
          💡 Tip: Practice regularly to improve your typing speed and accuracy. 
          Focus on accuracy first, then gradually increase your speed.
        </p>
      </motion.div>
    </motion.div>
  )
}

export default Stats 