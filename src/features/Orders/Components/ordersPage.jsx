import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Calendar, CreditCard, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { themes } from '../../../constants/colors';
import { fetchAllOrder } from '../OrderAPI';
import { API_ROUTES } from '../../../api/routes';
import { toast } from 'react-toastify';

const OrderPage = () => {
  const mode = themes.lightMode;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchAllOrder();
      console.log(data);
      
      if (data.success === true) {
        setOrders(data.orders || []);
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.log(err);
      setError('No orders found! Please place some orders first.');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDetails = (status) => {
    const statusLower = status?.toLowerCase() || 'pending';
    switch (statusLower) {
      case 'pending':
        return { color: '#f59e0b', icon: Clock, bg: '#fef3c7' };
      case 'processing':
        return { color: '#3b82f6', icon: Package, bg: '#dbeafe' };
      case 'shipped':
        return { color: '#8b5cf6', icon: Truck, bg: '#ede9fe' };
      case 'delivered':
        return { color: '#10b981', icon: CheckCircle, bg: '#d1fae5' };
      case 'ordered':
        return { color: '#10b981', icon: CheckCircle, bg: '#d1fae5' };
      case 'cancelled':
        return { color: '#ef4444', icon: XCircle, bg: '#fee2e2' };
      default:
        return { color: mode.subText, icon: Clock, bg: mode.background };
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const orderCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const expandVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const loadingVariants = {
    rotate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: mode.background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-6"
            style={{ borderColor: `${mode.buttonBg}40`, borderTopColor: mode.buttonBg }}
            variants={loadingVariants}
            animate="rotate"
          />
          <motion.p
            style={{ color: mode.text }}
            className="text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading your orders...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: mode.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Package style={{ color: mode.buttonBg }} size={32} />
            </motion.div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: mode.text }}
            >
              My Orders
            </h1>
          </div>
          <motion.div
            className="text-sm sm:text-base"
            style={{ color: mode.subText }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {orders.length} order{orders.length !== 1 ? 's' : ''} found
          </motion.div>
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-red-600 text-center">{error}</p>
          </motion.div>
        )}

        {orders.length === 0 && !error ? (
          <motion.div
            className="text-center py-16 sm:py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Package size={80} style={{ color: mode.subText }} className="mx-auto mb-6" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-3" style={{ color: mode.text }}>
              No orders found
            </h2>
            <p className="text-base sm:text-lg" style={{ color: mode.subText }}>
              You haven't placed any orders yet
            </p>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4 sm:space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {orders.map((order, index) => {
                const statusDetails = getStatusDetails("ordered");
                const StatusIcon = statusDetails.icon;
                
                return (
                  <motion.div
                    key={order._id}
                    className="rounded-xl sm:rounded-2xl shadow-sm border overflow-hidden"
                    style={{
                      backgroundColor: mode.homelight,
                      borderColor: mode.buttonHover
                    }}
                    variants={orderCardVariants}
                    layout
                    whileHover={{ 
                      scale: 1.01,
                      boxShadow: `0 8px 25px ${mode.buttonBg}20`
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20 
                    }}
                  >
                    {/* Order Header */}
                    <motion.div
                      className="p-4 sm:p-6 cursor-pointer"
                      onClick={() => toggleOrderExpansion(order._id)}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                            {/* Order Info */}
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-base sm:text-lg font-semibold mb-2 truncate"
                                style={{ color: mode.text }}
                              >
                                Order #{order._id?.slice(-8) || 'N/A'}
                              </h3>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={14} style={{ color: mode.subText }} />
                                  <span style={{ color: mode.subText }}>
                                    {formatDate(order.updatedAt || new Date())}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Package size={14} style={{ color: mode.subText }} />
                                  <span style={{ color: mode.subText }}>
                                    {/* {order.length || 0} item{(order.items?.length !== 1) ? 's' : ''} */}
                                    {1} item
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <motion.div
                              className="flex items-center gap-2 px-3 py-2 rounded-full border"
                              style={{
                                backgroundColor: statusDetails.bg,
                                borderColor: statusDetails.color + '40',
                                color: statusDetails.color
                              }}
                              whileHover={{ scale: 1.05 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <StatusIcon size={16} />
                              <span className="text-sm font-medium capitalize">
                                {order.status || 'Ordered'}
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Price and Expand Button */}
                        <div className="flex items-center justify-between lg:justify-end gap-4">
                          <div className="text-right">
                            <p className="text-xs sm:text-sm" style={{ color: mode.subText }}>
                              Total Amount
                            </p>
                            <p className="font-bold text-lg sm:text-xl" style={{ color: mode.text }}>
                              ${(order.price || 0).toFixed(2)}
                            </p>
                          </div>

                          <motion.div
                            className="p-2"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <motion.div
                              animate={{ rotate: expandedOrders[order._id] ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <ChevronDown style={{ color: mode.buttonBg }} size={24} />
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Order Details (Dropdown Content) */}
                    <AnimatePresence>
                      {expandedOrders[order._id] && (
                        <motion.div
                          className="border-t overflow-hidden"
                          style={{ borderColor: mode.buttonHover }}
                          variants={expandVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <div className="p-4 sm:p-6">
                            <motion.h4
                              className="font-semibold mb-4 text-sm sm:text-base"
                              style={{ color: mode.text }}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              Order Items
                            </motion.h4>

                            <div className="space-y-3 sm:space-y-4">
                             
                                <motion.div
                                  key={order._id }
                                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl"
                                  style={{ backgroundColor: mode.background }}
                                  variants={itemVariants}
                                  initial="hidden"
                                  animate="visible"
                                  transition={{ delay: order * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <motion.img
                                    src={`${API_ROUTES.products.getImage(order._id)}` || '/api/placeholder/80/80'}
                                    alt={order.name || 'Product'}
                                    className="w-full sm:w-16 md:w-20 h-16 md:h-20 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src = '/api/placeholder/80/80';
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                  />

                                  <div className="flex-1 min-w-0">
                                    <h5
                                      className="font-medium mb-3 text-sm sm:text-base truncate"
                                      style={{ color: mode.text }}
                                    >
                                      {order.name || 'Product Name'}
                                    </h5>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                                      <motion.div whileHover={{ scale: 1.05 }}>
                                        <p style={{ color: mode.subText }} className="mb-1">Original Price</p>
                                        <p style={{ color: mode.text }} className="font-medium">
                                          ${((order.price || 0) + (order.discount || 0)).toFixed(2)}
                                        </p>
                                      </motion.div>

                                      <motion.div whileHover={{ scale: 1.05 }}>
                                        <p style={{ color: mode.subText }} className="mb-1">Discount</p>
                                        <p className="font-medium text-green-600">
                                          -${(order.discount || 0).toFixed(2)}
                                        </p>
                                      </motion.div>

                                      <motion.div whileHover={{ scale: 1.05 }}>
                                        <p style={{ color: mode.subText }} className="mb-1">Final Price</p>
                                        <p style={{ color: mode.text }} className="font-medium">
                                          ${(order.price || 0).toFixed(2)}
                                        </p>
                                      </motion.div>

                                      <motion.div whileHover={{ scale: 1.05 }}>
                                        <p style={{ color: mode.subText }} className="mb-1">Quantity</p>
                                        <p style={{ color: mode.text }} className="font-medium">
                                          {order.quantity || 1}
                                        </p>
                                      </motion.div>
                                    </div>
                                  </div>
                                </motion.div>
                           
                            </div>

                            {/* Order Summary */}
                            <motion.div
                              className="mt-6 pt-4 border-t"
                              style={{ borderColor: mode.buttonHover }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                  <CreditCard size={16} style={{ color: mode.subText }} />
                                  <span className="text-sm sm:text-base" style={{ color: mode.subText }}>
                                    Payment: {order.paymentMethod || 'Card'}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <div className="space-y-1 text-sm sm:text-base">
                                    <div className="flex justify-between gap-6 sm:gap-8">
                                      <span style={{ color: mode.subText }}>Subtotal:</span>
                                      <span style={{ color: mode.text }}>
                                        ${((order.price || 0) + (order.discount || 0)).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between gap-6 sm:gap-8">
                                      <span style={{ color: mode.subText }}>Discount:</span>
                                      <span className="text-green-600">
                                        -${(order.discount || 0).toFixed(2)}
                                      </span>
                                    </div>
                                    <motion.div
                                      className="flex justify-between gap-6 sm:gap-8 font-bold text-base sm:text-lg pt-2 border-t"
                                      style={{ borderColor: mode.buttonHover }}
                                      whileHover={{ scale: 1.02 }}
                                    >
                                      <span style={{ color: mode.text }}>Total:</span>
                                      <span style={{ color: mode.text }}>
                                        ${(order.price || 0).toFixed(2)}
                                      </span>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderPage;