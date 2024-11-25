import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import SellProductForm from "./SellProductForm";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const UserInterface = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState(""); // State to track selected category
  const [basket, setBasket] = useState([]); // Local basket state

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "produit"));
        const produitsList = querySnapshot.docs.map((doc) => doc.data());
        setProduits(produitsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduits();
  }, []);

  // Function to add product to basket
  const addToBasket = (product) => {
    const updatedBasket = [...basket, product];
    setBasket(updatedBasket);

    // Save to localStorage
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/HomePage", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setCategorie(category);
  };

  // Filter products based on selected category
  const filteredProduits =
    categorie && categorie !== "All"
      ? produits.filter((produit) => produit.category === categorie)
      : produits;

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="title fw-bold text-primary">READY TO SHOP? READY TO BUY?</h1>
        <p className="description text-secondary">
          Explore a wide range of products tailored just for you!
        </p>
      </div>

      {/* Top Button for Chat Channel */}
      <div className="d-flex justify-content-center mb-4">
        <Link to="/Canal" className="btn btn-warning btn-lg shadow-sm">
          Go to Discussion Channel
        </Link>
      </div>

      <div className="row">
        {/* Sidebar Categories */}
        <div className="col-md-3">
          <div
            className="categories-sidebar shadow-sm p-3 bg-light rounded"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <h5 className="text-primary">Categories</h5>
            <ul className="list-unstyled">
              {[
                "All", // Add the "All" option
                "Électronique",
                "Mode et vêtements",
                "Maison et jardin",
                "Beauté et santé",
                "Jouets et loisirs",
                "Sport et plein air",
                "Livres et médias",
                "Nourriture et boissons",
                "Voitures et accessoires",
                "Autres",
              ].map((category) => (
                <li
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`p-2 rounded mb-2 ${
                    categorie === category ? "bg-primary text-white" : "text-dark"
                  }`}
                  style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="d-flex justify-content-center mb-4">
            <button
              className="btn btn-primary btn-lg shadow-sm"
              onClick={() => setShowModal(true)}
            >
              Sell a Product
            </button>
          </div>

          {showModal && (
            <div
              className="modal show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Sell a Product</h5>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <SellProductForm closeModal={() => setShowModal(false)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="products-container mt-5">
            <h2 className="text-primary">Products for Sale:</h2>
            <div className="row">
              {filteredProduits.length === 0 ? (
                <p className="text-muted">No products available for this category.</p>
              ) : (
                filteredProduits.map((produit, index) => (
                  <div className="col-md-4 mb-4" key={index}>
                    <div className="card shadow-sm border-0">
                      <div className="card-body">
                        <h5 className="card-title text-primary">{produit.category}</h5>
                        <p className="card-text">Price: {produit.price} TND</p>
                        <p className="card-text">Status: {produit.status}</p>
                        <p className="card-text">
                          <strong>Description:</strong> {produit.description}
                        </p>
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => addToBasket(produit)}
                        >
                          Add to Basket
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInterface;
