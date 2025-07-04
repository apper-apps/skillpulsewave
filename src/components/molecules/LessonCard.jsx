import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const LessonCard = ({ lesson, courseId, isCompleted = false, isLocked = false }) => {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (!isLocked) {
      navigate(`/courses/${courseId}/lesson/${lesson.Id}`)
    }
  }
  
  return (
    <motion.div
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      whileTap={{ scale: isLocked ? 1 : 0.98 }}
      onClick={handleClick}
      className={`card cursor-pointer p-4 relative ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center space-x-4">
        {/* Status indicator */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-gradient-to-r from-green-400 to-green-500' :
          isLocked ? 'bg-gray-300' :
          'bg-gradient-primary'
        }`}>
          {isCompleted ? (
            <ApperIcon name="Check" size={16} className="text-white" />
          ) : isLocked ? (
            <ApperIcon name="Lock" size={16} className="text-gray-600" />
          ) : (
            <ApperIcon name="Play" size={16} className="text-white" />
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 mb-1">{lesson.title}</h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" size={14} />
              <span>{lesson.duration}min</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="PlayCircle" size={14} />
              <span>Video</span>
            </div>
          </div>
        </div>
        
        {/* Arrow */}
        <div className="text-gray-400">
          <ApperIcon name="ChevronRight" size={20} />
        </div>
      </div>
    </motion.div>
  )
}

export default LessonCard