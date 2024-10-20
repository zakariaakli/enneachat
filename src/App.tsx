import React, {useState} from 'react';
import './App.css';
import Chat from './Components/Chat';
import logo from './Images/EnneagramLogo.png'
import EnneagramReport from './Components/ResultTest';
import ChatbotEnneagram from './Components/Chat';
import {DataContext} from "./Helpers/dataContext"
import { ResultData} from './Models/EnneagramResult';
import GlobalTest from './Components/GlobalTest';



const App: React.FC = () => {

  const [enneagramResult, setEnneagramResult] = useState<ResultData>();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Enneagram Insights</h1>
        <p>Your personal journey towards self-discovery and growth starts here!</p>
      </header>

<GlobalTest/>
    </div>
  );
};

export default App;
