import React, { useState, useEffect } from "react";
import logo from '../logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons"; // Import basket icon
import AlertModal from "../components/AlertModal";


const Navbarre = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set logged-in state based on user
    });
    return () => unsubscribe();
  }, []);

  /*const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert("You have successfully signed out.");
      navigate("/HomePage");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };*/

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      setAlertMessage("You have successfully signed out.");
      setAlertType("success");
      setShowModal(true);

      setTimeout(() => {
        navigate("/HomePage");
        setShowModal(false); // Close the modal after redirect
      }, 1000); // 2-second delay

    } catch (error) {
      console.error("Error signing out:", error);
      setAlertMessage("Failed to sign out. Please try again.");
      setAlertType("error");
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderUnauthenticatedNavbar = () => (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-buttons">
        <Link to="/HomePage" className="navbar-btn">Home</Link>
        <Link to="/About" className="navbar-btn">About</Link>
        <div className="auth-buttons">
          <Link to="/SignUp" className="navbar-btn">Sign Up</Link>
          <span>|</span>
          <Link to="/SignIn" className="navbar-btn">Sign In</Link>
        </div>
      </div>
    </nav>
  );

  const renderAuthenticatedNavbar = () => (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="navbar-buttons">
        <Link to="/About" className="navbar-btn">About</Link>
        <Link to="/Profile" className="navbar-btn">Profile</Link>
        <Link to="/Panier" className="navbar-btn">
          <FontAwesomeIcon icon={faShoppingBasket} /> {/* Basket icon */}
        </Link>
        <Link to="/Avis" className="navbar-btn">Reviews</Link>
        
    
      <button onClick={handleSignOut} className="btn btn-danger">Sign Out</button>
      {showModal && (
        <AlertModal
          message={alertMessage}
          type={alertType}
          onClose={handleCloseModal}
        />
      )}
    
  );
      </div>
    </nav>
  );

  return isLoggedIn ? renderAuthenticatedNavbar() : renderUnauthenticatedNavbar();
};

export default Navbarre;
