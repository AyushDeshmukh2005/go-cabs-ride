
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Send, ArrowLeft, Phone, Map, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import MainLayout from '../components/layouts/MainLayout';
import EmergencyModal from '../components/ride/EmergencyModal';

const ChatPage = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, joinRideRoom, leaveRideRoom, sendMessage, sendEmergencyAlert } = useSocket();
  
  const [ride, setRide] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatPartner, setChatPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  
  const messagesEndRef = useRef(null);
  
  // Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setRide(response.data);
        
        // Determine chat partner
        if (user.role === 'rider') {
          setChatPartner({
            id: response.data.driver_id,
            name: response.data.driver_name,
            role: 'driver'
          });
        } else if (user.role === 'driver') {
          setChatPartner({
            id: response.data.rider_id,
            name: response.data.rider_name,
            role: 'rider'
          });
        }
        
        // Fetch past messages
        const messagesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/rides/${rideId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setMessages(messagesResponse.data);
      } catch (error) {
        console.error('Error fetching ride data:', error);
        toast.error('Failed to load chat. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRide();
  }, [rideId, user.role]);
  
  // Join ride room and setup socket listeners
  useEffect(() => {
    if (socket && rideId) {
      joinRideRoom(rideId);
      
      // Listen for new messages
      const handleReceiveMessage = (data) => {
        if (data.rideId === rideId || data.senderId) {
          setMessages((prevMessages) => [
            ...prevMessages, 
            {
              id: Date.now(), // temporary ID
              sender_id: data.senderId,
              message: data.message,
              created_at: data.timestamp
            }
          ]);
        }
      };
      
      socket.on('receive_message', handleReceiveMessage);
      
      return () => {
        socket.off('receive_message', handleReceiveMessage);
        leaveRideRoom(rideId);
      };
    }
  }, [socket, rideId, joinRideRoom, leaveRideRoom]);
  
  // Scroll to bottom of chat on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (chatPartner && sendMessage(rideId, chatPartner.id, newMessage)) {
      // Add message to state immediately for UI feedback
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(), // temporary ID
          sender_id: user.id,
          message: newMessage,
          created_at: new Date()
        }
      ]);
      
      // Save message to backend
      const token = localStorage.getItem('token');
      axios.post(
        `${process.env.REACT_APP_API_URL}/api/rides/${rideId}/messages`,
        {
          receiver_id: chatPartner.id,
          message: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(error => {
        console.error('Error saving message:', error);
        toast.error('Failed to send message');
      });
      
      setNewMessage('');
    }
  };
  
  const handleSubmitEmergency = (data) => {
    const { emergencyType, message, location } = data;
    
    sendEmergencyAlert(rideId, location, emergencyType, message);
    
    toast.error('Emergency alert sent! Help is on the way.', {
      autoClose: false,
      closeButton: true
    });
    
    setShowEmergencyModal(false);
  };
  
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }
  
  if (!ride) {
    return (
      <MainLayout>
        <div className="text-center p-4">
          <p className="text-red-500">Ride not found or you don't have access to this chat.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Chat header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-800 dark:text-white flex items-center">
                {chatPartner?.name || 'Chat'}
                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {chatPartner?.role || 'User'}
                </span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ride #{rideId} • {ride.status}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <button 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => navigate(`/rider/rides/${rideId}`)}
              >
                <Map className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => window.open(`tel:${chatPartner?.phone}`)}
              >
                <Phone className="h-5 w-5" />
              </button>
              
              <button 
                className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setShowEmergencyModal(true)}
              >
                <AlertTriangle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.sender_id === user.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender_id === user.id
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatMessageTime(message.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-l-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Emergency Modal */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        onSubmit={handleSubmitEmergency}
      />
    </MainLayout>
  );
};

export default ChatPage;
