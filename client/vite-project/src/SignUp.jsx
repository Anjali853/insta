import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  
  const [input, setInput] = useState({
    name: "",
    email: "",
    passWord: ""
  });

  function signUpFun(e) {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  }

  async function handleSignUp(e) {
    e.preventDefault();
    
    try {
      console.log("DATA GOING TO BACKEND:", input);

      const res = await axios.post("https://insta-1-v1mq.onrender.com/signUp", input);

      console.log("SERVER RESPONSE →", res.data);

      // SUCCESS — check success:true
      if (res.data.success) {
        alert(res.data.msg || "Signup successful!");

        // Reset form
        setInput({
          name: "",
          email: "",
          passWord: ""
        });

        // Redirect to Login page
        window.location.href = "/";
      }

    } catch (error) {
      console.log("ERROR:", error);

      if (error.response) {
        alert(error.response.data.msg || "Unable to create account");
      } else if (error.request) {
        alert("Network error. Check your connection.");
      } else {
        alert("An error occurred. Try again.");
      }
    }
  }

  return (
    <div className='signUp'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        
        <input 
          onChange={signUpFun}
          type="text" 
          placeholder='Enter User Name'
          name='name'
          value={input.name}
          required
        />
        <br />

        <input 
          onChange={signUpFun}
          type="email" 
          placeholder='Enter Email'
          name='email'
          value={input.email}
          required
        />
        <br />

        <input 
          onChange={signUpFun}
          type="password" 
          placeholder='Enter Password'
          name='passWord'
          value={input.passWord}
          required
        />
        <br /><br />

        <button type="submit">Sign Up</button>

        <p>Already have an account? <Link to='/'>Login</Link></p>

      </form>
    </div>
  );
}

export default SignUp;
