import { motion } from 'framer-motion'

const Loading = ({ type = 'cards' }) => {
  const shimmerClass = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200px_100%] animate-shimmer"
  
  if (type === 'table') {
    return (
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className={`h-10 w-1/3 rounded-lg ${shimmerClass}`} />
          <div className={`h-10 w-48 rounded-lg ${shimmerClass}`} />
        </div>
        <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-secondary/20">
            <div className="grid grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`h-4 rounded ${shimmerClass}`} />
              ))}
            </div>
          </div>
          <div className="divide-y">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4">
                <div className="grid grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className={`h-4 rounded ${shimmerClass}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  if (type === 'timeline') {
    return (
      <div className="space-y-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative flex items-start space-x-6"
          >
            <div className={`w-4 h-4 rounded-full ${shimmerClass}`} />
            <div className="flex-1 bg-surface rounded-lg p-6 shadow-lg">
              <div className={`h-6 w-2/3 rounded mb-3 ${shimmerClass}`} />
              <div className={`h-4 w-full rounded mb-2 ${shimmerClass}`} />
              <div className={`h-4 w-3/4 rounded mb-4 ${shimmerClass}`} />
              <div className="flex space-x-4">
                <div className={`h-4 w-24 rounded ${shimmerClass}`} />
                <div className={`h-6 w-16 rounded-full ${shimmerClass}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  
  if (type === 'dashboard') {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className={`h-8 w-64 mx-auto rounded ${shimmerClass}`} />
          <div className={`h-6 w-48 mx-auto rounded ${shimmerClass}`} />
        </div>
        
        {/* Countdown */}
        <div className="flex justify-center space-x-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 rounded-lg ${shimmerClass}`} />
              <div className={`h-4 w-12 mx-auto mt-2 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-lg p-6 shadow-lg">
              <div className={`h-12 w-12 rounded-lg mb-4 ${shimmerClass}`} />
              <div className={`h-6 w-16 rounded mb-2 ${shimmerClass}`} />
              <div className={`h-4 w-24 rounded ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Default cards loading
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-lg p-6 shadow-lg"
        >
          <div className={`h-6 w-3/4 rounded mb-3 ${shimmerClass}`} />
          <div className={`h-4 w-1/2 rounded mb-4 ${shimmerClass}`} />
          <div className={`h-4 w-full rounded mb-2 ${shimmerClass}`} />
          <div className={`h-4 w-2/3 rounded mb-4 ${shimmerClass}`} />
          <div className="flex justify-between items-center">
            <div className={`h-6 w-20 rounded-full ${shimmerClass}`} />
            <div className="flex space-x-2">
              <div className={`h-8 w-8 rounded-lg ${shimmerClass}`} />
              <div className={`h-8 w-8 rounded-lg ${shimmerClass}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default Loading