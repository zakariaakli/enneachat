import React, { useState } from "react";
import Chat from "./Chat";
import ResultTest from "./ResultTest";
import { ResultData } from "../Models/EnneagramResult";
import "../App.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const GlobalTest: React.FC = () => {
  const [assessmentResult, setAssessmentResult] = useState<ResultData | null>();

  return (
    <Container fluid className="mt-2">
      <Row className="mb-2">
        <Col xs={12} md={3} className="Info-section text-center">
          <img
            src={require("../Images/EnneagramLogo.png")}
            alt="Enneagram Logo"
            className="Enneagram-logo"
          />
          <h2 className="title-green">Discover Your Potential</h2>
          <p>Understanding your Enneagram type can provide insights into your personality, motivations, and relationships.</p>
          <p>Taking the Enneagram test can help you identify your strengths and areas for growth, leading to a more fulfilling life.</p>
        </Col>
        <Col xs={12} md={6} className="Chat-section">
          <Chat setAssessmentResult={setAssessmentResult} />
        </Col>
        <Col xs={12} md={3} className="Result-section text-center">
          <h3 className="title-green">Discover your Enneagram type and what it means for you!</h3>
          <button className="Book-appointment-button mt-3">Book an Appointment with a Coach</button>
          <ResultTest data={assessmentResult ?? null} />
        </Col>
      </Row>
    </Container>
  );
};

export default GlobalTest;
