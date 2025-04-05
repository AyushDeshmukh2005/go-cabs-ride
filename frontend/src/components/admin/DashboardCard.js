
import React from 'react';

const DashboardCard = ({ title, value, icon, footer, trend }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
          {icon}
        </div>
      </div>
      <div className="mb-2">
        <div className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </div>
        {trend && (
          <div className={`text-xs font-medium ${
            trend.type === 'increase' 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.value}
          </div>
        )}
      </div>
      {footer && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
