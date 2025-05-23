import React, { createContext, useState, useCallback, useContext } from 'react';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import Notification from '../components/Notifications/Notification'; // Adjust path if needed

const NotificationContext = createContext(null);

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px; // Below navbar
  right: 20px;
  z-index: 2000; // Above everything else
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Notifications align to the right
`;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substr(2, 9); // Simple unique ID
    setNotifications(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationContainer>
        <AnimatePresence>
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              notification={notification}
              onRemove={removeNotification}
            />
          ))}
        </AnimatePresence>
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
