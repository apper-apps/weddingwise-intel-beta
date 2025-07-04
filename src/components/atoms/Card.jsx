import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  const baseClasses = "bg-surface rounded-xl shadow-lg transition-all duration-200"
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02]" : ""
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card