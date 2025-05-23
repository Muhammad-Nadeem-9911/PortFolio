import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const notificationTypes = {
  success: {
    icon: <FiCheckCircle />,
    color: props => props.theme.colors.primaryAccent, // Or a dedicated success color
  },
  error: {
    icon: <FiXCircle />,
    color: props => props.theme.colors.danger || '#e74c3c', // Add theme.colors.danger or use a fallback
  },
  info: {
    icon: <FiInfo />,
    color: props => props.theme.colors.secondaryAccent, // Or a dedicated info color
  },
  warning: {
    icon: <FiAlertTriangle />,
    color: props => props.theme.colors.warning || '#f39c12', // Add theme.colors.warning or use a fallback
  },
};

const NotificationWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 12px 18px;
  margin-bottom: 10px;
  border-radius: 6px;
  color: ${props => props.theme.colors.cardBackground}; // Light text on dark/colored background
  background-color: ${props => notificationTypes[props.type]?.color(props) || props.theme.colors.secondaryAccent};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 400px;
  font-size: 0.95rem;
  position: relative; // For close button

  ${props =>
    props.type &&
    css`
      border-left: 5px solid ${props => notificationTypes[props.type]?.color(props) || props.theme.colors.secondaryAccent}BF; // Darker shade or slightly transparent
    `}
`;

const IconWrapper = styled.span`
  margin-right: 12px;
  font-size: 1.4em;
  display: flex;
  align-items: center;
`;

const Message = styled.span`
  flex-grow: 1;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit; // Inherits color from NotificationWrapper
  opacity: 0.7;
  cursor: pointer;
  font-size: 1.2em;
  padding: 5px;
  margin-left: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const Notification = ({ notification, onRemove }) => {
  const { id, message, type = 'info', duration = 5000 } = notification;
  const config = notificationTypes[type] || notificationTypes.info;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  return (
    <NotificationWrapper
      type={type}
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.5, transition: { duration: 0.2 } }}
      layout
    >
      <IconWrapper>{config.icon}</IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={() => onRemove(id)} aria-label="Close notification">
        <FiX />
      </CloseButton>
    </NotificationWrapper>
  );
};

export default Notification;
