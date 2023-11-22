// import React from 'react'
import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import axios from "axios";

function Signin() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await axios.post("/api/auth/signin", formData);
      console.log("SignUp Successfully", res.data);
      setLoading(false);
      navigate("/");
      
    } catch (err) {
      console.log("Signup failed", err.message);
      setLoading(false);
      setError(true);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={SubmitHandler}>
       
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <button disabled={loading}  className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-blue-500">Sign Up</span>
        </Link>
      </div>
      <p className="text-red-700 mt-5">{error && 'Something went Wrong!'}</p>
    </div>
  );
}

export default Signin;
