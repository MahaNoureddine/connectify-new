import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";  // Import de useNavigate

const Canal = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();  // Initialisation de useNavigate

  // Récupérer l'email de l'utilisateur connecté
  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);  // Récupère l'email de l'utilisateur connecté
    }
  }, []);

  // Récupérer les messages en temps réel
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesList = querySnapshot.docs.map((doc) => doc.data());
      setMessages(messagesList);
    });

    // Nettoyage lors de la déconnexion
    return () => unsubscribe();
  }, []);

  // Fonction pour envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim() && email) {
      try {
        await addDoc(collection(db, "messages"), {
          email: email, // Email de l'utilisateur
          content: newMessage, // Contenu du message
          timestamp: Timestamp.fromDate(new Date()), // Heure du message
        });

        // Réinitialiser le champ de message après l'envoi
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log("Message is empty or user not authenticated.");
    }
  };

  // Fonction pour retourner au Marketplace
  const handleReturnToMarketplace = () => {
    navigate("/UserInterface");  // Redirige vers le composant UserInterface
  };

  return (
    <div className="container my-5">
      <h2 className="text-center">Discussion Canal</h2>

      <div className="messages-container" style={{ backgroundColor: "#fff", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
        <div className="messages-list" style={{ maxHeight: "400px", overflowY: "auto" }}>
          {/* Affichage des messages */}
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="message" style={{ marginBottom: "10px", padding: "10px", borderBottom: "1px solid #ddd" }}>
                {/* Affichage de l'email à gauche */}
                <div style={{ fontWeight: "bold", marginBottom: "5px", textAlign: "left", color: "blueviolet" }}>
                  {message.email}
                </div>
                {/* Affichage du message */}
                <div style={{ textAlign: "left", marginTop: "5px" }}>{message.content}</div>
                {/* Affichage de l'horodatage */}
                <div style={{ fontSize: "0.8em", color: "#888", textAlign: "right", marginTop: "5px" }}>
                  {new Date(message.timestamp.seconds * 1000).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <p>There are no messages</p>
          )}
        </div>
      </div>

      {/* Formulaire d'envoi de message */}
      <form onSubmit={handleSendMessage} style={{ marginTop: "20px" }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tap your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">Envoyer</button>
        </div>
      </form>

      {/* Bouton pour retourner au Marketplace */}
      <div className="d-flex justify-content-center mt-4">
        <button onClick={handleReturnToMarketplace} className="btn btn-secondary">
          Return to Marketplace
        </button>
      </div>
    </div>
  );
};

export default Canal;
