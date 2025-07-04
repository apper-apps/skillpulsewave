import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { ForumService } from '@/services/api/forumService'

const Community = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'general'
  })
  
  const categories = [
    { id: 'all', label: 'All Posts', icon: 'MessageSquare' },
    { id: 'general', label: 'General', icon: 'MessageCircle' },
    { id: 'time-management', label: 'Time Management', icon: 'Clock' },
    { id: 'communication', label: 'Communication', icon: 'MessageSquare' },
    { id: 'body-language', label: 'Body Language', icon: 'Eye' },
    { id: 'finance', label: 'Finance', icon: 'DollarSign' },
    { id: 'success-stories', label: 'Success Stories', icon: 'Trophy' },
    { id: 'questions', label: 'Questions', icon: 'HelpCircle' }
  ]
  
  useEffect(() => {
    loadPosts()
  }, [])
  
  const loadPosts = async () => {
    try {
      setError('')
      setLoading(true)
      
      const postsData = await ForumService.getAll()
      setPosts(postsData)
      
    } catch (err) {
      setError('Failed to load community posts')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleRetry = () => {
    loadPosts()
  }
  
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      const postData = {
        ...newPost,
        userId: 'user_1', // In a real app, this would come from auth
        timestamp: new Date().toISOString(),
        upvotes: 0,
        replies: []
      }
      
      await ForumService.create(postData)
      
      setNewPost({ title: '', content: '', category: 'general' })
      setShowNewPost(false)
      toast.success('Post created successfully!')
      
      // Reload posts
      loadPosts()
      
    } catch (err) {
      console.error('Error creating post:', err)
      toast.error('Failed to create post')
    }
  }
  
  const handleUpvote = async (postId) => {
    try {
      const updatedPost = await ForumService.upvote(postId)
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.Id === postId ? { ...post, upvotes: updatedPost.upvotes } : post
        )
      )
      toast.success('Post upvoted!')
    } catch (err) {
      console.error('Error upvoting post:', err)
      toast.error('Failed to upvote post')
    }
  }
  
  const getFilteredPosts = () => {
    let filtered = posts
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Sort by upvotes and timestamp
    return filtered.sort((a, b) => {
      if (a.upvotes !== b.upvotes) {
        return b.upvotes - a.upvotes
      }
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  }
  
  const getCategoryIcon = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : 'MessageCircle'
  }
  
  const getCategoryLabel = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.label : 'General'
  }
  
  const getTrendingPosts = () => {
    return posts
      .filter(post => post.upvotes > 0)
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 5)
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
  
  const filteredPosts = getFilteredPosts()
  const trendingPosts = getTrendingPosts()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Community</h1>
            <p className="text-gray-600">Connect, share, and learn together</p>
          </div>
          <Button
            onClick={() => setShowNewPost(!showNewPost)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={20} />
            <span>New Post</span>
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search discussions..."
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
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="small"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <ApperIcon name={category.icon} size={16} />
              <span>{category.label}</span>
            </Button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {/* New Post Form */}
        {showNewPost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Post</h3>
            <div className="space-y-4">
              <Input
                label="Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title"
              />
              
              <div>
                <label className="form-label">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="form-input"
                >
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="form-label">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share your thoughts, questions, or experiences..."
                  rows={4}
                  className="form-input"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowNewPost(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Create Post
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {filteredPosts.length === 0 ? (
              <Empty
                icon="MessageSquare"
                title="No discussions found"
                description={searchTerm ? "Try adjusting your search terms" : "Be the first to start a discussion!"}
                actionLabel="Create Post"
                onAction={() => setShowNewPost(true)}
              />
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="card p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {post.userId?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center space-x-1">
                            <ApperIcon name={getCategoryIcon(post.category)} size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-500">{getCategoryLabel(post.category)}</span>
                          </div>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.content}</p>
                        
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleUpvote(post.Id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="ThumbsUp" size={16} />
                            <span className="text-sm">{post.upvotes}</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                            <ApperIcon name="MessageCircle" size={16} />
                            <span className="text-sm">{post.replies?.length || 0} replies</span>
                          </button>
                          
                          <button className="flex items-center space-x-1 text-gray-500 hover:text-primary transition-colors">
                            <ApperIcon name="Share" size={16} />
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Posts */}
            {trendingPosts.length > 0 && (
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Trending Posts</h3>
                <div className="space-y-3">
                  {trendingPosts.map(post => (
                    <div key={post.Id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-secondary rounded-full flex items-center justify-center">
                          <ApperIcon name="TrendingUp" size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm line-clamp-2">{post.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{post.upvotes} upvotes</span>
                          <span>•</span>
                          <span>{post.replies?.length || 0} replies</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Community Guidelines */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Be respectful and supportive</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Share constructive feedback</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Keep discussions relevant</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ApperIcon name="Check" size={16} className="text-green-500 mt-0.5" />
                  <span>Help others learn and grow</span>
                </li>
              </ul>
            </div>
            
            {/* Quick Stats */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-semibold text-gray-800">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Categories</span>
                  <span className="font-semibold text-gray-800">{categories.length - 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Upvotes</span>
                  <span className="font-semibold text-gray-800">
                    {posts.reduce((sum, post) => sum + post.upvotes, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Community