import React, { useState, useEffect } from 'react'
import { themes } from '../../../constants/colors'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from './FormInput'
import SubmitButton from './SubmitButton'
import { toast } from 'react-toastify'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { selectAdminLoginError, selectAdminLoginStatus, selectLoggedInAdmin,clearAdminLoginError,resetAdminLoginStatus,loginAdminAsync } from '../AdminAuthSlice'



const LoginForm = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mode = themes.lightMode;

  //Implementing Redux
  const dispatch = useDispatch()
  const status = useSelector(selectAdminLoginStatus);
  const error = useSelector(selectAdminLoginError)
  const loggedInUser = useSelector(selectLoggedInAdmin)
  const navigate = useNavigate()


  
  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    if(status==='fulfilled' ){
      toast.success(`Login successful`);
      navigate('/admin')
      reset()
    }
    return ()=>{
      dispatch(clearAdminLoginError())
      dispatch(resetAdminLoginStatus())
    }
  },[status])
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginAdminAsync({email:email,password:password}));
 
  
  };

  return (
    <motion.form
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      onSubmit={handleSubmit}
      className="space-y-4 sm:space-y-6 w-full"
      autoComplete="off"
    ><FormInput
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="new-name"
        required
      />
      <FormInput
        icon={Lock}
        type='password'
        placeholder='Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        name="new-name"

      />

      <div className='flex  flex-col gap-2 justify-end'>
        <button
          type='button'
          onClick={onForgotPassword}
          className='text-xs sm:text-sm transition-colors duration-300 hover:underline focus:underline hover:opacity-80'
          style={{ color: mode.subText }}

        >
          Forgot Passowrd?

        </button>

        <SubmitButton isLoading={status==='pending'} >
          Admin Login
        </SubmitButton>
      </div>
    </motion.form>

  );
}

export default LoginForm