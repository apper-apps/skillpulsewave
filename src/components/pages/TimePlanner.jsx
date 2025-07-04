import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format, startOfDay, addMinutes, isAfter, isBefore } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'

const TimePlanner = () => {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [timeSlots, setTimeSlots] = useState([])
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: '', duration: 30, priority: 'medium' })
  const [draggedTask, setDraggedTask] = useState(null)
  const [showAddTask, setShowAddTask] = useState(false)
  
  const priorities = [
    { value: 'high', label: 'High Priority', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { value: 'low', label: 'Low Priority', color: 'text-green-600', bg: 'bg-green-100' }
  ]
  
  useEffect(() => {
    generateTimeSlots()
    loadTasks()
  }, [selectedDate])
  
  const generateTimeSlots = () => {
    const slots = []
    const startTime = startOfDay(new Date(selectedDate))
    
    for (let hour = 6; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = addMinutes(startTime, hour * 60 + minute)
        slots.push({
          time,
          id: `${hour}-${minute}`,
          label: format(time, 'h:mm a'),
          isAvailable: true,
          task: null
        })
      }
    }
    
    setTimeSlots(slots)
  }
  
  const loadTasks = () => {
    const savedTasks = localStorage.getItem(`time_planner_tasks_${selectedDate}`)
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      
      // Update time slots with assigned tasks
      setTimeSlots(prevSlots => 
        prevSlots.map(slot => {
          const assignedTask = parsedTasks.find(task => task.timeSlot === slot.id)
          return {
            ...slot,
            task: assignedTask || null,
            isAvailable: !assignedTask
          }
        })
      )
    }
  }
  
  const saveTasks = (updatedTasks) => {
    localStorage.setItem(`time_planner_tasks_${selectedDate}`, JSON.stringify(updatedTasks))
  }
  
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    const task = {
      id: Date.now(),
      title: newTask.title,
      duration: newTask.duration,
      priority: newTask.priority,
      timeSlot: null,
      completed: false
    }
    
    const updatedTasks = [...tasks, task]
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    
    setNewTask({ title: '', duration: 30, priority: 'medium' })
    setShowAddTask(false)
    toast.success('Task added successfully!')
  }
  
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    
    // Update time slots
    setTimeSlots(prevSlots => 
      prevSlots.map(slot => ({
        ...slot,
        task: slot.task?.id === taskId ? null : slot.task,
        isAvailable: slot.task?.id === taskId ? true : slot.isAvailable
      }))
    )
    
    toast.success('Task deleted successfully!')
  }
  
  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = (e, targetSlot) => {
    e.preventDefault()
    
    if (!draggedTask || !targetSlot.isAvailable) return
    
    // Check if task can fit in available slots
    const slotsNeeded = Math.ceil(draggedTask.duration / 30)
    const targetIndex = timeSlots.findIndex(slot => slot.id === targetSlot.id)
    
    let canFit = true
    for (let i = 0; i < slotsNeeded; i++) {
      if (targetIndex + i >= timeSlots.length || !timeSlots[targetIndex + i].isAvailable) {
        canFit = false
        break
      }
    }
    
    if (!canFit) {
      toast.error('Not enough consecutive time slots available')
      return
    }
    
    // Update task with time slot
    const updatedTasks = tasks.map(task => 
      task.id === draggedTask.id 
        ? { ...task, timeSlot: targetSlot.id }
        : task
    )
    
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    
    // Update time slots
    setTimeSlots(prevSlots => 
      prevSlots.map((slot, index) => {
        if (index >= targetIndex && index < targetIndex + slotsNeeded) {
          return { ...slot, task: draggedTask, isAvailable: false }
        }
        return slot
      })
    )
    
    setDraggedTask(null)
    toast.success('Task scheduled successfully!')
  }
  
  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    )
    
    setTasks(updatedTasks)
    saveTasks(updatedTasks)
    
    const task = updatedTasks.find(t => t.id === taskId)
    toast.success(task.completed ? 'Task completed!' : 'Task marked as incomplete')
  }
  
  const getUnscheduledTasks = () => {
    return tasks.filter(task => !task.timeSlot)
  }
  
  const getScheduledTasks = () => {
    return tasks.filter(task => task.timeSlot)
  }
  
  const getPriorityInfo = (priority) => {
    return priorities.find(p => p.value === priority)
  }
  
  const getProductivityStats = () => {
    const total = tasks.length
    const completed = tasks.filter(task => task.completed).length
    const scheduled = tasks.filter(task => task.timeSlot).length
    
    return {
      total,
      completed,
      scheduled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }
  
  const stats = getProductivityStats()
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/tools')}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={24} className="text-gray-600" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Time Planner</h1>
            <p className="text-gray-600">Plan and organize your day effectively</p>
          </div>
        </div>
        
        {/* Date selector */}
        <div className="flex items-center justify-between">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          
          <Button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={20} />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-blue-800">{stats.total}</p>
              </div>
              <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-800">{stats.completed}</p>
              </div>
              <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="CheckCircle" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Scheduled</p>
                <p className="text-2xl font-bold text-purple-800">{stats.scheduled}</p>
              </div>
              <div className="bg-purple-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="Calendar" size={20} className="text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600 font-medium">Completion</p>
                <p className="text-2xl font-bold text-amber-800">{stats.completionRate}%</p>
              </div>
              <div className="bg-amber-500 w-10 h-10 rounded-full flex items-center justify-center">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Task Form */}
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
              
              <div>
                <label className="form-label">Duration (minutes)</label>
                <select
                  value={newTask.duration}
                  onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) })}
                  className="form-input"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              
              <div>
                <label className="form-label">Priority</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="form-input"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddTask(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTask}>
                Add Task
              </Button>
            </div>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks List */}
          <div className="lg:col-span-1">
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Unscheduled Tasks ({getUnscheduledTasks().length})
              </h3>
              <div className="space-y-3">
                {getUnscheduledTasks().map(task => {
                  const priorityInfo = getPriorityInfo(task.priority)
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`p-3 rounded-lg border-2 border-dashed border-gray-300 cursor-move hover:border-primary transition-colors ${priorityInfo.bg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{task.duration} min</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.color} ${priorityInfo.bg}`}>
                              {priorityInfo.label}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
                
                {getUnscheduledTasks().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Calendar" size={32} className="mx-auto mb-2" />
                    <p>All tasks are scheduled!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Schedule */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Daily Schedule - {format(new Date(selectedDate), 'EEEE, MMMM d')}
              </h3>
              <div className="max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {timeSlots.map(slot => (
                    <div
                      key={slot.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, slot)}
                      className={`flex items-center p-2 rounded-lg border transition-colors ${
                        slot.isAvailable 
                          ? 'border-gray-200 hover:border-primary hover:bg-primary hover:bg-opacity-5' 
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="w-20 text-sm text-gray-600 font-medium">
                        {slot.label}
                      </div>
                      <div className="flex-1 ml-4">
                        {slot.task ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleCompleteTask(slot.task.id)}
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                  slot.task.completed 
                                    ? 'bg-green-500 border-green-500' 
                                    : 'border-gray-300 hover:border-green-500'
                                }`}
                              >
                                {slot.task.completed && (
                                  <ApperIcon name="Check" size={12} className="text-white" />
                                )}
                              </button>
                              <span className={`font-medium ${
                                slot.task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                              }`}>
                                {slot.task.title}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({slot.task.duration} min)
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteTask(slot.task.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <ApperIcon name="X" size={14} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            Drop a task here
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimePlanner