import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'courses') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shimmer" />
              <div className="w-12 h-4 bg-gray-200 rounded shimmer" />
            </div>
            <div className="h-6 bg-gray-200 rounded mb-2 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 shimmer" />
            <div className="h-2 bg-gray-200 rounded mb-2 shimmer" />
            <div className="h-8 bg-gray-200 rounded shimmer" />
          </div>
        ))}
      </div>
    )
  }
  
  if (type === 'lessons') {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full shimmer" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded mb-2 shimmer" />
                <div className="h-4 bg-gray-200 rounded w-2/3 shimmer" />
              </div>
              <div className="w-5 h-5 bg-gray-200 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  if (type === 'video') {
    return (
      <div className="bg-black rounded-lg overflow-hidden aspect-video">
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full shimmer" />
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-3/4 shimmer" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="h-8 bg-gray-200 rounded mb-4 shimmer" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded shimmer" />
          <div className="h-4 bg-gray-200 rounded w-5/6 shimmer" />
          <div className="h-4 bg-gray-200 rounded w-4/6 shimmer" />
        </div>
      </div>
      
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg">
            <div className="h-32 bg-gray-200 rounded-lg mb-4 shimmer" />
            <div className="h-5 bg-gray-200 rounded mb-2 shimmer" />
            <div className="h-4 bg-gray-200 rounded w-2/3 shimmer" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading