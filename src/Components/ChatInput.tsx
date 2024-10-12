import React from 'react';
import { TextField, Button, Grid } from '@mui/material';

interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  isWaiting: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSendMessage, isWaiting }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Grid container spacing={2} style={{ borderTop: '1px solid #ddd', backgroundColor: '#fafafa' }}>
      <Grid item xs={9}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          disabled={isWaiting}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </Grid>
      <Grid item xs={3} container alignItems="center" justifyContent="center">
        <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={isWaiting}>
          Send
        </Button>
      </Grid>
    </Grid>
  );
};

export default ChatInput;
