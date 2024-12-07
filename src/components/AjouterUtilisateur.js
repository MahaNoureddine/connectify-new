import React, { useState } from "react";
import { auth, db } from "../firebase"; // Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore functions

const AjouterUtilisateur = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle errors
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      // Check if the user already exists in Firestore
      const userDocRef = doc(db, "users", email); // Firestore reference based on email
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User already exists
        setError("Le compte avec cet email existe déjà.");
        setSuccessMessage(""); // Clear success message if user already exists
      } else {
        // Create the user in Firebase Authentication
        await createUserWithEmailAndPassword(auth, email, password);

        // Add user data to Firestore
        await setDoc(doc(db, "users", email), {
          email,
          password,
          role: "user", // Default role can be "user", adjust as needed
        });

        setSuccessMessage("Utilisateur ajouté avec succès");
        setError(""); // Clear error if user is successfully added

        // Clear form inputs after submission
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      setError("Erreur lors de l'ajout de l'utilisateur.");
      setSuccessMessage(""); // Clear success message if an error occurs
    }
  };

  return (
    <div className="container">
      <h2>Ajouter un Utilisateur</h2>

      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Ajouter Utilisateur
        </button>
      </form>
    </div>
  );
};

export default AjouterUtilisateur;