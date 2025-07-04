import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import QuizQuestion from '@/components/molecules/QuizQuestion'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { QuizService } from '@/services/api/quizService'
import { LessonsService } from '@/services/api/lessonsService'
import { CoursesService } from '@/services/api/coursesService'

const Quiz = () => {
  const { courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  
  useEffect(() => {
    loadData()
  }, [courseId, lessonId])
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [quizData, lessonData, courseData] = await Promise.all([
        QuizService.getByLessonId(parseInt(lessonId)),
        LessonsService.getById(parseInt(lessonId)),
        CoursesService.getById(parseInt(courseId))
      ])
      
      setQuiz(quizData)
      setLesson(lessonData)
      setCourse(courseData)
      
    } catch (err) {
      setError('Failed to load quiz')
      console.error('Error loading quiz:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadData()
  }
  
  const handleAnswer = (isCorrect) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = isCorrect
    setAnswers(newAnswers)
    
    // Auto-advance to next question after a delay
    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        // Calculate final score
        const correctAnswers = newAnswers.filter(answer => answer === true).length
        const finalScore = Math.round((correctAnswers / quiz.questions.length) * 100)
        setScore(finalScore)
        setShowResults(true)
        
        // Show appropriate toast
        if (finalScore >= 80) {
          toast.success(`Excellent! You scored ${finalScore}%`)
        } else if (finalScore >= 60) {
          toast.success(`Good job! You scored ${finalScore}%`)
        } else {
          toast.warn(`You scored ${finalScore}%. Consider reviewing the lesson.`)
        }
      }
    }, 2000)
  }
  
  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
    setScore(0)
  }
  
  const handleBackToLesson = () => {
    navigate(`/courses/${courseId}/lesson/${lessonId}`)
  }
  
  const handleNextLesson = () => {
    navigate(`/courses/${courseId}`)
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded mb-4 shimmer w-32" />
          <div className="h-8 bg-gray-200 rounded mb-4 shimmer w-64" />
        </div>
        <Loading />
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="p-4">
        <Error message={error} onRetry={handleRetry} />
      </div>
    )
  }
  
  if (!quiz || !lesson || !course) {
    return (
      <div className="p-4">
        <Error message="Quiz not found" onRetry={() => navigate(`/courses/${courseId}`)} />
      </div>
    )
  }
  
  const correctAnswers = answers.filter(answer => answer === true).length
  const totalQuestions = quiz.questions.length
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/courses/${courseId}/lesson/${lessonId}`)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={24} className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Quiz: {lesson.title}</h1>
            <p className="text-sm text-gray-600">{course.title}</p>
          </div>
        </div>
        
        {/* Progress indicator */}
        {!showResults && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {!showResults ? (
          /* Quiz Questions */
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <QuizQuestion
              question={quiz.questions[currentQuestion]}
              onAnswer={handleAnswer}
              showResult={answers[currentQuestion] !== undefined}
            />
          </motion.div>
        ) : (
          /* Quiz Results */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="card p-8 text-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                <ApperIcon 
                  name={score >= 80 ? 'Trophy' : score >= 60 ? 'Award' : 'RefreshCw'} 
                  size={48} 
                  className="text-white" 
                />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good Job!' : 'Keep Learning!'}
              </h2>
              
              <p className="text-xl text-gray-600 mb-6">
                You scored {score}% ({correctAnswers}/{totalQuestions} correct)
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quiz Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                    <div className="text-sm text-gray-600">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{score}%</div>
                    <div className="text-sm text-gray-600">Score</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRetakeQuiz}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="RefreshCw" size={20} />
                  <span>Retake Quiz</span>
                </Button>
                
                <Button
                  onClick={handleBackToLesson}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <ApperIcon name="BookOpen" size={20} />
                  <span>Back to Lesson</span>
                </Button>
                
                <Button
                  onClick={handleNextLesson}
                  className="flex items-center space-x-2"
                >
                  <span>Continue Learning</span>
                  <ApperIcon name="ChevronRight" size={20} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Quiz