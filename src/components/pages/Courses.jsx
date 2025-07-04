import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import CourseCard from '@/components/molecules/CourseCard'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { CoursesService } from '@/services/api/coursesService'
import { ProgressService } from '@/services/api/progressService'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const categories = [
    { id: 'all', label: 'All Courses', icon: 'BookOpen' },
    { id: 'time-management', label: 'Time Management', icon: 'Clock' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare' },
    { id: 'body-language', label: 'Body Language', icon: 'Eye' },
    { id: 'finance', label: 'Finance', icon: 'DollarSign' }
  ]
  
  useEffect(() => {
    loadData()
  }, [])
  
  const loadData = async () => {
    try {
      setError('')
      setLoading(true)
      
      const [coursesData, progressData] = await Promise.all([
        CoursesService.getAll(),
        ProgressService.getAll()
      ])
      
      setCourses(coursesData)
      setProgress(progressData)
      
    } catch (err) {
      setError('Failed to load courses')
      console.error('Error loading courses:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadData()
  }
  
  const getCourseProgress = (courseId) => {
    const courseProgress = progress.find(p => p.courseId === courseId)
    if (!courseProgress) return 0
    
    const course = courses.find(c => c.Id === courseId)
    if (!course) return 0
    
    const completedLessons = courseProgress.completedLessons ? courseProgress.completedLessons.length : 0
    return Math.round((completedLessons / course.totalLessons) * 100)
  }
  
  const getFilteredCourses = () => {
    let filtered = courses
    
    // Filter by category
    if (filter !== 'all') {
      filtered = filtered.filter(course => course.category === filter)
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    return filtered
  }
  
  const groupCoursesByProgress = () => {
    const filteredCourses = getFilteredCourses()
    
    const inProgress = filteredCourses.filter(course => {
      const progressPercent = getCourseProgress(course.Id)
      return progressPercent > 0 && progressPercent < 100
    })
    
    const completed = filteredCourses.filter(course => {
      const progressPercent = getCourseProgress(course.Id)
      return progressPercent === 100
    })
    
    const notStarted = filteredCourses.filter(course => {
      const progressPercent = getCourseProgress(course.Id)
      return progressPercent === 0
    })
    
    return { inProgress, completed, notStarted }
  }
  
  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded mb-4 shimmer w-48" />
          <div className="h-12 bg-gray-200 rounded mb-4 shimmer" />
          <div className="flex space-x-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded w-24 shimmer" />
            ))}
          </div>
        </div>
        <Loading type="courses" />
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
  
  const filteredCourses = getFilteredCourses()
  const { inProgress, completed, notStarted } = groupCoursesByProgress()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Courses</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        
        {/* Category filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={filter === category.id ? 'primary' : 'outline'}
              size="small"
              onClick={() => setFilter(category.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <ApperIcon name={category.icon} size={16} />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {filteredCourses.length === 0 ? (
          <Empty
            icon="BookOpen"
            title="No courses found"
            description={searchTerm ? "Try adjusting your search terms" : "No courses available in this category"}
            actionLabel="Clear Filters"
            onAction={() => {
              setFilter('all')
              setSearchTerm('')
            }}
          />
        ) : (
          <div className="space-y-8">
            {/* In Progress */}
            {inProgress.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-primary w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="PlayCircle" size={18} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
                  <span className="ml-2 bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                    {inProgress.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgress.map(course => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CourseCard
                        course={course}
                        progress={getCourseProgress(course.Id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Not Started */}
            {notStarted.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-secondary w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="BookOpen" size={18} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Start Learning</h2>
                  <span className="ml-2 bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded-full text-sm font-medium">
                    {notStarted.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notStarted.map(course => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CourseCard
                        course={course}
                        progress={getCourseProgress(course.Id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <ApperIcon name="CheckCircle" size={18} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Completed</h2>
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    {completed.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completed.map(course => (
                    <motion.div
                      key={course.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CourseCard
                        course={course}
                        progress={getCourseProgress(course.Id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Courses