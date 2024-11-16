import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Make sure this path is correct
import './SignUp.css'; // Ensure you have your CSS in a separate file
import SignUp from './SignUp';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null); // State to store user data

    const navigate = useNavigate(); // Initialisation du hook

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
            const userDoc = await getDoc(doc(db, 'users', user.uid)); // Ensure 'users' matches your collection name
            if (userDoc.exists()) {
                setUserData(userDoc.data()); // Store user data in state
                console.log('User data:', userDoc.data());
                
            } 
            navigate('/UserInterface');
        } catch (err) {
            console.error('Error during sign in:', err);
            setError(err.message);
        }
    };

    return (
        <div className="signup-container"> {/* Keep original class name */}
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
