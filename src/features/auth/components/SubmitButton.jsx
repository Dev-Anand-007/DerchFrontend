// Submit Button Component
import React, { useState } from 'react'
import {themes} from '../../../constants/colors'
import {motion} from 'framer-motion'
import FormInput from './FormInput'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
const SubmitButton = ({ children, isLoading = false, onClick }) => {
  const mode = themes.lightMode;

  return (
    <motion.button
      onClick={onClick}
      className="w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl 
        font-semibold text-sm sm:text-base flex items-center justify-center space-x-2 
        transition-all duration-300 transform hover:scale-105 hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
      style={{
        backgroundColor: mode.buttonBg,
        color: 'white',
        focusRingColor: mode.buttonBg
      }}
      onMouseEnter={(e) => {
        if (!isLoading) {
          e.target.style.backgroundColor = '#7C2D12'; // Darker burnt orange
        }
      }}
      onMouseLeave={(e) => {
        if (!isLoading) {
          e.target.style.backgroundColor = mode.buttonBg;
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
    >
      {isLoading ? (
        <motion.div
          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </>
      )}
    </motion.button>
  );
};

export default SubmitButton;