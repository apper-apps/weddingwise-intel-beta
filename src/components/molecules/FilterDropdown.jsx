import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const FilterDropdown = ({ 
  options, 
  selected, 
  onSelect, 
  placeholder = "Select option",
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelect = (option) => {
    onSelect?.(option)
    setIsOpen(false)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg border-2 border-primary/20 bg-white hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200 flex items-center justify-between"
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
          {selected || placeholder}
        </span>
        <ApperIcon 
          name="ChevronDown" 
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-2 bg-white border border-primary/20 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: '#F8E5D6' }}
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FilterDropdown