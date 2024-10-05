import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { fetchChatSessions } from './services/api';
import ChatSessionCard from './components/ChatSessionCard';
import ChatDetailsModal from './components/ChatDetailsModal';
import { ChatSession } from './types'; // Ensure ChatSession type is imported

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [page, setPage] = useState<number>(1);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const data = await fetchChatSessions(page, 20);  // Updated perPage to 20
        setSessions((prevSessions) => {
          const newSessions = data.chat_sessions.filter(
            (newSession: ChatSession) => !prevSessions.some((session) => session.id === newSession.id)
          );
          return [...prevSessions, ...newSessions];
        });
        setHasMore(page < data.pages);
      } catch (err) {
        setError('Failed to load sessions. Please try again.');
      }
      setLoading(false);
    };
    loadSessions();
  }, [page]);

  const loadMoreSessions = async () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight / 2) {
      loadMoreSessions();
    }
  }, [hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <Box display="flex" height="100vh" flexDirection={{ xs: 'column', md: 'row' }}>
      {/* Sidebar for Chat Sessions */}
      <Box
        width={{ xs: '100%', md: '25%' }}
        bgcolor="white"
        borderRight={{ md: 1 }}
        borderColor="grey.300"
        overflow="auto"
        height={{ xs: '50vh', md: '100vh' }}
      >
        <Box p={2} bgcolor="white" color="black">
          <Typography variant="h5" fontWeight="bold">Messaging</Typography>
        </Box>
        <Box p={2} display="flex" flexDirection="column">
          {sessions.map((session) => (
            <ChatSessionCard
              key={session.id}
              session={session}
              isSelected={session.id === selectedSessionId}
              onSelect={() => setSelectedSessionId(session.id)}
            />
          ))}
          {loading && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>

      {/* Chat Details Section */}
      <Box
        width={{ xs: '100%', md: '75%' }}
        display="flex"
        flexDirection="column"
        height={{ xs: '50vh', md: '100vh' }}
      >
        {selectedSessionId !== null ? (
          <ChatDetailsModal
            session={sessions.find((session) => session.id === selectedSessionId)!}
            onClose={() => setSelectedSessionId(null)}
          />
        ) : (
          <Box display="flex" flexGrow={1} alignItems="center" justifyContent="center">
            <Typography>Select a chat session to view messages</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default App;
