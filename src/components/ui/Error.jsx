import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = 'Something went wrong', onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-red-100 to-red-50 p-8 rounded-2xl shadow-lg">
          <div className="bg-gradient-to-r from-red-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="AlertCircle" size={32} className="text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          
          {onRetry && (
            <Button onClick={onRetry} className="w-full">
              <ApperIcon name="RefreshCw" size={20} className="mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Error