'use client';

import { motion } from "framer-motion";

interface TechBadgeProps {
  children: React.ReactNode;
}

export const TechBadge: React.FC<TechBadgeProps> = ({ children }) => {
  return (
    <motion.span 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-sm font-medium"
    >
      {children}
    </motion.span>
  );
}; 