import React, { useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';

const Forget = () => {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      console.log("Sending reset request for:", email);
      
    //   const res = await axios.post("http://localhost:3000/forgot-password", { email });
      
      console.log("SERVER RESPONSE →", res.data);
      
      if (res.data.success || res.status === 200) {
        alert("Password reset link sent to your email! ✅");
        setEmail(""); // Clear input after success
      }
      
    } catch (error) {
      console.log("ERROR:", error);
      
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Failed to send reset link"}`);
      } else if (error.request) {
        alert("Network error. Please check your connection.");
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  }

  return (
    <div className='forget'>
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder='Enter your email' 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">Send Reset Link</button>
        <br />
        <p><Link to="/login">Back to Login</Link></p>
      </form>
    </div>
  );
}

export default Forget;