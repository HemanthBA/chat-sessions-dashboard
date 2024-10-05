import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { ChatSession } from '../types';

interface ChatDetailsModalProps {
  session: ChatSession;
  onClose: () => void;
}

const ChatDetailsModal: React.FC<ChatDetailsModalProps> = ({ session, onClose }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box display="flex" alignItems="center" p={2} bgcolor="white" color="black">
        <Avatar src={`https://randomuser.me/api/portraits/thumb/men/${session.id % 100}.jpg`} alt="DP" sx={{ mr: 2 }} />
        <Typography variant="h6" fontWeight="bold">Session {session.id}</Typography>
      </Box>
      <Box flexGrow={1} p={2} overflow="auto" bgcolor="grey.100">
        {session.messages.map((message, index) => (
          <Box key={`${message.id}-${index}`} display="flex" flexDirection="column" mb={2}>
            <Box
              p={2}
              borderRadius={1}
              bgcolor={message.action === 'USER' ? 'grey.800' : 'grey.600'}
              color="white"
              alignSelf={message.action === 'USER' ? 'flex-end' : 'flex-start'}
            >
              <Typography>{message.content}</Typography>
            </Box>
            <Typography
              variant="caption"
              color="textSecondary"
              alignSelf={message.action === 'USER' ? 'flex-end' : 'flex-start'}
              mt={1}
            >
              {formatDate(message.timestamp)} {formatTime(message.timestamp)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChatDetailsModal;