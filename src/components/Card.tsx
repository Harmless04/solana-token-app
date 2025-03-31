'use client';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-lg ${className}`}>
      {children}
    </div>
  );
};