import { motion } from 'framer-motion'

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  placeholder = '',
  value,
  onChange,
  className = '',
  ...props 
}) => {
  const inputClasses = `w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/20 ${
    error 
      ? 'border-error bg-error/5 text-error' 
      : 'border-primary/20 bg-white focus:border-primary'
  } ${className}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        {...props}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-error mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

export default Input