import {React,useState} from 'react'
import { themes } from '../../../constants/colors';
import { AnimatePresence, motion } from 'framer-motion';
import FormInput from './FormInput';
import SubmitButton from './SubmitButton'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const ForgotPassModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const mode = themes.lightMode;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    setEmail('');
                    onClose();
                }, 2000);
            }, 1500);
        })
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className='fixed inset-0 flex item-center justify-center p-4 z-50 '
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className='border border-gray-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md mx-4 shadow-xl h-min'
                        style={{ backgroundColor:mode.background }}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {!isSuccess ? (
                            <>
                                <h3
                                    className='text-xl sm:text-2xl font-bold mb-2'
                                    style={{ color: mode.text }}
                                >
                                    Reset Password

                                </h3>
                                <p
                                    className="mb-6 text-sm sm:text-base"
                                    style={{ color: mode.subText }}
                                >
                                    Enter your email and we'll send you a reset link
                                </p>
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <FormInput
                                        icon={Mail}
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 py-3 px-6 border border-gray-300 rounded-xl transition-all duration-300 text-sm sm:text-base"
                                            style={{
                                                color: mode.text,
                                                ':hover': { backgroundColor: mode.buttonHover }
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = mode.buttonHover;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <div className="flex-1">
                                            <SubmitButton isLoading={isLoading}>
                                                Send Reset Link
                                            </SubmitButton>
                                        </div>
                                    </div>
                                </form>
                            </>
                        ) : <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                style={{ backgroundColor: mode.buttonBg }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="text-white text-xl sm:text-2xl"
                                >
                                    ✓
                                </motion.div>
                            </div>
                            <h3
                                className="text-xl sm:text-2xl font-bold mb-2"
                                style={{ color: mode.text }}
                            >
                                Email Sent!
                            </h3>
                            <p
                                className="text-sm sm:text-base"
                                style={{ color: mode.subText }}
                            >
                                Check your inbox for the reset link
                            </p>
                        </motion.div>}

                    </motion.div>

                </motion.div>

            )}
        </AnimatePresence>
    )
}

export default ForgotPassModal