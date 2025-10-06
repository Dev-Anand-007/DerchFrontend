import React, { useState } from "react";
import LoginForm from '../features/adminAuth/components/LoginForm'
import { AnimatePresence, motion } from "framer-motion";
import { themes } from "../constants/colors";
import { useNavigate } from "react-router-dom";
import ForgotPassModal from "../features/auth/components/ForgotPassModal";

const mode = themes.lightMode;

const AdminAuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    const navigate=useNavigate();
    return (
        <div
            style={{ backgroundColor: mode.background }}
            className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
            {/* Main Container  */}
            <motion.div
                className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg xl-max-w-x"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {/* Card */}
                <div
                    className="border  rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl "
                    style={{
                        backgroundColor: mode.background,
                        borderColor: mode.border
                    }}
                >
                    {/* Brand and title  */}
                    <motion.div
                        className="text-center mb-6 sm:mb-8 lg:mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3"
                            style={{ color: mode.text }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            DERCH - ADMIN
                        </motion.h1>
                        <p style={{ color: mode.subText }}>
                           Welcome, We are at your service !
                        </p>
                    </motion.div>

                   

                    {/* Form Container  */}
                    <div className="relative px-5 py-3 overflow-hidden">
                        <AnimatePresence mode="wait">
                           
                                <motion.div

                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <LoginForm
                                        key="login"
                                        onForgotPassword={() => setShowForgotPassword(true)}
                                    />
                                </motion.div>
                            

                        </AnimatePresence>
                    </div>
                    {/* Footer Text */}
                    <motion.div
                        className="text-center mt-6 sm:mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <p
                            className="text-xs sm:text-sm"
                            style={{ color: mode.subText }}
                        >
                            {"Want to login as a User? "}
                            <button
                                onClick={()=>{navigate('/auth')}}
                                className="transition-colors duration-300 
                                      hover:underline focus:outline-none focus:underline font-medium hover:opacity-80"
                                style={{ color: mode.text }}
                            >
                                 Sign In 
                            </button>
                        </p>
                    </motion.div>
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        <motion.div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                            style={{ backgroundColor: mode.buttonBg }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
                        <motion.div
                            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
                            style={{ backgroundColor: mode.text }}
                            animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.2, 0.6, 0.2],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                    </div>
                </div>
                {/* Premium Badge */}
                {/* <motion.div
                     className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2"
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: 0.6 }}
                   >
                     <div 
                       className="text-white px-3 sm:px-4 py-1 sm:py-2 
                         rounded-full text-xs sm:text-sm font-medium shadow-lg"
                       style={{ backgroundColor: mode.buttonBg }}
                     >
                       PREMIUM
                     </div>
                   </motion.div> */}
            </motion.div>

            {/* Forgot Password Modal */}
            <ForgotPassModal
                isOpen={showForgotPassword}
                onClose={() => setShowForgotPassword(false)}
            />

        </div>
    );
};

export default AdminAuthPage;
