import React from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingCart, DollarSign, TrendingUp, Eye, Settings, Bell, Search } from 'lucide-react'
import { themes } from '../../../constants/colors'

const Dashboard = () => {
  const mode =themes.lightMode;

  const stats = [
    { title: "Total Users", value: "12,847", change: "+12%", icon: Users },
    { title: "Orders", value: "3,247", change: "+8%", icon: ShoppingCart },
    { title: "Revenue", value: "$54,329", change: "+23%", icon: DollarSign },
    
  ]

  const recentActivity = [
    { action: "New user registered", time: "2 minutes ago", type: "user" },
    { action: "Order #1234 completed", time: "5 minutes ago", type: "order" },
    { action: "Payment received", time: "8 minutes ago", type: "payment" },
    { action: "Product updated", time: "12 minutes ago", type: "product" }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: mode.background }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold" style={{ color: mode.text }}>
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm sm:text-base" style={{ color: mode.subText }}>
                Welcome back! Here's what's happening today.
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex-1 lg:flex-none"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: mode.subText }} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full lg:w-64 pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-opacity-50 text-sm sm:text-base"
                  style={{ 
                    backgroundColor: mode.homelight,
                    color: mode.text,
                    outline: 'none'
                  }}
                />
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: mode.homelight }}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: mode.text }} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg flex-shrink-0"
                style={{ backgroundColor: mode.homelight }}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: mode.text }} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.title}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-xl shadow-sm"
                style={{ backgroundColor: mode.homelight }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: mode.background }}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: mode.buttonBg }} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1" style={{ color: mode.text }}>
                  {stat.value}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: mode.subText }}>
                  {stat.title}
                </p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          
          {/* Chart Section */}
          <motion.div 
            variants={itemVariants}
            className="xl:col-span-2 p-4 sm:p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: mode.homelight }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: mode.text }}>
              Analytics Overview
            </h2>
            <div className="h-48 sm:h-64 md:h-80 flex items-center justify-center rounded-lg"
                 style={{ backgroundColor: mode.background }}>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3" style={{ color: mode.subText }} />
                <p className="text-sm sm:text-base" style={{ color: mode.subText }}>Chart visualization would go here</p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            variants={itemVariants}
            className="p-4 sm:p-6 rounded-xl shadow-sm"
            style={{ backgroundColor: mode.homelight }}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: mode.text }}>
              Recent Activity
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: mode.background }}
                >
                  <div 
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: mode.buttonBg }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium truncate" style={{ color: mode.text }}>
                      {activity.action}
                    </p>
                    <p className="text-xs sm:text-sm mt-1" style={{ color: mode.subText }}>
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div 
          variants={itemVariants}
          className="p-4 sm:p-6 rounded-xl shadow-sm"
          style={{ backgroundColor: mode.homelight }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-4" style={{ color: mode.text }}>
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              { name: "Add User", icon: Users },
              { name: "New Order", icon: ShoppingCart },
              { name: "Reports", icon: TrendingUp },
              { name: "Settings", icon: Settings },
              { name: "Analytics", icon: Eye },
              { name: "Revenue", icon: DollarSign }
            ].map((action, index) => {
              const IconComponent = action.icon
              return (
                <motion.button
                  key={action.name}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 sm:p-4 rounded-lg text-center transition-colors"
                  style={{ backgroundColor: mode.background }}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2" style={{ color: mode.buttonBg }} />
                  <span className="text-xs sm:text-sm font-medium block" style={{ color: mode.text }}>
                    {action.name}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard