import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import SellProductForm from "./SellProductForm";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

const UserInterface = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [produits, setProduits] = useState([]);
  const [categorie, setCategorie] = useState("");
  const [basket, setBasket] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const [addedMessage, setAddedMessage] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});
  
  const user = auth.currentUser;

  // Fetch user's basket from Firestore
  

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "produit"));
        const produitsList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProduits(produitsList);
  
        const initialQuantities = produitsList.reduce((acc, product) => {
          acc[product.id] = { quantity: 1, maxQuantity: product.quantity };
          return acc;
        }, {});
        setProductQuantities(initialQuantities);
  
        if (auth.currentUser) {
          fetchBasket();
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProduits();
  }, [basket]);
  
  const fetchBasket = async () => {
    if (auth.currentUser) {
      const basketRef = doc(db, "users", auth.currentUser.uid, "basket", "userBasket");
      try {
        const basketSnapshot = await getDoc(basketRef);
        if (basketSnapshot.exists()) {
          setBasket(basketSnapshot.data().items || []);
        }
      } catch (error) {
        console.error("Error fetching basket:", error);
      }
    }
  };
  

  const addToBasket = async (product) => {
    const productWithQuantity = {
      ...product,
      quantity: productQuantities[product.id].quantity,
    };
    const updatedBasket = [...basket, productWithQuantity];
  
    // Update Firestore with the new basket
    if (user) {
      const basketRef = doc(db, "users", user.uid, "basket", "userBasket");
      await setDoc(basketRef, { items: updatedBasket });
      setBasket(updatedBasket);
    }
  
    // Also update localStorage with the updated basket
    localStorage.setItem("basket", JSON.stringify(updatedBasket));
  
    // Update added message
    if (productQuantities[product.id].quantity === product.quantity) {
      setAddedMessage((prevState) => ({
        ...prevState,
        [product.id]: "All quantity added to basket.",
      }));
      // Disable the button after adding all the quantity
      setDisabledButtons((prevState) => ({
        ...prevState,
        [product.id]: true,
      }));
    } else {
      setAddedMessage((prevState) => ({
        ...prevState,
        [product.id]: `${productQuantities[product.id].quantity} items added to basket.`,
      }));
    }
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setBasket([]); // Clear the basket
        setDisabledButtons({}); // Reset disabled buttons
        navigate("/HomePage", { replace: true });
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };
  

  const handleCategorySelect = (category) => {
    setCategorie(category);
    setShowCategories(false);
  };

  const filteredProduits =
    categorie && categorie !== "All"
      ? produits.filter((produit) => produit.category === categorie)
      : produits;

  const handleQuantityChange = (id, change) => {
    setProductQuantities((prev) => {
      const currentQuantity = prev[id]?.quantity || 1;
      const productMaxQuantity = produits.find((prod) => prod.id === id)?.quantity || 1;
      const newQuantity = currentQuantity + change;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          quantity: Math.max(1, Math.min(newQuantity, productMaxQuantity)),
        },
      };
    });
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="title fw-bold text-primary">READY TO SHOP? READY TO BUY?</h1>
        <p className="description text-secondary">
          Explore a wide range of products tailored just for you!
        </p>
      </div>

      {/* Top Button for Chat Channel */}
      <div className="floating-buttons">
        <Link
          to="/Canal"
          className="btn btn-warning btn-circle shadow-sm message-btn"
          title="Go to Discussion Channel"
        >
          <i className="bi bi-chat-dots"></i>
        </Link>

        {/* Sell a Product Button */}
        <button
          className="btn btn-primary btn-circle shadow-sm add-btn"
          onClick={() => setShowModal(true)}
          title="Sell a Product"
        >
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>

      {/* Category Dropdown */}
      <div className="dropdown mb-4 position-relative">
        <button
          className="btn btn-outline-secondary dropdown-toggle w-auto p-2 text-sm"
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          aria-expanded={showCategories}
          style={{
            fontSize: "14px",
            borderRadius: "25px",
            padding: "8px 16px",
            boxShadow: "none",
          }}
        >
          {categorie ? categorie : "Select Category"}
        </button>
        <ul
          className={`dropdown-menu ${showCategories ? "show" : ""}`}
          style={{ width: "100%", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
        >
          {[
            "All",
            "Electronic",
            "Clothing and Apparel",
            "Home and Garden",
            "Beauty and Health",
            "Toys and Leisure",
            "Sports and Outdoors",
            "Books and Media",
            "Food and Beverages",
            "Cars and Accessories",
            "Others",
          ].map((category) => (
            <li
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`dropdown-item ${categorie === category ? "active" : ""}`}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal for Selling a Product */}
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

       {/* Products Display */}
       {/* Products Display */}
<div className="products-container mt-5">
  <h2 className="text-primary">Products for Sale:</h2>
  <div className="row">
    {filteredProduits.length === 0 ? (
      <p className="text-muted">No products available for this category.</p>
    ) : (
      filteredProduits.map((produit, index) => (
        <div className="col-md-4 mb-4" key={index}>
          <div className="card shadow-lg border-0 rounded-3 p-3">
            <img
              src={produit.image || "/default-image.jpg"}
              alt={produit.name}
              className="card-img-top rounded-3 mb-3"
              style={{ objectFit: "cover", height: "200px" }}
            />
            <div className="card-body">
              <h5 className="card-title text-primary">{produit.name}</h5>
              <p className="card-text text-muted">{produit.category}</p>
              <p className="card-text">Price: {produit.price} TND</p>
              <p className="card-text">Status: {produit.status}</p>
              <p className="card-text">
                <strong>Description:</strong> {produit.description}
              </p>

              <div className="quantity-control">
                <h4>Quantity: </h4>
                <div className="input-group mb-3">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(produit.id, -1)}
                    disabled={productQuantities[produit.id]?.quantity <= 1}
                  >
                    <i className="bi bi-dash"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={productQuantities[produit.id]?.quantity}
                    readOnly
                    min="1"
                    max={produit.quantity}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => handleQuantityChange(produit.id, 1)}
                    disabled={productQuantities[produit.id]?.quantity >= produit.quantity}
                  >
                    <i className="bi bi-plus"></i>
                  </button>
                </div>
                <p className="text-muted">Max quantity available: {produit.quantity}</p>
              </div>

              {addedMessage[produit.id] && (
                <p className="text-success">{addedMessage[produit.id]}</p>
              )}

              <button
                className="btn btn-primary w-100 mt-3"
                onClick={() => addToBasket(produit)}
                disabled={disabledButtons[produit.id]}
              >
                {disabledButtons[produit.id]
                  ? "Product Added"
                  : "Add to Basket"}
              </button>
            </div>
          </div>
        </div>
      ))
    )}
  </div>


        {/* Sign Out Button */}
        {user && (
          <div className="d-flex justify-content-center mt-5">
            <button
              className="btn btn-danger"
              onClick={handleSignOut}
              style={{ borderRadius: "25px", padding: "8px 20px" }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInterface;