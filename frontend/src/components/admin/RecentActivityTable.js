
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Car, CreditCard, Activity } from 'lucide-react';

const RecentActivityTable = ({ data }) => {
  const [activeTab, setActiveTab] = useState('rides');
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const tabs = [
    { id: 'rides', label: 'Recent Rides', icon: Car },
    { id: 'users', label: 'New Users', icon: User },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'logs', label: 'Activity Logs', icon: Activity },
  ];
  
  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-1" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab Content */}
      <div className="overflow-x-auto">
        {activeTab === 'rides' && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rider</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Driver</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fare</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {data.rides && data.rides.map((ride) => (
                <tr key={ride.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link to={`/admin/rides/${ride.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      #{ride.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.rider_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{ride.driver_name || 'Not assigned'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ride.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      ride.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ${ride.final_fare || ride.estimated_fare}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {formatDate(ride.requested_at)}
                  </td>
                </tr>
              ))}
              {(!data.rides || data.rides.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent rides found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {activeTab === 'users' && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {data.users && data.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link to={`/admin/users/${user.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      #{user.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      user.role === 'driver' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {formatDate(user.created_at)}
                  </td>
                </tr>
              ))}
              {(!data.users || data.users.length === 0) && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {activeTab === 'payments' && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ride</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {data.payments && data.payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-gray-600 dark:text-gray-300">#{payment.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link to={`/admin/rides/${payment.ride_id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      #{payment.ride_id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">${payment.amount}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      payment.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      payment.status === 'refunded' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{payment.rider_name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {formatDate(payment.created_at)}
                  </td>
                </tr>
              ))}
              {(!data.payments || data.payments.length === 0) && (
                <tr>
                  <td colSpan="6" className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {activeTab === 'logs' && (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Activity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {data.logs && data.logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {log.user_name ? (
                      <div className="flex items-center">
                        <span className="text-sm">{log.user_name}</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          log.user_role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          log.user_role === 'driver' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {log.user_role}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">System</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
                      {log.activity_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                      {log.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-xs">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
              {(!data.logs || data.logs.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent activity logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="mt-4 text-right">
        <Link to={`/admin/${activeTab}`} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View all {activeTab}
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityTable;
