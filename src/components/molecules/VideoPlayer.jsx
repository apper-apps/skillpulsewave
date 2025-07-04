import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const VideoPlayer = ({ videoUrl, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const videoRef = useRef(null)
  
  // Fallback video URLs for when primary source fails
  const fallbackUrls = [
    videoUrl,
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4'
  ]
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }
  
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }
  
const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
      setHasError(false)
    }
  }
  
  const handleVideoError = () => {
    console.error('Video loading error for URL:', fallbackUrls[currentVideoIndex])
    
    // Try next fallback URL
    if (currentVideoIndex < fallbackUrls.length - 1) {
      setCurrentVideoIndex(prev => prev + 1)
      setIsLoading(true)
      setHasError(false)
    } else {
      // All fallbacks failed
      setHasError(true)
      setIsLoading(false)
      toast.error('Unable to load video. Please try again later.')
    }
  }
  
  const handleVideoLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }
  
  const handleVideoCanPlay = () => {
    setIsLoading(false)
    setHasError(false)
  }
  
  const handleRetryVideo = () => {
    setCurrentVideoIndex(0)
    setIsLoading(true)
    setHasError(false)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }
  
  const handleVideoEnd = () => {
    setIsPlaying(false)
    onComplete && onComplete()
  }
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  
return (
    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
      {/* Video element */}
      <video
        ref={videoRef}
        src={fallbackUrls[currentVideoIndex]}
        className="w-full h-full object-cover"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnd}
        onError={handleVideoError}
        onLoadStart={handleVideoLoadStart}
        onCanPlay={handleVideoCanPlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="AlertCircle" size={32} className="text-white" />
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-300 text-sm mb-4">
              Unable to load the video content. This may be due to network issues or the video being temporarily unavailable.
            </p>
            <Button
              onClick={handleRetryVideo}
              className="bg-white text-black hover:bg-gray-200"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Retry Video
            </Button>
          </div>
        </div>
      )}
      
{/* Video overlay */}
      {!isLoading && !hasError && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          {/* Play button overlay */}
          {!isPlaying && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayPause}
              className="bg-white bg-opacity-90 rounded-full p-6 shadow-lg"
            >
              <ApperIcon name="Play" size={48} className="text-gray-800 ml-1" />
            </motion.button>
          )}
        </div>
      )}
      
{/* Controls */}
      {!isLoading && !hasError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
        >
        {/* Progress bar */}
        <div
          className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-white rounded-full transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        {/* Controls row */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </button>
            <span className="text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
              <ApperIcon name="Volume2" size={20} />
            </button>
            <button className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors">
              <ApperIcon name="Maximize" size={20} />
            </button>
          </div>
</div>
        </motion.div>
      )}
    </div>
  )
}

export default VideoPlayer