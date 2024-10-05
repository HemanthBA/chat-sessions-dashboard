import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { ChatSession } from '../types';

interface ChatSessionCardProps {
  session: ChatSession;
  isSelected: boolean;
  onSelect: () => void;
}

const ChatSessionCard: React.FC<ChatSessionCardProps> = ({ session, isSelected, onSelect }) => {
  const getTimeSinceOpened = (timestamp: string) => {
    const now = new Date();
    const openedTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - openedTime.getTime()) / 60000);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInMinutes / 1440);
      return `${diffInDays} days ago`;
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={isSelected ? 'purple.200' : 'white'}
      p={2}
      borderBottom={1}
      borderColor="grey.300"
      borderRadius={1}
      onClick={onSelect}
      sx={{ cursor: 'pointer', transition: 'background-color 0.3s ease', '&:hover': { backgroundColor: 'grey.100' } }}
    >
      <Avatar src={`https://randomuser.me/api/portraits/thumb/men/${session.id % 100}.jpg`} alt="DP" sx={{ mr: 2 }} />
      <Box flexGrow={1}>
        <Typography fontWeight="bold">Session {session.id}</Typography>
      </Box>
      <Typography color="textSecondary">{getTimeSinceOpened(session.messages[0].timestamp)}</Typography>
    </Box>
  );
};

export default ChatSessionCard;