
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Firebase setup
import './SignUp.css'; // CSS for styling
import { useNavigate } from 'react-router-dom'; // For navigation

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null); // To store user data
    const navigate = useNavigate(); // Use the navigation hook

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, password } = formData;

        try {
            // Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
                setUserData(userDoc.data()); // Store user data in state
            }

            // Redirect based on email (admin or regular user)
            if (email === 'admin@admin.com') {
                navigate('/AdminInterface'); // Admin page
            } else {
                navigate('/UserInterface'); // Normal user page
            }

        } catch (err) {
            console.error('Error during sign in:', err);
            setError(err.message); // Show error if login fails
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign In</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="signup-btn">Sign In</button>
            </form>
            {userData && (
                <div className="user-data">
                    <h3>User Data:</h3>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                </div>
            )}
        </div>
    );
};

export default SignIn;