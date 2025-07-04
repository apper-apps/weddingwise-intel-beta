import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const TaskList = ({ tasks, onToggleTask, onDeleteTask }) => {
  const getPriorityBadge = (priority) => {
    const variants = {
      'High': 'error',
      'Medium': 'warning',
      'Low': 'info'
    }
    return variants[priority] || 'info'
  }
  
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status, then by priority, then by due date
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {sortedTasks.map((task, index) => (
        <motion.div
          key={task.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`bg-surface rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg ${
            task.completed ? 'opacity-60' : ''
          }`}
        >
          <div className="flex items-start space-x-4">
            <button
              onClick={() => onToggleTask(task.Id)}
              className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                task.completed
                  ? 'bg-success border-success text-white'
                  : 'border-gray-300 hover:border-primary'
              }`}
            >
              {task.completed && (
                <ApperIcon name="Check" className="w-4 h-4" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`font-medium ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{task.category}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="User" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{task.assignee}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Badge variant={getPriorityBadge(task.priority)} size="small">
                    {task.priority}
                  </Badge>
                  <button
                    onClick={() => onDeleteTask(task.Id)}
                    className="p-1 text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default TaskList