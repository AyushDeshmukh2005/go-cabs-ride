
import React, { useState, useEffect } from 'react';
import { AlertTriangle, AlertOctagon, X } from 'lucide-react';

const EmergencyModal = ({ isOpen, onClose, onSubmit }) => {
  const [emergencyType, setEmergencyType] = useState('medical');
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      // Get current location when modal opens
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude},${longitude}`);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocation('Unknown');
          }
        );
      } else {
        setLocation('Geolocation not supported');
      }
    }
  }, [isOpen]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ emergencyType, message, location });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-red-600 flex items-center">
            <AlertOctagon className="h-6 w-6 mr-2" />
            Emergency Alert
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">
                Use this only for genuine emergency situations. Help will be dispatched immediately.
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Emergency Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEmergencyType('medical')}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  emergencyType === 'medical'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Medical
              </button>
              <button
                type="button"
                onClick={() => setEmergencyType('safety')}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  emergencyType === 'safety'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Safety
              </button>
              <button
                type="button"
                onClick={() => setEmergencyType('accident')}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  emergencyType === 'accident'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Accident
              </button>
              <button
                type="button"
                onClick={() => setEmergencyType('other')}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  emergencyType === 'other'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Other
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="emergency-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Details (optional)
            </label>
            <textarea
              id="emergency-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your emergency..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your current location will be shared: 
              <span className="font-mono ml-1">{location || 'Getting location...'}</span>
            </p>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Send Emergency Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmergencyModal;
