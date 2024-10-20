import React, { useEffect, useState, useRef, useContext } from "react";
import { Container, Grid, Box, LinearProgress, Button } from "@mui/material"; // Import Button
import ChatInput from "./ChatInput";
import Message from "./Message";
import { OpenAI} from "openai";
import { MessageDto } from "../Models/MessageDto";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import {DataContext} from "../Helpers/dataContext"
import { ResultData } from "../Models/EnneagramResult";

interface ChatProps{
  setAssessmentResult: (result: any) => void;
}

// Function to check if the chatbot has completed the process
function hasChatbotFinishedFunc(message: string): boolean {
  const hasWeAre = message.includes("We are");
  return hasWeAre;
}

const Chat: React.FC<ChatProps> = ({setAssessmentResult}) => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>([]);
  const [input, setInput] = useState<string>("");
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [ratingQuestion, setRatingQuestion] = useState<string>("");
  const [showSendReport, setShowSendReport] = useState<boolean>(false);
  const [hasChatbotFinished, setHasChatbotFinished] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const updateData  = useContext(DataContext);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "Hi, I'm your Enneagram assistant. Do you want to run a type assessment?",
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
    setShowButtons(false);
    setHasChatbotFinished(false);

  };

  const createNewMessage = (content: string, isUser: boolean) => {
    return new MessageDto(isUser, content);
  };

  const handleSendMessage = async (message?: string) => {
    const newMessages = [...messages, createNewMessage(message || input, true)];
    setMessages(newMessages);
    setInput("");

    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message || input, // Use the passed message or input state
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.REACT_APP_ASSISTANT_ID,
    });

    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (response.status === "in_progress" || response.status === "queued") {
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    const messageList = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messageList.data
      .filter((message: any) => message.run_id === run.id && message.role === "assistant")
      .pop();

    if (lastMessage) {
      setMessages([...newMessages, createNewMessage(lastMessage.content[0]["text"].value, false)]);
      if (hasChatbotFinishedFunc(lastMessage.content[0]["text"].value)) {
        setHasChatbotFinished(true);
          // TEST OPENAI API
      const EnneagramResult = z.object({
        enneagramType1: z.number(),
        enneagramType2: z.number(),
        enneagramType3: z.number(),
        profession: z.string(),
        name: z.string(),
        triad: z.string(),
      });

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "system", content: "extract the most likely enneagram type that the user might be the enneagramtype1 being the most likely. in the enneagramtype2 you put the second most likely type. in the enneagramtype3 you put the third most likely type. then extract the name, profession, and the enneagram triad" },
          { role: "user", content: lastMessage.content[0]["text"].value },
        ],
        response_format: zodResponseFormat(EnneagramResult, "result"),
      });
      const event = completion.choices[0].message.parsed;
      try{
        // Add the result to the database
        addResult(event);
// sen data to the parent component to update the
setAssessmentResult(event);
      }
      catch(error){
        console.log("Error adding result: ", error);
      }

      }
      } else {
        console.log("Chatbot process is not yet complete.");
      }


    // Check if the last message is a prompt for rating
    if (lastMessage && (lastMessage.content[0]["text"].value.includes("Please rate the following"))
          || lastMessage.content[0]["text"].value.includes("please rate the following")
          || lastMessage.content[0]["text"].value.includes("Now, please rate the")) {
      setShowButtons(true);
      setRatingQuestion(lastMessage.content[0]["text"].value);
    } else {
      setShowButtons(false);
    }
  };

  const handleButtonClick = (value: number) => {
    handleSendMessage(value.toString()); // Send the rating as a string
    setShowButtons(false); // Hide buttons after selection
  };

  const addResult = async (resultData: ResultData) => {
    try {
      const resultsCollectionRef = collection(db, "Results");
      const docRef = await addDoc(resultsCollectionRef, resultData);
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };




  return (
    <Container maxWidth="sm" sx={{ height: "70vh", display: "flex", flexDirection: "column" }}>
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
      {showButtons && (
       <Box
       sx={{
         display: "flex",
         flexWrap: "wrap",        // Enables wrapping of buttons
         justifyContent: "center",
         marginTop: 2,
         maxWidth: "100%",       // Set the width to control the number of buttons per row
       }}
     >
       {[...Array(10).keys()].map((num) => (
         <Button
           key={num}
           variant="contained"
           onClick={() => handleButtonClick(num)}
           sx={{ margin: 0.5 }}
           style={{ height: '15px', width: '30px' }}  // Adjusted width and height for visibility
         >
           {num}
         </Button>
       ))}
     </Box>
      )}
      <ChatInput
        input={input}
        setInput={setInput}
        handleSendMessage={handleSendMessage} // Pass the modified function
        refreshTest={initChatBot}
        isWaiting={isWaiting}
        isTestFinished={hasChatbotFinished}
        name={name}
      />
      {isWaiting && <LinearProgress color="inherit" />}
    </Container>
  );
}

export default Chat;
