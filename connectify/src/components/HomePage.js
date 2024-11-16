import React from "react";
import { Link } from "react-router-dom";


const HomePage = () => {
    return (
        <div class="class1">
        <h1 class="titre1">YOUR MARKETPLACE,
        YOUR CHOICE</h1>
        <h2 class="titre2">Find what you love,
            Shop smart,
            and Sell even Smarter</h2>
        <Link to="/SignUp" className="register-btn">Register</Link>
      </div>
    );
};



export default HomePage;