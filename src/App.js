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
import SellProductForm from './components/SellProductForm';
import Panier from './components/Panier';
import Canal from './components/Canal';
import Payment from './components/Payment';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminInterface from './components/AdminInterface';
import AjouterUtilisateur from './components/AjouterUtilisateur';
import SupprimerProduit from './components/SupprimerProduit';
import SupprimerUtilisateur from './components/SupprimerUtilisateur';
import ConsulterCanal from './components/ConsulterCanal';
import TestEmail from "./components/TestEmail";
import Dashboard from './components/Dashboard';
import '@emailjs/browser';
import Avis from './components/Avis';
import AlertModal from './components/AlertModal';
import Profile from './components/Profile';


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
          <Route path="/SellProductForm" element={<SellProductForm />} />
          <Route path="/Panier" element={<Panier />} />
          <Route path="/Canal" element={<Canal />} />
          <Route path="/Payment" element={<Payment />} />
          <Route path="/AdminInterface" element={<AdminInterface />} />
          <Route path="/AjouterUtilisateur" element={<AjouterUtilisateur />} />
          <Route path="/SupprimerProduit" element={<SupprimerProduit />} />
          <Route path="/SupprimerUtilisateur" element={<SupprimerUtilisateur />} />
          <Route path="/ConsulterCanal" element={<ConsulterCanal />} />
          <Route path="/TestEmail" element={<TestEmail />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/Avis" element={<Avis />} />
          <Route path="/AlertModal" element={<AlertModal />} />
          <Route path="/Profile" element={<Profile />} />









        </Routes>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
