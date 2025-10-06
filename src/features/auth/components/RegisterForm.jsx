import React, { useEffect, useState } from 'react';
import { themes } from '../../../constants/colors'
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import FormInput from './FormInput'
import SubmitButton from './SubmitButton';
import { Mail, Lock, User, Phone, Home } from 'lucide-react';
import { clearRegisterError, registerAsync, resetRegisterStatus, selectRegisterError, selectRegisterStatus } from '../AuthSlice';

const RegisterForm = () => {
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [isLoading, setIsLoading] = useState(false);
  const mode = themes.lightMode;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(selectRegisterStatus);
  const error = useSelector(selectRegisterError);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (status === 'fulfilled') {
      toast.success(`Registered successfully`);
      navigate('/');
      reset();
    }
    return () => {
      dispatch(clearRegisterError());
      dispatch(resetRegisterStatus());
    };
  }, [status]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (confirmPassword === password) {
      dispatch(
        registerAsync({
          fullname,
          email,
          password,
          phone,
          address,
        })
      );
    } else {
      toast.error('Please enter the same password.');
    }
  };

  return (
    <motion.form onSubmit={handleRegister}
      className='space-y-4 sm:space-y-6 w-full'
    >
      <FormInput
        icon={User}
        type="text"
        placeholder="Full name"
        value={fullname}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <FormInput
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="new Name"
      />
      <FormInput
        icon={Lock}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
      <FormInput
        icon={Lock}
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      {/* phone Number */}
      <FormInput
        icon={Phone}
        type="tel"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      {/* Address Fields */}
      <FormInput
        icon={Home}
        type="text"
        placeholder="Street"
        value={address.street}
        onChange={(e) => setAddress({ ...address, street: e.target.value })}
        required
      />
      <FormInput
        icon={Home}
        type="text"
        placeholder="City"
        value={address.city}
        onChange={(e) => setAddress({ ...address, city: e.target.value })}
        required
      />
      <FormInput
        icon={Home}
        type="text"
        placeholder="State"
        value={address.state}
        onChange={(e) => setAddress({ ...address, state: e.target.value })}
        required
      />
      <FormInput
        icon={Home}
        type="text"
        placeholder="Postal Code"
        value={address.postalCode}
        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
        required
      />
      <FormInput
        icon={Home}
        type="text"
        placeholder="Country"
        value={address.country}
        onChange={(e) => setAddress({ ...address, country: e.target.value })}
      />

      <SubmitButton isLoading={isLoading} >
        Create Account
      </SubmitButton>
    </motion.form>
  );
};

export default RegisterForm;
