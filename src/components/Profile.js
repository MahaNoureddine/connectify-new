import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      setUserData(prevState => ({
        ...prevState,
        email: user.email, // Auto set email to the logged-in user's email
      }));

      // Fetch user profile from Firestore
      const userRef = doc(db, "userProfiles", user.email);
      getDoc(userRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
        }
        setLoading(false);
      });
    } else {
      navigate("/HomePage"); // Redirect if no user is logged in
    }
  }, [auth, db, navigate]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    
    if (user) {
      const userRef = doc(db, "userProfiles", user.email);
      await setDoc(userRef, {
        ...userData, // Save all fields to Firestore
      });

      alert("Profile updated successfully!");
    } else {
      alert("No user is logged in.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            disabled // Disable email field since it is fetched automatically
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;
