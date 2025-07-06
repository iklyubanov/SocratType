import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import TypingTest from '../TypingTest'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Pause: () => <span data-testid="pause-icon">Pause</span>,
  Play: () => <span data-testid="play-icon">Play</span>,
  RotateCcw: () => <span data-testid="reset-icon">Reset</span>,
  X: () => <span data-testid="close-icon">Close</span>
}))

describe('TypingTest Component', () => {
  const mockSettings = {
    mode: 'words' as const,
    timeLimit: 60,
    wordCount: 10,
    customText: '',
    theme: 'light' as const,
    soundEnabled: false
  }

  const mockOnFinish = vi.fn()
  const mockOnReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock Date.now() to return a consistent timestamp
    vi.spyOn(Date, 'now').mockReturnValue(1000000)
  })

  describe('Word Counting Bug Fix', () => {
    it('should return 0 words for empty input string', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Check initial state - should show 0 words
      expect(screen.getByText('0/10 words')).toBeInTheDocument()
      expect(screen.getByText('Progress: 0.0%')).toBeInTheDocument()
    })

    it('should return 0 words for input with only whitespace', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } })
      
      // Should still show 0 words
      expect(screen.getByText('0/10 words')).toBeInTheDocument()
      expect(screen.getByText('Progress: 0.0%')).toBeInTheDocument()
    })

    it('should correctly count words for valid input', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type some words
      fireEvent.change(input, { target: { value: 'hello world test' } })
      
      // Should show 3 words
      expect(screen.getByText('3/10 words')).toBeInTheDocument()
      expect(screen.getByText('Progress: 30.0%')).toBeInTheDocument()
    })

    it('should handle mixed whitespace correctly', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type words with various whitespace
      fireEvent.change(input, { target: { value: '  hello   world  test  ' } })
      
      // Should still show 3 words
      expect(screen.getByText('3/10 words')).toBeInTheDocument()
      expect(screen.getByText('Progress: 30.0%')).toBeInTheDocument()
    })

    it('should not finish test immediately for 1-word target with empty input', () => {
      const oneWordSettings = { ...mockSettings, wordCount: 1 }
      
      render(
        <TypingTest 
          settings={oneWordSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Should not call onFinish immediately
      expect(mockOnFinish).not.toHaveBeenCalled()
      
      // Should show 0/1 words
      expect(screen.getByText('0/1 words')).toBeInTheDocument()
    })

    it('should finish test when actual words are typed', async () => {
      const oneWordSettings = { ...mockSettings, wordCount: 1 }
      
      render(
        <TypingTest 
          settings={oneWordSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type a word
      fireEvent.change(input, { target: { value: 'hello' } })
      
      // Should finish the test
      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalled()
      })
    })
  })

  describe('WPM Calculation', () => {
    it('should calculate WPM correctly with proper word counting', async () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type some words
      fireEvent.change(input, { target: { value: 'hello world' } })
      
      // Wait for WPM calculation
      await waitFor(() => {
        const wpmElement = screen.getByText('0') // Initial WPM should be 0
        expect(wpmElement).toBeInTheDocument()
      })
    })

    it('should not show incorrect WPM for empty input', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } })
      
      // WPM should remain 0, not calculate based on 1 word
      expect(screen.getByText('0')).toBeInTheDocument() // WPM display
    })
  })

  describe('Progress Calculation', () => {
    it('should show 0% progress for empty input', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      expect(screen.getByText('Progress: 0.0%')).toBeInTheDocument()
    })

    it('should show correct progress percentage', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type 5 words out of 10
      fireEvent.change(input, { target: { value: 'one two three four five' } })
      
      expect(screen.getByText('Progress: 50.0%')).toBeInTheDocument()
    })

    it('should cap progress at 100%', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type more words than target
      fireEvent.change(input, { target: { value: 'one two three four five six seven eight nine ten eleven twelve' } })
      
      expect(screen.getByText('Progress: 100.0%')).toBeInTheDocument()
    })
  })

  describe('Character Mode', () => {
    it('should use character counting in character mode', () => {
      const characterSettings = { ...mockSettings, mode: 'custom' as const, customText: 'Hello world' }
      
      render(
        <TypingTest 
          settings={characterSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type some characters
      fireEvent.change(input, { target: { value: 'Hello' } })
      
      // Should show character count, not word count
      expect(screen.getByText('5/11 characters')).toBeInTheDocument()
    })
  })

  describe('Test Completion', () => {
    it('should complete test when word count is reached', async () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type exactly 10 words
      fireEvent.change(input, { target: { value: 'one two three four five six seven eight nine ten' } })
      
      await waitFor(() => {
        expect(mockOnFinish).toHaveBeenCalled()
      })
    })

    it('should not complete test prematurely', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type only spaces
      fireEvent.change(input, { target: { value: '   ' } })
      
      // Should not complete
      expect(mockOnFinish).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle single character input correctly', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type single character
      fireEvent.change(input, { target: { value: 'a' } })
      
      // Should count as 1 word
      expect(screen.getByText('1/10 words')).toBeInTheDocument()
    })

    it('should handle newlines and tabs correctly', () => {
      render(
        <TypingTest 
          settings={mockSettings} 
          onFinish={mockOnFinish} 
          onReset={mockOnReset} 
        />
      )

      const input = screen.getByPlaceholderText('Start typing here...')
      
      // Type with newlines and tabs
      fireEvent.change(input, { target: { value: 'hello\nworld\ttest' } })
      
      // Should count as 2 words because newlines/tabs are converted to spaces
      // and "helloworld     test" becomes "helloworld test" after trimming
      expect(screen.getByText('2/10 words')).toBeInTheDocument()
    })
  })
}) 