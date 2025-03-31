'use client';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  title: string;
}

interface NavigationBarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const NavigationBar = ({ items, activeItem, onItemClick }: NavigationBarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md py-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto space-x-1">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <button
                onClick={() => onItemClick(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeItem === item.id 
                    ? 'text-red-600' 
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-100'
                }`}
              >
                {item.title}
                {activeItem === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};