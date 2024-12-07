import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot, deleteDoc, doc, orderBy } from "firebase/firestore";
import { auth } from "../firebase"; // For checking if the admin is logged in

const ConsulterCanal = () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");

  // Fetching the admin's email
  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
    }
  }, []);

  // Fetch messages from Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesList);
    });

    return () => unsubscribe();
  }, []);

  // Delete a message
  const handleDeleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Refresh page when clicking the return button
  const handleReturn = () => {
    window.location.reload();  // Reloads the page
  };

  return (
    <div className="container my-4">
      <h3 className="text-center" style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Admin - Consulter Canal</h3>
      
      <div className="messages-container" style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div className="messages-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="message" style={{ marginBottom: "15px", padding: "12px", borderBottom: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                {/* Display sender's email */}
                <div style={{ fontWeight: "bold", marginBottom: "8px", color: "blueviolet", fontSize: "1rem" }}>
                  {message.email}
                </div>
                {/* Display message content */}
                <div style={{ marginBottom: "8px", color: "#333", fontSize: "1rem" }}>
                  {message.content}
                </div>
                {/* Display timestamp */}
                <div style={{ fontSize: "0.85em", color: "#888", textAlign: "right", marginTop: "5px" }}>
                  {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                </div>
                {/* Admin's delete button */}
                <div className="text-right mt-2">
                  <button className="btn btn-sm btn-danger" style={{ padding: "6px 12px", fontSize: "0.85rem" }} onClick={() => handleDeleteMessage(message.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No messages available</p>
          )}
        </div>
      </div>

      {/* Return button */}
      <div className="text-center mt-4">
        <button 
          className="btn btn-primary"
          onClick={handleReturn} 
          style={{ padding: "8px 16px", fontSize: "1rem", backgroundColor: "steelblue", border: "none", borderRadius: "5px" }}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default ConsulterCanal;
