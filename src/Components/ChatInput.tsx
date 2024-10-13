import React from 'react';
import { TextField, Button, Grid } from '@mui/material';
import styles from './Styles/ChatInput.module.css';
import { generatePDF } from "../Helpers/pdfHelper"


interface ChatInputProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  refreshTest: () => void;
  isWaiting: boolean;
  isTestFinished: boolean;
  name: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSendMessage, refreshTest, isWaiting, isTestFinished, name }) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Grid container spacing={2} className={styles.inputContainer}>
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
        <Button variant="contained" color="primary" style={{height: '30px', margin: '10px'}} onClick={handleSendMessage} disabled={isWaiting}>
          Send
        </Button>
        <Button variant="contained"  style={{height: '30px', margin: '10px'}} color="warning"
        onClick={refreshTest} disabled={isWaiting}>
          Restart
        </Button>
        {isTestFinished && <Button variant="contained"  style={{height: '40px', margin: '10px'}} color="warning"
            onClick={() => generatePDF(name)}  disabled={isWaiting}>
          Send Report
        </Button>}
      </Grid>
    </Grid>
  );
};

export default ChatInput;
