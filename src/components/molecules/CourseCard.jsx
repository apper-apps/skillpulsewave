import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const CourseCard = ({ course, progress = 0 }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate(`/courses/${course.Id}`)
  }
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="card cursor-pointer p-6 relative overflow-hidden"
    >
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          background: `linear-gradient(135deg, ${course.color}20 0%, ${course.color}40 100%)` 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-xl shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}CC 100%)` 
            }}
          >
            <ApperIcon name={course.icon} size={24} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-500">{course.duration}min</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.totalLessons} lessons</p>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${course.color} 0%, ${course.color}CC 100%)`
              }}
            />
          </div>
        </div>
        
        {/* Action */}
        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200">
          {progress > 0 ? 'Continue Learning' : 'Start Course'}
        </button>
      </div>
    </motion.div>
  )
}

export default CourseCard