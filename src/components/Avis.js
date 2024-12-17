import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Make sure you've imported your Firebase configuration
import { collection, addDoc, getDocs } from "firebase/firestore";
import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons
import { getAuth } from "firebase/auth"; // Import Firebase Auth

const Avis = () => {
  const [rating, setRating] = useState(0); // User's rating
  const [comment, setComment] = useState(""); // User's comment
  const [userName, setUserName] = useState(""); // User's name
  const [reviewsList, setReviewsList] = useState([]); // List of fetched reviews
  const [error, setError] = useState(""); // Error message (if a field is empty)

  // Get the authenticated user
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    // If a user is logged in, get their name
    if (user) {
      setUserName(user.displayName || user.email); // Use displayName or email if displayName is empty
    }
  }, []);

  // Fetch reviews from the database
  useEffect(() => {
    const fetchReviews = async () => {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const reviewsData = querySnapshot.docs.map(doc => doc.data());
      setReviewsList(reviewsData);
    };

    fetchReviews();
  }, []);

  // Add a new review
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if either the rating or the comment is provided
    if (rating === 0 && !comment) {
      setError("Please provide either a rating or a comment.");
      return;
    }

    try {
      // Save the review to Firebase with the user's name
      const newReview = {
        rating,
        comment,
        userName, // Add the user's name
        date: new Date().toLocaleString(),
      };

      await addDoc(collection(db, "reviews"), newReview);
      alert("Review added successfully!");

      // Add the new review to the list without refreshing the page
      setReviewsList(prevReviews => [newReview, ...prevReviews]);

      // Reset the form
      setRating(0);
      setComment("");
      setError(""); // Reset error message
    } catch (error) {
      console.error("Error adding review: ", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle star click
  const handleStarClick = (index) => {
    setRating(index + 1); // Set the rating based on the clicked star
  };

  // Render stars based on the rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{ cursor: "pointer", fontSize: "1.5em", color: index < rating ? "#FFD700" : "#e4e5e9" }}
      >
        {index < rating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  };

  return (
    <div className="container mt-4">
      <h2>Give your review on Connectify</h2>

      {/* Show error if neither rating nor comment is provided */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Form to add a review */}
      <form onSubmit={handleSubmit}>
        {/* Name field is automatically filled with the logged-in user's name */}
        <div className="mb-3">
          <label className="form-label">Stars</label>
          <div className="stars">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleStarClick(index)} // On click, set the rating
                style={{ cursor: "pointer", fontSize: "1.5em", color: index < rating ? "#FFD700" : "#e4e5e9" }}
              >
                {index < rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {/* Display reviews */}
      <h3 className="mt-4">User Reviews:</h3>
      {reviewsList.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviewsList.map((review, index) => (
          <div key={index} className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">
                Stars: {renderStars(review.rating)}
              </h5>
              <p className="card-text">{review.comment}</p>
              <p className="text-muted">Published on {review.date}</p>
              {/* Display the username below the date with smaller font size */}
              <p><small>{review.userName}</small></p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Avis;
