
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const DashboardChart = ({ period = 'daily' }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/reports/revenue?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        // Format data for the chart
        const formattedData = response.data.data.map(item => ({
          name: formatPeriod(item.time_period, period),
          revenue: parseFloat(item.total_revenue),
          transactions: parseInt(item.transaction_count)
        }));
        
        setChartData(formattedData.slice(0, 10).reverse());
      } catch (error) {
        console.error('Error fetching revenue data for chart:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRevenueData();
  }, [period]);
  
  const formatPeriod = (timePeriod, periodType) => {
    switch(periodType) {
      case 'hourly':
        return timePeriod.split(' ')[1].slice(0, 5);
      case 'daily':
        return timePeriod.slice(5); // Show only MM-DD
      case 'weekly':
        return `Week ${timePeriod.split('-')[1]}`;
      case 'monthly':
        const date = new Date(timePeriod + '-01');
        return date.toLocaleString('default', { month: 'short' });
      default:
        return timePeriod;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: darkMode ? '#ccc' : '#666' }}
          />
          <YAxis 
            tick={{ fill: darkMode ? '#ccc' : '#666' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#333' : '#fff',
              color: darkMode ? '#fff' : '#333',
              border: `1px solid ${darkMode ? '#444' : '#ddd'}`
            }}
          />
          <Legend />
          <Bar dataKey="revenue" name="Revenue ($)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="transactions" name="Transactions" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardChart;
