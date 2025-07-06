import { motion } from 'framer-motion'
import { X, Clock, Target, FileText, Moon, Sun, Volume2, VolumeX } from 'lucide-react'

interface SettingsPanelProps {
  settings: {
    mode: 'time' | 'words' | 'custom'
    timeLimit: number
    wordCount: number
    customText: string
    theme: 'dark' | 'light'
    soundEnabled: boolean
  }
  onSettingsChange: (settings: any) => void
  onClose: () => void
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange, onClose }) => {
  const updateSetting = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Test Mode */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Test Mode</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="time"
                  checked={settings.mode === 'time'}
                  onChange={(e) => updateSetting('mode', e.target.value)}
                  className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Time Mode</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="words"
                  checked={settings.mode === 'words'}
                  onChange={(e) => updateSetting('mode', e.target.value)}
                  className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Word Count</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="custom"
                  checked={settings.mode === 'custom'}
                  onChange={(e) => updateSetting('mode', e.target.value)}
                  className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Custom Text</span>
                </div>
              </label>
            </div>
          </div>

          {/* Time Limit */}
          {settings.mode === 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Limit (seconds)
              </label>
              <select
                value={settings.timeLimit}
                onChange={(e) => updateSetting('timeLimit', parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
          )}

          {/* Word Count */}
          {settings.mode === 'words' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Word Count
              </label>
              <select
                value={settings.wordCount}
                onChange={(e) => updateSetting('wordCount', parseInt(e.target.value))}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={10}>10 words</option>
                <option value={25}>25 words</option>
                <option value={50}>50 words</option>
                <option value={100}>100 words</option>
                <option value={200}>200 words</option>
              </select>
            </div>
          )}

          {/* Custom Text */}
          {settings.mode === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Text
              </label>
              <textarea
                value={settings.customText}
                onChange={(e) => updateSetting('customText', e.target.value)}
                placeholder="Enter your custom text here..."
                rows={4}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* Theme */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Theme</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={settings.theme === 'dark'}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Dark</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={settings.theme === 'light'}
                  onChange={(e) => updateSetting('theme', e.target.value)}
                  className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Light</span>
                </div>
              </label>
            </div>
          </div>

          {/* Sound */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Sound</h3>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <div className="flex items-center space-x-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-primary-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-gray-300">Enable sound effects</span>
              </div>
            </label>
          </div>

          {/* Coming Soon */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-3">Coming Soon</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• AI-generated text in your preferred style</p>
              <p>• Custom themes and color schemes</p>
              <p>• Detailed analytics and progress tracking</p>
              <p>• Multiplayer typing competitions</p>
              <p>• Mobile-optimized interface</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel 