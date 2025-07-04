import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = 'BookOpen', 
  title = 'Nothing here yet', 
  description = 'Get started by exploring our features',
  actionLabel = 'Get Started',
  onAction 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-surface p-8 rounded-2xl shadow-lg">
          <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name={icon} size={32} className="text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{description}</p>
          
          {onAction && (
            <Button onClick={onAction} className="w-full">
              <ApperIcon name="ArrowRight" size={20} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Empty