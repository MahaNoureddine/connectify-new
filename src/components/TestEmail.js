import React from "react";
import emailjs from "emailjs-com";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { Link } from "react-router-dom";
import { db } from "../firebase"; // Firebase Firestore import
import { collection, addDoc } from "firebase/firestore"; // Firestore methods

const EmailForm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { basket, total } = state || {};

  if (!basket || !total) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>No items in basket or total amount not found.</h2>
        <button onClick={() => navigate("/Panier")} className="btn btn-primary">
          Go Back to Basket
        </button>
      </div>
    );
  }

  const SendEmail = async (e) => {
    e.preventDefault();
  
    const userEmail = auth.currentUser?.email;
    if (!userEmail) {
      alert("User not logged in. Cannot send email.");
      return;
    }
  
    // Construct the product details message
    const productDetails = basket
      .map(
        (item) =>
          `Category: ${item.category}\nDescription: ${item.description}\nPrice: ${item.price} TND\nQuantity: ${item.quantity}`
      )
      .join("\n\n");
  
    const message = `Thank you for your purchase!\n\nHere are the details of your order:\n\n${productDetails}\n\nTotal Amount: ${total} TND`;
  
    const data = {
      email_from: "noureddinemaha7@gmail.com",
      email_to: userEmail,
      message: message,
    };
  
    try {
      // Send email
      await emailjs.send("service_7tmkmjq", "template_a0rt6wd", data, "3EB7ENA0DlM4VNSYr");
      alert("Check your email");
  
      // Prepare the order data to be saved to Firestore
      const orderData = {
        userEmail,
        products: basket, // Include the basket items
        totalAmount: total, // Include the total amount
        timestamp: new Date(), // Timestamp of when the order was placed
      };
  
      // Add the order to the Firestore 'orders' collection
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order saved to Firestore with ID: ", docRef.id); // Log the document ID for reference
  
      // Optionally, navigate to another page after successful submission
      navigate("/UserInterface");
    } catch (error) {
      console.error("Error sending email or saving order to Firestore:", error);
      alert("Something went wrong. Check console for errors.");
    }
  };
  

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Confirm Your Payment</h1>
      <h2>Thank you for your purchase!</h2>
      <form onSubmit={SendEmail}>
        <button type="submit" className="btn btn-primary">
          Confirm Payment and Send Email
        </button>
        <Link
          to="/UserInterface"
          className="btn btn-outline-primary"
          style={{ textDecoration: "none" }}
        >
          Return
        </Link>
      </form>
    </div>
  );
};

export default EmailForm;
