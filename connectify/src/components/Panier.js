import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importation de useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Panier = () => {
  const [basket, setBasket] = useState([]);
  const navigate = useNavigate(); // Hook pour la navigation

  // Charger le panier depuis le localStorage
  useEffect(() => {
    const storedBasket = JSON.parse(localStorage.getItem("basket")) || [];
    setBasket(storedBasket);
  }, []);

  // Fonction pour supprimer un produit du panier
  const removeFromBasket = (index) => {
    const updatedBasket = basket.filter((_, i) => i !== index);
    setBasket(updatedBasket);
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  // Calcul du total du panier
  const calculateTotal = () => {
    return basket.reduce((total, product) => total + parseFloat(product.price), 0).toFixed(2);
  };

  // Fonction pour naviguer vers la page de paiement
  const handleGoToPayment = () => {
    navigate("/payment"); // Redirige vers la page de paiement
  };

  return (
    <div className="container my-5">
      <h2>Your Basket</h2>
      {basket.length === 0 ? (
        <p>Your basket is empty.</p>
      ) : (
        <div>
          <div className="row">
            {basket.map((product, index) => (
              <div key={index} className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">Price: {product.price} TND</p>
                    <p className="card-text">
                      <strong>Description:</strong> {product.description}
                    </p>
                    {/* Bouton pour supprimer un produit */}
                    <button
                      className="btn btn-danger"
                      onClick={() => removeFromBasket(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Affichage du total du panier */}
          <div className="d-flex justify-content-between mt-4">
            <h4>Total: {calculateTotal()} TND</h4>
            <div>
              {/* Nouveau bouton pour passer à la page de paiement */}
              <button 
                className="btn btn-success" 
                onClick={handleGoToPayment}
              >
                Passer une commande
              </button>
            </div>
            <div>
              <Link to="/UserInterface" className="register-btn">Return</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panier;
