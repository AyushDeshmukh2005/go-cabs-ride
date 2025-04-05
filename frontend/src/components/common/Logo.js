
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Logo = ({ size = 'default' }) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    small: 'h-6',
    default: 'h-8',
    large: 'h-10'
  };
  
  const iconSizes = {
    small: 16,
    default: 20,
    large: 24
  };
  
  return (
    <Link to="/" className="flex items-center text-gray-900 dark:text-white">
      <div className="p-1 bg-blue-500 rounded-md mr-2">
        <Car className="text-white" size={iconSizes[size] || 20} />
      </div>
      <span className={`font-bold ${sizeClasses[size] || 'h-8'}`}>GoCabs</span>
    </Link>
  );
};

export default Logo;
