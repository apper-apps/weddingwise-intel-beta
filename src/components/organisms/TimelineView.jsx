import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const TimelineView = ({ milestones, onUpdateMilestone }) => {
  const sortedMilestones = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date))
  
  const getStatusBadge = (status) => {
    const variants = {
      'completed': 'success',
      'in-progress': 'warning',
      'pending': 'info'
    }
    return variants[status] || 'info'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent"></div>
      
      <div className="space-y-8">
        {sortedMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex items-start space-x-6"
          >
            {/* Timeline dot */}
            <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg z-10 ${
              milestone.status === 'completed' 
                ? 'bg-success' 
                : milestone.status === 'in-progress'
                ? 'bg-warning'
                : 'bg-primary'
            }`}></div>
            
            {/* Content */}
            <div className="flex-1 bg-surface rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600 mb-3">{milestone.description}</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Calendar" className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(milestone.date), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <Badge variant={getStatusBadge(milestone.status)} size="small">
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
                
                <button
                  onClick={() => onUpdateMilestone(milestone.Id)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TimelineView