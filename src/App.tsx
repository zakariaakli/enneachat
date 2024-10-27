import React, { useState } from 'react';
import './App.css';
import { ResultData } from './Models/EnneagramResult';
import GlobalTest from './Components/GlobalTest';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const App: React.FC = () => {
  const [enneagramResult, setEnneagramResult] = useState<ResultData>();

  return (
    <Container fluid>
      <Row>
        <Col>
          <header className="header-custom">
            <h1>Welcome to Enneagram Insights</h1>
            <h4>Your personal journey towards self-discovery and growth starts here!</h4>
          </header>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <GlobalTest />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
