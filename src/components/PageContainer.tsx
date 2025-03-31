'use client';
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageContainerProps {
  activeSection: string;
  sections: {
    id: string;
    component: ReactNode;
  }[];
}

export const PageContainer = ({ activeSection, sections }: PageContainerProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <AnimatePresence mode="wait">
        {sections.map(
          (section) =>
            activeSection === section.id && (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.97 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 30,
                  duration: 0.4 
                }}
              >
                {section.component}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};