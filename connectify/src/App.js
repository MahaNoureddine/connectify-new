import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbarre from "./components/Navbarre";
import HomePage from "./components/HomePage"; 
import Footer from './components/Footer';
import About from './components/About';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import UserInterface from './components/UserInterface';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbarre />
        
        {/* Consolidated all routes into a single <Routes> component */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Default route */}
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/UserInterface" element={<UserInterface />} />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
