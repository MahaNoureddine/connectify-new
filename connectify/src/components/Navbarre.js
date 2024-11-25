import React, { useState, useEffect } from "react";
import logo from '../logo.svg';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons"; // Import basket icon

const Navbarre = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set logged-in state based on user
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert("You have successfully signed out.");
      navigate("/HomePage");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
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
        <div className="auth-buttons">
          <button onClick={handleSignOut} className="navbar-btn btn btn-link text-decoration-none">Sign Out</button>
        </div>
      </div>
    </nav>
  );

  return isLoggedIn ? renderAuthenticatedNavbar() : renderUnauthenticatedNavbar();
};

export default Navbarre;
