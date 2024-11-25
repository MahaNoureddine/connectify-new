import React, { useState } from "react";
import { db } from "../firebase"; // Firebase Firestore
import { collection, addDoc } from "firebase/firestore";

const SellProductForm = ({ closeModal }) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [submittedProduct, setSubmittedProduct] = useState(null); // State to store submitted product info

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!category || !description || !price || !status) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Product data to save (no image)
      const productData = {
        category,
        description,
        price: parseFloat(price),
        status,
      };

      // Save product to Firestore
      await addDoc(collection(db, "produit"), productData);
      alert("Product added successfully!");

      // Set the submitted product data to display below the form
      setSubmittedProduct(productData);

      // Close modal after submission
      closeModal();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving the product.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Product Category</label>
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="Électronique">Électronique</option>
          <option value="Mode et vêtements">Mode et vêtements</option>
          <option value="Maison et jardin">Maison et jardin</option>
          <option value="Beauté et santé">Beauté et santé</option>
          <option value="Jouets et loisirs">Jouets et loisirs</option>
          <option value="Sport et plein air">Sport et plein air</option>
          <option value="Livres et médias">Livres et médias</option>
          <option value="Nourriture et boissons">Nourriture et boissons</option>
          <option value="Voitures et accessoires">Voitures et accessoires</option>
          <option value="Autres">Autres</option>
        </select>
      </div>
        <div className="mb-3">
          <label className="form-label">Product Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price (TND)</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      {/* Display the submitted product below the form */}
      {submittedProduct && (
        <div className="mt-4">
          <h3>Product Submitted:</h3>
          <p><strong>Category:</strong> {submittedProduct.category}</p>
          <p><strong>Description:</strong> {submittedProduct.description}</p>
          <p><strong>Price:</strong> {submittedProduct.price} TND</p>
          <p><strong>Status:</strong> {submittedProduct.status}</p>
        </div>
      )}
    </div>
  );
};

export default SellProductForm;