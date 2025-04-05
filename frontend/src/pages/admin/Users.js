
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  User, UserCheck, UserX, Filter, Check, X, AlertTriangle,
  Phone, Mail, Calendar, Car, Shield, Search
} from 'lucide-react';
import AdminLayout from '../../components/layouts/AdminLayout';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [driversResponse, ridersResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/drivers`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/admin/riders`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const drivers = driversResponse.data.map(driver => ({ ...driver, role: 'driver' }));
      const riders = ridersResponse.data.map(rider => ({ ...rider, role: 'rider' }));
      
      const allUsers = [...drivers, ...riders];
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  
  const handleVerifyDriver = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/drivers/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Driver verified successfully');
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_verified: true } : user
      ));
      
      setFilteredUsers(filteredUsers.map(user => 
        user.id === id ? { ...user, is_verified: true } : user
      ));
      
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, is_verified: true });
      }
    } catch (error) {
      console.error('Error verifying driver:', error);
      toast.error('Failed to verify driver');
    }
  };
  
  const handleBlockUser = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/${role === 'driver' ? 'drivers' : 'riders'}/${id}/block`,
        { reason: 'Admin action' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`${role === 'driver' ? 'Driver' : 'Rider'} blocked successfully`);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_active: false } : user
      ));
      
      setFilteredUsers(filteredUsers.map(user => 
        user.id === id ? { ...user, is_active: false } : user
      ));
      
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, is_active: false });
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast.error(`Failed to block ${role === 'driver' ? 'driver' : 'rider'}`);
    }
  };
  
  const handleUnblockUser = async (id, role) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/${role === 'driver' ? 'drivers' : 'riders'}/${id}/unblock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`${role === 'driver' ? 'Driver' : 'Rider'} unblocked successfully`);
      
      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_active: true } : user
      ));
      
      setFilteredUsers(filteredUsers.map(user => 
        user.id === id ? { ...user, is_active: true } : user
      ));
      
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, is_active: true });
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast.error(`Failed to unblock ${role === 'driver' ? 'driver' : 'rider'}`);
    }
  };
  
  useEffect(() => {
    // Filter users based on activeTab and search
    let filtered = users;
    
    // Filter by tab
    if (activeTab === 'drivers') {
      filtered = users.filter(user => user.role === 'driver');
    } else if (activeTab === 'riders') {
      filtered = users.filter(user => user.role === 'rider');
    } else if (activeTab === 'pending') {
      filtered = users.filter(user => user.role === 'driver' && !user.is_verified && user.is_active);
    } else if (activeTab === 'blocked') {
      filtered = users.filter(user => !user.is_active);
    }
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.includes(search))
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, activeTab, search]);
  
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const UserDetailsModal = () => {
    if (!selectedUser) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Details</h2>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-2xl font-bold mr-4 mb-4 md:mb-0">
                {selectedUser.profile_image ? (
                  <img 
                    src={selectedUser.profile_image} 
                    alt={selectedUser.name} 
                    className="h-full w-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.innerText = selectedUser.name.charAt(0);
                    }}
                  />
                ) : (
                  selectedUser.name.charAt(0)
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{selectedUser.name}</h3>
                <div className="flex items-center mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedUser.role === 'driver' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {selectedUser.role === 'driver' ? 'Driver' : 'Rider'}
                  </span>
                  
                  {selectedUser.role === 'driver' && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      selectedUser.is_verified
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {selectedUser.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  )}
                  
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    selectedUser.is_active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {selectedUser.is_active ? 'Active' : 'Blocked'}
                  </span>
                </div>
                
                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="h-4 w-4 mr-1" />
                  {selectedUser.email}
                </div>
                
                {selectedUser.phone && (
                  <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="h-4 w-4 mr-1" />
                    {selectedUser.phone}
                  </div>
                )}
                
                <div className="flex items-center mt-1 text-sm text-gray-600 dark:text-gray-300">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined: {formatDate(selectedUser.created_at)}
                </div>
              </div>
            </div>
            
            {selectedUser.role === 'driver' && (
              <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                  <Car className="h-4 w-4 mr-1" />
                  Vehicle Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">License Number</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedUser.license_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Vehicle Model</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedUser.vehicle_model || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Vehicle Color</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedUser.vehicle_color || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Plate Number</p>
                    <p className="font-medium text-gray-800 dark:text-white">{selectedUser.vehicle_plate_number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              {selectedUser.role === 'driver' && !selectedUser.is_verified && selectedUser.is_active && (
                <button
                  onClick={() => handleVerifyDriver(selectedUser.id)}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Verify Driver
                </button>
              )}
              
              {selectedUser.is_active ? (
                <button
                  onClick={() => handleBlockUser(selectedUser.id, selectedUser.role)}
                  className="flex items-center px-4 py-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-800"
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Block User
                </button>
              ) : (
                <button
                  onClick={() => handleUnblockUser(selectedUser.id, selectedUser.role)}
                  className="flex items-center px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Unblock User
                </button>
              )}
              
              <button
                onClick={() => {
                  // Placeholder for view rides button
                  navigate(`/admin/users/${selectedUser.id}/rides`);
                }}
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <Car className="h-4 w-4 mr-2" />
                View Rides
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Users Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage drivers and riders in the GoCabs platform</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'all'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'drivers'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab('riders')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'riders'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Riders
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'pending'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Pending Verification
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'blocked'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Blocked Users
          </button>
        </div>
        
        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <User className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No users found</p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                            {user.profile_image ? (
                              <img 
                                src={user.profile_image} 
                                alt={user.name} 
                                className="h-full w-full rounded-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.innerText = user.name.charAt(0);
                                }}
                              />
                            ) : (
                              user.name.charAt(0)
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              {user.role === 'driver' ? (
                                <Car className="h-3 w-3 mr-1" />
                              ) : (
                                <User className="h-3 w-3 mr-1" />
                              )}
                              {user.role === 'driver' ? 'Driver' : 'Rider'}
                              {user.rating && (
                                <span className="ml-2 flex items-center">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="ml-1">{user.rating}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.is_active 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.is_active ? 'Active' : 'Blocked'}
                          </span>
                          
                          {user.role === 'driver' && (
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.is_verified
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {user.is_verified ? 'Verified' : 'Pending'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => viewUserDetails(user)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            Details
                          </button>
                          
                          {user.role === 'driver' && !user.is_verified && user.is_active && (
                            <button
                              onClick={() => handleVerifyDriver(user.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 flex items-center"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Verify
                            </button>
                          )}
                          
                          {user.is_active ? (
                            <button
                              onClick={() => handleBlockUser(user.id, user.role)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Block
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUnblockUser(user.id, user.role)}
                              className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 flex items-center"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Unblock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {showDetailsModal && <UserDetailsModal />}
    </AdminLayout>
  );
};

export default Users;
