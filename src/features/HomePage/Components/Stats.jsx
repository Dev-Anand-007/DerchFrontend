import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import {themes} from '../../../constants/colors';


const Stats = (props) => {
    const mode = themes.lightMode;
    // Animation variants
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };
    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };
    return (
        <div>  {/* Stats Section */}
            <motion.section
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="mb-16"
            >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Premium Products", value: `${props.totalproduct}` },
                        { label: "Happy Customers", value: "10K+" },
                        { label: "Countries", value: "25+" },
                        { label: "Years Experience", value: "15+" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="text-center p-6 rounded-2xl"
                            style={{ backgroundColor: mode.homelight }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div
                                className="text-3xl font-bold mb-2"
                                style={{ color: mode.buttonBg }}
                            >
                                {stat.value}
                            </div>
                            <div
                                className="text-sm font-medium"
                                style={{ color: mode.subText }}
                            >
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section></div>
    )
}

export default Stats