import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import TaskList from '@/components/organisms/TaskList'
import FilterDropdown from '@/components/molecules/FilterDropdown'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { getTasks, updateTask, deleteTask } from '@/services/api/taskService'

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  const loadTasks = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err.message || 'Failed to load tasks')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    loadTasks()
  }, [])
  
  const handleToggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.Id === id)
      if (task) {
        const updatedTask = { ...task, completed: !task.completed }
        await updateTask(id, updatedTask)
        setTasks(tasks.map(t => t.Id === id ? updatedTask : t))
        toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened')
      }
    } catch (err) {
      toast.error('Failed to update task')
    }
  }
  
  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id)
      setTasks(tasks.filter(task => task.Id !== id))
      toast.success('Task deleted successfully')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }
  
  const handleAddTask = () => {
    toast.info('Add task form would open here')
  }
  
  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadTasks} />
  
  const filteredTasks = tasks.filter(task => {
    const matchesCategory = !filterCategory || task.category === filterCategory
    const matchesPriority = !filterPriority || task.priority === filterPriority
    const matchesStatus = !filterStatus || 
      (filterStatus === 'Completed' && task.completed) ||
      (filterStatus === 'Pending' && !task.completed)
    
    return matchesCategory && matchesPriority && matchesStatus
  })
  
  const completedTasks = tasks.filter(task => task.completed).length
  const pendingTasks = tasks.filter(task => !task.completed).length
  const highPriorityTasks = tasks.filter(task => task.priority === 'High' && !task.completed).length
  
  const categories = [...new Set(tasks.map(task => task.category))]
  const priorities = ['High', 'Medium', 'Low']
  const statuses = ['Completed', 'Pending']
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-2">Manage your wedding planning tasks</p>
        </div>
        <Button onClick={handleAddTask} className="mt-4 sm:mt-0">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      {tasks.length === 0 ? (
        <Empty
          title="No tasks yet"
          description="Create your first task to start organizing your wedding planning."
          icon="CheckSquare"
          actionText="Add Task"
          onAction={handleAddTask}
        />
      ) : (
        <>
          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{tasks.length}</h3>
              <p className="text-gray-600">Total Tasks</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-success to-green-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-success">{completedTasks}</h3>
              <p className="text-gray-600">Completed</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Clock" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-warning">{pendingTasks}</h3>
              <p className="text-gray-600">Pending</p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-error to-red-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-error">{highPriorityTasks}</h3>
              <p className="text-gray-600">High Priority</p>
            </Card>
          </div>
          
          {/* Filters */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <FilterDropdown
                options={['', ...categories]}
                selected={filterCategory}
                onSelect={setFilterCategory}
                placeholder="All Categories"
                className="flex-1"
              />
              <FilterDropdown
                options={['', ...priorities]}
                selected={filterPriority}
                onSelect={setFilterPriority}
                placeholder="All Priorities"
                className="flex-1"
              />
              <FilterDropdown
                options={['', ...statuses]}
                selected={filterStatus}
                onSelect={setFilterStatus}
                placeholder="All Statuses"
                className="flex-1"
              />
            </div>
          </Card>
          
          {/* Task List */}
          <Card className="p-6">
            <TaskList
              tasks={filteredTasks}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
            />
          </Card>
        </>
      )}
    </motion.div>
  )
}

export default Tasks