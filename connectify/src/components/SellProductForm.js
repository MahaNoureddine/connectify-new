import React, { useState } from "react";
import { db, storage } from "../firebase"; // Firebase Firestore and Storage
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const SellProductForm = ({ closeModal }) => {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null); // State for image file
  const [submittedProduct, setSubmittedProduct] = useState(null);

  // Handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!category || !description || !price || !status || quantity <= 0 || !image) {
      alert("Please fill in all fields, ensure quantity is greater than 0, and upload an image.");
      return;
    }

    // Price validation
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `product-images/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Wait for the upload to complete
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading image:", error);
          alert("An error occurred while uploading the image. Please try again.");
        },
        async () => {
          // Get the image URL after upload completes
          const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Image uploaded successfully:", imageURL);

          // Product data to save (including image URL and quantity)
          const productData = {
            category,
            description,
            price: parseFloat(price).toFixed(2),
            status,
            quantity: parseInt(quantity, 10),
            image: imageURL, // Add the image URL to the product data
          };

          // Save product to Firestore
          const docRef = await addDoc(collection(db, "produit"), productData);
          console.log("Product added to Firestore with ID:", docRef.id);

          alert("Product added successfully!");

          // Set the submitted product data to display below the form
          setSubmittedProduct(productData);

          // Reset the form fields
          setCategory('');
          setDescription('');
          setPrice('');
          setStatus('');
          setQuantity(1);
          setImage(null); // Reset the image

          // Close modal after submission
          closeModal();
        }
      );
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Product Category</label>
          <select
            id="category"
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
          <label htmlFor="description" className="form-label">Product Description</label>
          <textarea
            id="description"
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price (TND)</label>
          <input
            id="price"
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <input
            id="status"
            type="text"
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            id="quantity"
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Product Image</label>
          <input
            id="image"
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
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
          <p><strong>Quantity:</strong> {submittedProduct.quantity}</p>
          <img
            src={submittedProduct.image}
            alt="Product"
            style={{ width: "200px", marginTop: "10px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
};

export default SellProductForm;
