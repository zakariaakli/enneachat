import React from 'react';
import './App.css';
import Chat from './Components/Chat';
import logo from './Images/EnneagramLogo.png'

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Enneagram Insights</h1>
        <p>Your personal journey towards self-discovery and growth starts here!</p>
      </header>
      <div className="App-container">
        <div className="Info-section">
          <div className="Info-header">
            <h2>Discover Your Potential</h2>
          </div>
          <div className="Info-content">
            <img
              src= {require('./Images/EnneagramLogo.png')}
              alt="Enneagram Logo"
              className="Enneagram-logo"
            />
            <p>
              Understanding your Enneagram type can provide insights into your personality,
              motivations, and relationships.
            </p>
            <p>
              Taking the Enneagram test can help you identify your strengths and areas for
              growth, leading to a more fulfilling life.
            </p>
            <p>
              Run the test today and unlock your path to personal and professional success!
            </p>
          </div>
        </div>
        <div className="Chat-section">
          <Chat />
        </div>
        <div className="Result-section">
          <h2>Your Results</h2>
          <p>Discover your Enneagram type and what it means for you!</p>
          <button className="Book-appointment-button">Book an Appointment with a Coach</button>
        </div>
      </div>
    </div>
  );
};

export default App;
