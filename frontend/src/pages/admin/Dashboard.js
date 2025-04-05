
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Users, Car, CreditCard, BarChart3, Settings,
  TrendingUp, AlertCircle, CheckCircle, Clock, Activity
} from 'lucide-react';
import AdminLayout from '../../components/layouts/AdminLayout';
import DashboardCard from '../../components/admin/DashboardCard';
import DashboardChart from '../../components/admin/DashboardChart';
import RecentActivityTable from '../../components/admin/RecentActivityTable';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: {
      total_riders: 0,
      total_drivers: 0,
      verified_drivers: 0,
      pending_drivers: 0,
      blocked_users: 0,
    },
    rides: {
      total_rides: 0,
      completed_rides: 0,
      cancelled_rides: 0,
      active_rides: 0,
      average_fare: 0,
      total_distance: 0,
    },
    revenue: {
      total_revenue: 0,
      total_transactions: 0,
    },
    today: {
      today_rides: 0,
      today_revenue: 0,
    }
  });
  
  const [recentActivity, setRecentActivity] = useState({
    rides: [],
    users: [],
    payments: [],
    logs: []
  });
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [statsResponse, activityResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard/recent-activity`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const navigations = [
    { name: 'Users', icon: Users, href: '/admin/users' },
    { name: 'Rides', icon: Car, href: '/admin/rides' },
    { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' },
  ];
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome to the GoCabs Admin Dashboard</p>
        </div>
        
        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {navigations.map((nav) => (
            <Link
              key={nav.name}
              to={nav.href}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
            >
              <nav.icon className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm font-medium">{nav.name}</span>
            </Link>
          ))}
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DashboardCard 
            title="Total Users" 
            value={stats.users.total_riders + stats.users.total_drivers} 
            icon={<Users className="h-6 w-6 text-blue-500" />}
            footer={`${stats.users.total_riders} Riders, ${stats.users.total_drivers} Drivers`}
          />
          <DashboardCard 
            title="Total Rides" 
            value={stats.rides.total_rides} 
            icon={<Car className="h-6 w-6 text-green-500" />}
            footer={`${stats.rides.completed_rides} Completed, ${stats.rides.active_rides} Active`}
          />
          <DashboardCard 
            title="Revenue" 
            value={`$${parseFloat(stats.revenue.total_revenue).toFixed(2)}`} 
            icon={<CreditCard className="h-6 w-6 text-indigo-500" />}
            footer={`${stats.revenue.total_transactions} Transactions`}
          />
          <DashboardCard 
            title="Today's Stats" 
            value={`${stats.today.today_rides} Rides`} 
            icon={<Activity className="h-6 w-6 text-purple-500" />}
            footer={`$${parseFloat(stats.today.today_revenue).toFixed(2)} Revenue`}
          />
        </div>
        
        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-1">
            <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Verified Drivers</span>
                <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {stats.users.verified_drivers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Pending Drivers</span>
                <span className="flex items-center text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  <Clock className="h-4 w-4 mr-1" />
                  {stats.users.pending_drivers}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Blocked Users</span>
                <span className="flex items-center text-sm font-medium text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {stats.users.blocked_users}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Average Fare</span>
                <span className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  ${parseFloat(stats.rides.average_fare).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Distance</span>
                <span className="text-sm font-medium">
                  {parseFloat(stats.rides.total_distance).toFixed(2)} km
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 col-span-2">
            <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
            <DashboardChart />
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <RecentActivityTable data={recentActivity} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
