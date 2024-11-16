import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../firebase'; 
import 'bootstrap/dist/css/bootstrap.min.css';


const UserInterface = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/HomePage", { replace: true }); // Replace history to prevent going back
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="title">READY TO SHOP? READY TO BUY?</h1>
        <p className="description">Explore a wide range of products tailored just for you!</p>
      </div>

      {/* Bootstrap Button Group for the Menu */}
      <div className="d-flex justify-content-center">
        <div className="btn-group btn-group-lg" role="group" aria-label="Marketplace Actions">
          <Link to="/Panier" className="btn btn-primary">Your Basket</Link>
          <Link to="/SellProduct" className="btn btn-primary">Sell a Product</Link>
          <Link to="/Profile" className="btn btn-secondary">Your Profile</Link>
          <button onClick={handleSignOut} className="btn btn-danger">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;