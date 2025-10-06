import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, User, Menu, X, Search, ChevronDown, Package, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthErrors, logoutAsync, resetAuthStatus, selectAuthErrors, selectAuthStatus, selectLoggedInUser } from '../../auth/AuthSlice';
import { checkAuth } from '../HomePageAPI';



// Color theme (you can import this from your theme file)
const theme = {
  lightMode: {
    background: "#F5F5F5",
    text: "#111111",
    subText: "#4B5563",
    buttonBg: "#9A3412",
    buttonHover: "#E5E5E5",
    homedark: "#111111",
    homelight: "#FFFFFF"
  }
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const [activeMenu, setActiveMenu] = useState('Home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [cartCount,setCartCount] = useState(0); // Example cart count
  const [wishlistCount] = useState(5); // Example wishlist count
  const mode = theme.lightMode;
  


  useEffect(()=>  {

    const cartLength=async()=>{
      const user=await checkAuth();
      setCartCount(user.user.cart.length);
     
    };
    cartLength();
  },[])

  const location = useLocation();
  const getActiveMenu = () => {
    if (location.pathname === "/") return "Home";
    if (location.pathname === "/collection") return "Collection";
    if (location.pathname === "/new") return "New";
    if (location.pathname === "/sale") return "Sale";
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
  // useEffect(() => {
  //   if (status === 'fulfilled') {
  //     toast.success("Logged Out successfully.")
  //     navigate('/auth')
  //     reset()
  //   }
  //   return () => {
  //     dispatch(resetAuthStatus())
  //     dispatch(clearAuthErrors())
  //   }

  // })
  const handleLogout = async (e) => {
    setIsDropdownOpen(false);
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      toast.error("Logout failed");
    }

  }
  // Navigation items
  const navItems = ['Home', 'Collection', 'New', 'Sale'];

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
                      Home: "/",
                      Collection: "/collection",
                      New: '/new',
                      Sale: '/sale',
                      // Search: "/search",
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
            {/* Search (Desktop only) */}
            {/* <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap="tap"
              className="hidden lg:flex p-3 rounded-full transition-all duration-300"
              style={{ backgroundColor: mode.buttonHover }}
            >
              <Search size={20} style={{ color: mode.homedark }} />
            </motion.button> */}

            {/* Wishlist */}
            <motion.div
              variants={iconButtonVariants}
              whileHover="hover"
              onClick={()=>{
                navigate('/wishlist')
              }}
              whileTap="tap"
              className="relative"
            >
              <button
                className="p-3 rounded-full transition-all duration-300 relative"
                style={{ backgroundColor: mode.homedark }}
              >
                <Heart size={20} style={{ color: mode.homelight }} />
                {/* {wishlistCount > 0 && <BadgeCounter count={wishlistCount} />} */}
              </button>
            </motion.div>

            {/* Cart */}
            <motion.div
              variants={iconButtonVariants}
              whileHover="hover"
              onClick={()=>{
                navigate('/cart')
              }}
              whileTap="tap"
              className="relative"
            >
              <motion.button
                className="flex items-center space-x-3 px-4 py-3 rounded-full transition-all duration-300 relative"
                style={{ backgroundColor: mode.buttonBg }}
                whileHover={{
                  backgroundColor: "#7C2D12",
                  boxShadow: "0 8px 25px rgba(154, 52, 18, 0.4)"
                }}
              >
                <span className="hidden sm:block text-white font-medium">Cart</span>
                <div className="relative">
                  <ShoppingCart size={20} className="text-white" />
                  {cartCount > 0 && <BadgeCounter count={cartCount} />}
                </div>
              </motion.button>
            </motion.div>

            {/* Profile */}
            <div className="relative">
              <motion.button
                variants={iconButtonVariants}
                whileHover="hover"
                whileTap="tap"
                className="p-3 rounded-full transition-all duration-300"
                style={{ backgroundColor: mode.homedark }}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <User size={20} style={{ color: mode.homelight }} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg z-50"
                    style={{ backgroundColor: mode.homelight }}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {/* Profile Option */}
                    <motion.button
                      whileHover={{ backgroundColor: mode.buttonHover }}
                      className="w-full px-4 py-3 text-left rounded-t-lg transition-colors duration-200"
                      style={{ color: mode.homedark }}
                      onClick={() => {
                        navigate('/profile')

                        // Handle profile click

                      }}
                    >
                      <div className="flex items-center gap-3">
                        <User size={16} style={{ color: mode.homedark }} />
                        <span>Profile</span>
                      </div>
                    </motion.button>

                    {/* Orders Option */}
                    <motion.button
                      whileHover={{ backgroundColor: mode.buttonHover }}
                      className="w-full px-4 py-3 text-left transition-colors duration-200"
                      style={{ color: mode.homedark }}
                      onClick={() => {
                        // Handle orders click
                        navigate('/order')
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Package size={16} style={{ color: mode.homedark }} />
                        <span>Orders</span>
                      </div>
                    </motion.button>

                    {/* Divider */}
                    <hr className="my-1" style={{ borderColor: mode.buttonHover }} />

                    {/* Logout Option */}
                    <motion.button
                      whileHover={{ backgroundColor: mode.buttonHover }}
                      className="w-full px-4 py-3 text-left rounded-b-lg transition-colors duration-200"
                      style={{ color: mode.homedark }}
                      onClick={() => {
                        // Handle logout click
                        handleLogout();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <LogOut size={16} style={{ color: mode.homedark }} />
                        <span>Logout</span>
                      </div>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              variants={iconButtonVariants}
              whileHover="hover"
              whileTap='tap'
              className="lg:hidden p-2 rounded-full transition-all duration-300"
              style={{ backgroundColor: mode.buttonHover }}
              onClick={() => setIsMenuOpen(!isMenuOpen)
              }
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
                          Home: "/",
                          Collection: "/collection",
                          New: '/new',
                          Sale: '/sale',
                          // Search: "/search",
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

                {/* Mobile Search */}
                {/* <motion.div
                  variants={itemVariants}
                  className="pt-4 border-t border-gray-200"
                >
                  <button
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300"
                    style={{ backgroundColor: mode.buttonHover }}
                  >
                    <Search size={20} style={{ color: mode.homedark }} />
                    <span style={{ color: mode.homedark }}>Search products...</span>
                  </button>
                </motion.div> */}
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