import { motion } from 'framer-motion'
import { useState } from 'react'
import Button from '@/components/atoms/Button'

const QuizQuestion = ({ question, onAnswer, showResult = false }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  
  const handleAnswerSelect = (optionIndex) => {
    if (hasAnswered) return
    setSelectedAnswer(optionIndex)
  }
  
  const handleSubmit = () => {
    if (selectedAnswer === null) return
    setHasAnswered(true)
    onAnswer(selectedAnswer === question.correctAnswer)
  }
  
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">{question.question}</h3>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: hasAnswered ? 1 : 1.02 }}
            whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
              hasAnswered
                ? index === question.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : index === selectedAnswer
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                : selectedAnswer === index
                ? 'border-primary bg-primary bg-opacity-10 text-primary'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
            disabled={hasAnswered}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                hasAnswered
                  ? index === question.correctAnswer
                    ? 'border-green-500 bg-green-500'
                    : index === selectedAnswer
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-300'
                  : selectedAnswer === index
                  ? 'border-primary bg-primary'
                  : 'border-gray-300'
              }`}>
                {((hasAnswered && index === question.correctAnswer) || 
                  (!hasAnswered && selectedAnswer === index)) && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
      
      {!hasAnswered && (
        <Button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="w-full"
        >
          Submit Answer
        </Button>
      )}
      
      {hasAnswered && showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <p className={`font-medium ${
            selectedAnswer === question.correctAnswer ? 'text-green-800' : 'text-red-800'
          }`}>
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          {question.explanation && (
            <p className="text-gray-600 mt-2 text-sm">{question.explanation}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default QuizQuestion