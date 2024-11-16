import React from "react";
import logo from '../logo.svg';  
import { Link } from "react-router-dom";
import About from "./About";

const Navbarre = () => {
    return (
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
};

export default Navbarre;
