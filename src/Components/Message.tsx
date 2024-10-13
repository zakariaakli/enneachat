import React from 'react';
import { MessageDto } from "../Models/MessageDto";
import styles from './Styles/Message.module.css';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div className={message.isUser ? styles.userMessage : styles.assistantMessage}>
        {message.content.split("\n").map((text, index) => (
          <React.Fragment key={index}>
            {text}
            <br />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Message;
