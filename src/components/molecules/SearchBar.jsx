import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ placeholder = "Search...", onSearch, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const handleSearch = (value) => {
    setSearchTerm(value)
    onSearch?.(value)
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative ${className}`}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-primary/20 bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all duration-200"
        />
      </div>
    </motion.div>
  )
}

export default SearchBar