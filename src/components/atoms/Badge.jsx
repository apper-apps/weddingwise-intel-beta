import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent text-white",
    secondary: "bg-secondary text-primary",
    success: "bg-gradient-to-r from-success to-green-400 text-white",
    warning: "bg-gradient-to-r from-warning to-yellow-400 text-white",
    error: "bg-gradient-to-r from-error to-red-400 text-white",
    info: "bg-gradient-to-r from-info to-blue-400 text-white"
  }
  
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-2 text-base"
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`
  
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={classes}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge