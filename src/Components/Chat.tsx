import React, { useEffect, useState, useRef } from "react";
import { Container, Grid, Box, LinearProgress, Button } from "@mui/material"; // Import Button
import ChatInput from "./ChatInput";
import Message from "./Message";
import { OpenAI} from "openai";
import { MessageDto } from "../Models/MessageDto";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";


interface ResultData {
  EnneaType1: number;
  EnneaType2: number;
  EnneaType3: number;
  Profession: string;
  UserName: string;
  Triad: string;
  UserId: string;
}

// Function to check if the chatbot has completed the process
function hasChatbotFinishedFunc(message: string): boolean {
  const hasWeAre = message.includes("We are");
  return hasWeAre;
}

// Function to extract name, date, and result from the chatbot's final message
function extractInfoFromChatbotMessage(message: string) {
  if (!hasChatbotFinishedFunc(message)) {
    console.log("Chatbot hasn't finished yet.");
    return null;
  }

// Define regex patterns to extract information from the updated message
const datePattern = /We are the ([\w\s]+),/;  // Extracts the date
const namePattern = /You are ([\w\s]+) -/;    // Extracts the name
const professionPattern = /- ([\w\s]+),/;     // Extracts the profession
const resultPattern = /Enneagram likely type: (\d)/; // Extracts the Enneagram type

// Use regex to match patterns
const dateMatch = message.match(datePattern);
const nameMatch = message.match(namePattern);
const professionMatch = message.match(professionPattern);
const resultMatch = message.match(resultPattern);

// Extract values or return default if not found
const date = dateMatch ? dateMatch[1] : 'Unknown date';
const name = nameMatch ? nameMatch[1] : 'Unknown user';
const profession = professionMatch ? professionMatch[1] : 'Unknown profession';
const result = resultMatch ? resultMatch[1] : 0;

// Return extracted data
return { date, name, profession, result };
};

const Chat: React.FC = () => {
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
      console.log("-------------------");
    console.log(lastMessage);
    console.log("-------------------");
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
          { role: "system", content: "extract the most likely enneagram type that the user might be the enneagramtype1 being the most likely. then extract the name, prfession, and the enneagram triad" },
          { role: "user", content: "Certainly, heres a detailed report of your responses and the final assessment:**Instinctive Triad:**- I often rely on my gut feelings to make decisions: **5**- I am very aware of my environment and react quickly to changes: **6**- Physical activity is important to me, and I feel best when I am active: **4****Feeling Triad:**- Relationships are very important to me, and I prioritize maintaining personal connections: **4**- I am highly aware of my own and others' emotions: **7**- I often consider how my actions will affect others before I act: **5****Thinking Triad:**- I seek to understand the world through logic and analysis: **6**- I am often detached from my emotions when making decisions: **6**- I plan meticulously and think through possible scenarios before deciding: **9****Type Determination within Thinking Triad:**- Type Five: The Investigator  - I am curious and always looking to learn more about how things work: **7**  - I often prefer to observe rather than participate: **3**- Type Six: The Loyalist  - I am cautious and like to be prepared for any situation: **9**  - I seek security and often worry about what could go wrong: **9**- Type Seven: The Enthusiast  - I am energetic and always planning new adventures: **4**Based on the highest scores, particularly in the Thinking Triad and within Type Six questions, your Enneagram likely type is Type Six: The Loyalist.We are the - [today's date] - you are - Zakaria Akli - and here is your final result - Enneagram likely type: Type Six - The Loyalist.If you want, click on the button to book an appointment." },
        ],
        response_format: zodResponseFormat(EnneagramResult, "result"),
      });
      const event = completion.choices[0].message.parsed;
      console.log(event);
      setName(event.name);

      //END TEST OPENAI API
        const res = extractInfoFromChatbotMessage(lastMessage.content[0]["text"].value);
        if (res) {
          const data: ResultData = {
            EnneaType1: Number(res.result),
            EnneaType2: 0,
            EnneaType3: 0,
            Profession: res.profession,
            UserName: res.name,
            Triad: "",
            UserId: "",
          };
          addResult(data);
        }

        console.log(res);
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
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          {[...Array(10).keys()].map((num) => (
            <Button
              key={num}
              variant="contained"
              onClick={() => handleButtonClick(num)}
              sx={{ margin: 0.5 }}
              style={{height: '30px', width : '30px'}}
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
