import React from "react";
import { Typography, Grid } from "@mui/material";


const ChatHeader: React.FC = () => {
  return (
    <Grid container className="chat-header">
      <Typography variant="h5">ChatBot Test Enneagram</Typography>
    </Grid>
  );
};

export default ChatHeader;