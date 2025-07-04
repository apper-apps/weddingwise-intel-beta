import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Empty = ({ 
  title = "No items found",
  description = "Get started by adding your first item.",
  icon = "Plus",
  actionText = "Add Item",
  onAction,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-12 ${className}`}
    >
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center"
        >
          <ApperIcon name={icon} className="w-8 h-8 text-white" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {onAction && (
          <Button onClick={onAction} className="inline-flex items-center space-x-2">
            <ApperIcon name={icon} className="w-4 h-4" />
            <span>{actionText}</span>
          </Button>
        )}
      </div>
    </motion.div>
  )
}

export default Empty