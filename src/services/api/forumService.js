import forumData from '@/services/mockData/forum.json'

export const ForumService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...forumData]
  },

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const post = forumData.find(post => post.Id === id)
    if (!post) {
      throw new Error('Post not found')
    }
    return { ...post }
  },

  async getByCategory(category) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250))
    const posts = forumData.filter(post => post.category === category)
    return posts.map(post => ({ ...post }))
  },

  async create(postData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const newId = Math.max(...forumData.map(p => p.Id)) + 1
    const newPost = {
      Id: newId,
      ...postData,
      upvotes: 0,
      replies: []
    }
    forumData.push(newPost)
    return { ...newPost }
  },

  async upvote(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    const index = forumData.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    forumData[index].upvotes += 1
    return { ...forumData[index] }
  },

  async addReply(id, replyData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = forumData.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    
    const reply = {
      id: Date.now(),
      ...replyData,
      timestamp: new Date().toISOString()
    }
    
    forumData[index].replies.push(reply)
    return { ...forumData[index] }
  },

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = forumData.findIndex(post => post.Id === id)
    if (index === -1) {
      throw new Error('Post not found')
    }
    const deletedPost = forumData.splice(index, 1)[0]
    return { ...deletedPost }
  }
}