import { useState } from "react"
import { themes } from '../../../constants/colors'
import {  motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const FormInput = ({ icon: Icon, type = "text", placeholder, value, onChange, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const mode = themes.lightMode;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <motion.div
      className="relative w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`relative flex items-center transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <Icon 
          className={`absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300`}
          style={{ 
            color: isFocused ? mode.text : mode.subText 
          }}
        />
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border rounded-xl sm:rounded-2xl 
            text-sm sm:text-base transition-all duration-300 focus:outline-none ${
            isFocused 
              ? 'shadow-lg border-2' 
              : 'border hover:bg-gray-50'
          }`}
          style={{
            backgroundColor:mode.background,
            color: mode.text,
            borderColor: isFocused ? mode.text : '#D1D5DB',
            '::placeholder': { color: mode.subText }
          }}
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 sm:right-4 transition-colors duration-300 hover:opacity-80"
            style={{ color: mode.subText }}
          >
            {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        )}
      </div>
    </motion.div>
  );
};


export default FormInput;
