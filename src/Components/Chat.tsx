import React, { useEffect, useState, useRef } from "react";
import { Container, Grid, Box, LinearProgress } from "@mui/material";
import ChatInput from "./ChatInput";
import Message from "./Message";
import OpenAI from "openai";
import { MessageDto } from "../Models/MessageDto";

const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null); // For scrolling to the bottom

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "Hi, I'm your personal assistant. How can I help you?",
        isUser: false,
      },
    ]);
  }, [thread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    const thread = await openai.beta.threads.create();
    setOpenai(openai);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    return new MessageDto(isUser, content);
  };

  const handleSendMessage = async () => {
    const newMessages = [...messages, createNewMessage(input, true)];
    setMessages(newMessages);
    setInput("");

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: "asst_FBGiNyeXHLkKi1vCYrAjIQyR",
    });

    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === "in_progress" || response.status === "queued") {
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    const messageList = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messageList.data
      .filter((message: any) => message.run_id === run.id && message.role === "assistant")
      .pop();

    if (lastMessage) {
      setMessages([...newMessages, createNewMessage(lastMessage.content[0]["text"].value, false)]);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: "80vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 2 }}>
        <Grid container direction="column" spacing={2}>
          {messages.map((message, index) => (
            <Grid item alignSelf={message.isUser ? "flex-end" : "flex-start"} key={index}>
              <Message message={message} />
            </Grid>
          ))}
          <div ref={messagesEndRef} />
        </Grid>
      </Box>
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage}
        isWaiting={isWaiting}
      />
      {isWaiting && <LinearProgress color="inherit" />}
    </Container>
  );
};

export default Chat;
