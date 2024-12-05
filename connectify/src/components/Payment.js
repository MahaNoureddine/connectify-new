import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // React Router for navigation

const Payment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Using useNavigate hook for navigation
  const navigate = useNavigate();

  // Fonction pour valider la date d'expiration
  const validateExpirationDate = () => {
    const currentDate = new Date();
    const expiration = new Date(expirationDate);

    if (expiration < currentDate) {
      setErrorMessage("Expiration date cannot be in the past.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Fonction pour gérer le paiement
  const handlePayment = (e) => {
    e.preventDefault();

    if (!validateExpirationDate()) return;

    // Navigate to TestEmail.js after form submission
    navigate("/testemail"); // Adjust the route to match your React Router setup
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Payment Information</h2>
          <form onSubmit={handlePayment} className="p-4 border rounded shadow-sm">
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                className="form-control"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
                maxLength="19"
                placeholder="Enter card number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
              <input
                type="month"
                id="expirationDate"
                className="form-control"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cardHolder" className="form-label">Card Holder Name</label>
              <input
                type="text"
                id="cardHolder"
                className="form-control"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
                placeholder="Enter cardholder name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="cvv" className="form-label">CVV (3 digits)</label>
              <input
                type="text"
                id="cvv"
                className="form-control"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                required
                maxLength="3"
                pattern="\d{3}"
                title="3 digits CVV"
                placeholder="CVV"
              />
            </div>

            {/* Affichage du message d'erreur si la date d'expiration est invalide */}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <div className="d-flex justify-content-between mt-4">
              <button type="submit" className="btn btn-success">Pay</button>
              <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
