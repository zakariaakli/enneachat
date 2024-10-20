import React, {useState} from "react";
import  Chat  from "./Chat"
import ResultTest from "./ResultTest"
import {ResultData } from "../Models/EnneagramResult"
import logo from "../Images/EnneagramLogo.png"
import "../App.css"

const RadarChart: React.FC = () => {

    const [assessmentResult, setAssessmentResult] = useState<ResultData | null>();


  return (
    <div className="App-container">
        <div className="Info-section">
          <div className="Info-header">
            <h2>Discover Your Potential</h2>
          </div>
          <div className="Info-content">
            <img
              src= {require("../Images/EnneagramLogo.png")}
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
        <Chat setAssessmentResult={setAssessmentResult} />
        </div>

<div className="Result-section">
          <h3>Discover your Enneagram type and what it means for you!</h3>
          <button className="Book-appointment-button">Book an Appointment with a Coach</button>
          {
     <ResultTest data={ assessmentResult ?? null} />
    }
        </div>


      </div>

    );
}



export default RadarChart;
