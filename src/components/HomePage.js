import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaDollarSign } from "react-icons/fa";

const HomePage = () => {
  return (
    <div className="class1">
      {/* Main Title */}
      <h1 className="titre1">YOUR MARKETPLACE, YOUR CHOICE</h1>

      {/* Subtitle */}
      <h2 className="titre2">
        Find what you love, Shop smart, and Sell even Smarter
      </h2>

      {/* Decorative Icons */}
      <div>
        <FaShoppingCart className="decorative-icon" />
        <FaHeart className="decorative-icon" />
        <FaDollarSign className="decorative-icon" />
      </div>

      {/* Register Button */}
      <Link to="/SignUp" className="register-btn">
        <i className="fas fa-user-plus"></i> Register Now
      </Link>
    </div>
  );
};

export default HomePage;
