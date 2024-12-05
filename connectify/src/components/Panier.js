import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Panier = () => {
  const [basket, setBasket] = useState([]);
  const navigate = useNavigate();

  // Fetch the current user
  const user = auth.currentUser;

  // Load the user's basket from Firestore
  useEffect(() => {
    const fetchBasket = async () => {
      if (user) {
        try {
          const basketRef = doc(db, "users", user.uid, "basket", "userBasket");
          const basketSnapshot = await getDoc(basketRef);
          if (basketSnapshot.exists()) {
            setBasket(basketSnapshot.data().items || []);
          }
        } catch (error) {
          console.error("Error fetching basket:", error);
        }
      }
    };

    fetchBasket();
  }, [user]);

  // Remove a product from the basket
  const removeFromBasket = async (index) => {
    if (user) {
      try {
        const updatedBasket = basket.filter((_, i) => i !== index);
        setBasket(updatedBasket);

        // Update Firestore
        const basketRef = doc(db, "users", user.uid, "basket", "userBasket");
        await updateDoc(basketRef, { items: updatedBasket });
      } catch (error) {
        console.error("Error removing item from basket:", error);
      }
    }
  };

  // Calculate the total price of the basket
  const calculateTotal = () => {
    return basket
      .reduce(
        (total, product) =>
          total + parseFloat(product.price) * parseInt(product.quantity),
        0
      )
      .toFixed(2);
  };

  // Navigate to the payment page
  const handleGoToPayment = () => {
    navigate("/payment");
  };

  return (
    <div
      style={{ width: "90%", maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
      className="my-5"
    >
      <h2 className="text-center mb-4">Your Basket</h2>
      {basket.length === 0 ? (
        <div className="text-center">
          <p>Your basket is empty.</p>
          <Link
            to="/UserInterface"
            className="btn btn-outline-primary"
            style={{ textDecoration: "none" }}
          >
            Return to Shopping
          </Link>
        </div>
      ) : (
        <div>
          <div className="row">
            {basket.map((product, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-lg border-0 rounded-3 p-3">
                  <img
                    src={product.image || "/default-image.jpg"}
                    alt={product.name}
                    className="card-img-top rounded-3 mb-3"
                    style={{ objectFit: "cover", height: "200px" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary">{product.name}</h5>
                    <p className="card-text text-muted">{product.category}</p>
                    <p className="card-text">
                      <strong>Price:</strong> {product.price} TND
                    </p>
                    <p className="card-text">
                      <strong>Description:</strong> {product.description}
                    </p>
                    <p className="card-text">
                      <strong>Quantity:</strong> {product.quantity}
                    </p>

                    {/* Remove button */}
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeFromBasket(index)}
                      title="Remove from basket"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Basket Total and Navigation */}
          <div className="d-flex justify-content-between mt-4">
            <h4>Total: {calculateTotal()} TND</h4>
            <div>
              <button className="btn btn-success" onClick={handleGoToPayment}>
                Proceed to Payment
              </button>
            </div>
            <div>
              <Link
                to="/UserInterface"
                className="btn btn-outline-primary"
                style={{ textDecoration: "none" }}
              >
                Return to Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panier;
