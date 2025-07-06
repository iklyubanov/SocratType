import { motion, AnimatePresence } from 'framer-motion'
import { X, Moon, Sun, Volume2, VolumeX, Clock, Target, FileText } from 'lucide-react'

interface TestSettings {
  mode: 'time' | 'words' | 'custom'
  timeLimit: number
  wordCount: number
  customText: string
  theme: 'dark' | 'light'
  soundEnabled: boolean
}

interface SettingsPanelProps {
  settings: TestSettings
  onSettingsChange: (settings: TestSettings) => void
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClose }) => {
  const updateSetting = <K extends keyof TestSettings>(key: K, value: TestSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border p-6 bg-white border-gray-200 text-gray-900 shadow-xl dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Test Mode */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Test Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => updateSetting('mode', 'time')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.mode === 'time'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Clock className={`w-6 h-6 mb-2 ${
                    settings.mode === 'time' ? 'text-primary-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div className={`font-semibold ${
                    settings.mode === 'time' ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Time Mode
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Race against the clock
                  </div>
                </button>

                <button
                  onClick={() => updateSetting('mode', 'words')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.mode === 'words'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Target className={`w-6 h-6 mb-2 ${
                    settings.mode === 'words' ? 'text-primary-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div className={`font-semibold ${
                    settings.mode === 'words' ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Word Count
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Type specific words
                  </div>
                </button>

                <button
                  onClick={() => updateSetting('mode', 'custom')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.mode === 'custom'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <FileText className={`w-6 h-6 mb-2 ${
                    settings.mode === 'custom' ? 'text-primary-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <div className={`font-semibold ${
                    settings.mode === 'custom' ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Custom Text
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Your own content
                  </div>
                </button>
              </div>
            </div>

            {/* Mode-specific settings */}
            {settings.mode === 'time' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Time Limit (seconds)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[30, 60, 120, 300].map((time) => (
                    <button
                      key={time}
                      onClick={() => updateSetting('timeLimit', time)}
                      className={`py-2 px-4 rounded-lg border transition-colors ${
                        settings.timeLimit === time
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {time}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {settings.mode === 'words' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Word Count
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((count) => (
                    <button
                      key={count}
                      onClick={() => updateSetting('wordCount', count)}
                      className={`py-2 px-4 rounded-lg border transition-colors ${
                        settings.wordCount === count
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {settings.mode === 'custom' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Custom Text
                </label>
                <textarea
                  value={settings.customText}
                  onChange={(e) => updateSetting('customText', e.target.value)}
                  placeholder="Enter your custom text here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Theme Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Appearance
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    settings.theme === 'light'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Sun className={`w-5 h-5 ${
                    settings.theme === 'light' ? 'text-primary-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    settings.theme === 'light' ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Light
                  </span>
                </button>

                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  <Moon className={`w-5 h-5 ${
                    settings.theme === 'dark' ? 'text-primary-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    settings.theme === 'dark' ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    Dark
                  </span>
                </button>
              </div>
            </div>

            {/* Sound Settings */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Sound
              </h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    settings.soundEnabled
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                  }`}
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-primary-400" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <span className={`font-medium ${
                    settings.soundEnabled ? 'text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {settings.soundEnabled ? 'Sound On' : 'Sound Off'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={onClose}
              className="btn-primary px-6 py-2"
            >
              Done
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SettingsPanel 