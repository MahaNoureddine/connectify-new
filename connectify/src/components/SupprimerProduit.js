import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Firebase Firestore
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

const SupprimerProduit = () => {
  const [produits, setProduits] = useState([]);

  // Fetch all products from Firestore
  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "produit"));
        const produitsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProduits(produitsList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProduits();
  }, []);

  // Delete product from Firestore
  const handleDeleteProduct = async (id) => {
    try {
      const productRef = doc(db, "produit", id);
      await deleteDoc(productRef);
      setProduits((prevProducts) => prevProducts.filter((product) => product.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product.");
    }
  };

  // Refresh the page
  const handleRefresh = () => {
    window.location.reload(); // Reloads the page
  };

  return (
    <div className="container my-3">
      <h5 className="text-center mb-3" style={{ fontSize: "1.2rem" }}>Delete Product</h5>
      <div className="row justify-content-center">
        {produits.length === 0 ? (
          <p className="text-center" style={{ fontSize: "0.9rem" }}>No products available to delete.</p>
        ) : (
          produits.map((produit) => (
            <div className="col-12 col-md-4" key={produit.id}>
              <div className="card mb-2" style={{ borderRadius: "6px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: "10px" }}>
                <div className="card-body" style={{ padding: "10px" }}>
                  <h6 className="card-title text-center" style={{ fontSize: "1rem", marginBottom: "8px" }}>{produit.category}</h6>
                  <p className="card-text" style={{ fontSize: "0.9rem", marginBottom: "4px" }}>Price: {produit.price} TND</p>
                  <p className="card-text" style={{ fontSize: "0.9rem", marginBottom: "4px" }}>Status: {produit.status}</p>
                  <p className="card-text" style={{ fontSize: "0.9rem", marginBottom: "10px" }}>
                    <strong>Description:</strong> {produit.description}
                  </p>
                  <div className="text-center">
                    <button
                      className="btn btn-sm btn-danger"
                      style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                      onClick={() => handleDeleteProduct(produit.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-3 text-center">
        {/* Refresh button */}
        <button 
          className="btn btn-sm btn-secondary" 
          style={{ fontSize: "0.85rem", padding: "6px 12px" }}
          onClick={handleRefresh}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default SupprimerProduit;
