import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, User, Menu, X, Search, ChevronDown, Package, LogOut, Plus } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthErrors, logoutAsync, resetAuthStatus, selectAuthErrors, selectAuthStatus } from '../../auth/AuthSlice';
import { themes } from '../../../constants/colors';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [cartCount] = useState(3); // Example cart count
  const [wishlistCount] = useState(5); // Example wishlist count
  const mode = themes.lightMode;

  const location = useLocation();
  const getActiveMenu = () => {
    if (location.pathname === "/admin") return "Dashboard";
    if (location.pathname === "/admin/orders") return "Orders";
    if (location.pathname === "/admin/users") return "Users";
    if (location.pathname === "/admin/products") return "Products";

    return "";
  }
  const activeMenu = getActiveMenu();

  //Implementing Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthErrors);

  useEffect(() => {
    if (error) {
      toast.error(error.message)
    }
  }, [error]);

  const handleLogout = async (e) => {
    try {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin')
      toast.success("Logging out in 3 seconds.");
      setTimeout(() => {
        navigate("/adminlogin");
      }, 3000);
    } catch (error) {
      toast.error("Logout failed");
    }
  }

  // Navigation items
  const navItems = ['Dashboard', 'Orders', 'Users', 'Products'];

  // Animation variants
  const navbarVariants = {
    initial: { opacity: 0, y: -80 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.8, rotate: -180 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    initial: {
      opacity: 0,
      height: 0,
      y: -20
    },
    animate: {
      opacity: 1,
      height: "auto",
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const iconButtonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    tap: { scale: 0.95 }
  };

  const BadgeCounter = ({ count, className = "" }) => (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${className}`}
    >
      {count}
    </motion.div>
  );

  return (
    <motion.nav
      variants={navbarVariants}
      initial="initial"
      animate="animate"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? 'backdrop-blur-xl bg-white/90 shadow-lg border-b border-gray-200'
        : 'bg-transparent'
        }`}
      style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Left Section - Brand & Navigation */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-8"
          >
            {/* Brand */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <motion.h1
                className="text-2xl lg:text-3xl font-bold tracking-tight"
                style={{ color: mode.homedark }}
                whileHover={{
                  background: "linear-gradient(45deg, #9A3412, #EA580C)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                DERCH
              </motion.h1>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: mode.buttonBg }}
              />
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item}
                  variants={itemVariants}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden ${activeMenu === item
                    ? 'text-white'
                    : 'hover:bg-gray-100'
                    }`}
                  style={{
                    color: activeMenu === item ? 'white' : mode.homedark
                  }}
                  onClick={() => {
                    const pathMap = {
                      Dashboard: "/admin",
                      Orders: "/admin/orders",
                      Users: '/admin/users',
                      Products: '/admin/products',
                    };
                    navigate(pathMap[item]);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeMenu === item && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-full"
                      style={{ backgroundColor: mode.buttonBg }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Center Logo (hidden on mobile) */}
          <motion.div
            variants={logoVariants}
            className="hidden md:flex absolute left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: mode.homelight, border: `2px solid ${mode.buttonBg}` }}
              whileHover={{
                rotate: 360,
                scale: 1.1,
                boxShadow: "0 10px 30px rgba(154, 52, 18, 0.3)"
              }}
              whileTap={() => {
                navigate("/admin");
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: mode.buttonBg }}
              />
            </motion.div>
          </motion.div>

          {/* Right Section - Actions */}
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-2 lg:space-x-4"
          >
            {/* Upload */}
            <motion.div
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <motion.button
                className="flex items-center space-x-3 px-4 py-3 rounded-full transition-all duration-300 relative"
                style={{ backgroundColor: mode.buttonBg }}
                onClick={() => navigate('/admin/upload')}
                whileHover={{
                  backgroundColor: "#7C2D12",
                  boxShadow: "0 8px 25px rgba(154, 52, 18, 0.4)"
                }}
              >
                <span className="hidden sm:block text-white font-medium">Upload</span>
                <div className="relative">
                  <Plus size={20} className="text-white" />
                </div>
              </motion.button>
            </motion.div>

            {/* Logout Button - Replaced Profile */}
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="p-3 rounded-full transition-all duration-300 group"
              style={{ backgroundColor: mode.homedark }}
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut 
                size={20} 
                style={{ color: mode.homelight }}
                className="group-hover:rotate-12 transition-transform duration-200"
              />
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap='tap'
              className="lg:hidden p-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: mode.buttonHover }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} style={{ color: mode.homedark }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} style={{ color: mode.homedark }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="lg:hidden overflow-hidden"
              style={{ backgroundColor: 'white' }}
            >
              <div className="px-4 py-6 space-y-4 border-t border-gray-200">
                {/* Mobile Navigation */}
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.button
                      key={item}
                      variants={itemVariants}
                      className={`w-full text-left px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${activeMenu === item
                        ? 'text-white'
                        : ''
                        }`}
                      style={{
                        backgroundColor: activeMenu === item ? mode.buttonBg : 'transparent',
                        color: activeMenu === item ? 'white' : mode.homedark
                      }}
                      onClick={() => {
                        const pathMap = {
                          Dashboard: "/admin",
                          Orders: "/admin/orders",
                          Users: '/admin/users',
                          Products: '/admin/products',
                        };
                        navigate(pathMap[item]);
                        setIsMenuOpen(false);
                      }}
                      whileHover={{
                        backgroundColor: activeMenu === item ? mode.buttonBg : mode.buttonHover,
                        scale: 1.02
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>

                {/* Mobile Logout Button */}
                <div className="pt-4 border-t border-gray-200">
                  <motion.button
                    variants={itemVariants}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-300"
                    style={{ backgroundColor: mode.buttonBg, color: 'white' }}
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    whileHover={{
                      backgroundColor: "#7C2D12",
                      scale: 1.02
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <LogOut size={20} className="text-white" />
                    <span>Logout</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent origin-left"
        style={{
          scaleX: isScrolled ? 1 : 0,
          backgroundColor: mode.buttonBg
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.nav>
  );
};

export default Navbar;