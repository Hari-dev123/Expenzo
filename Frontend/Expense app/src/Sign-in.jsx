import React, { useState } from "react";
import axios from "axios";
import { Link ,useNavigate} from "react-router-dom";

const SignUp = () => {
  
const navigate=useNavigate();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("")
    const[password,setPassword]=useState("")
    const[errors,setError]=useState({})

   const Validation=()=>{

    let newError={}
    if(!name.trim()) 
      {newError.name="Name is required"}
    else if(! /^[A-Za-z\s]+$/.test(name)){
      newError.name="Name can only contains letters"}

    if(!email.trim()){

     newError.email="Email is required"}

    else if( !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)){
      newError.email="Email must be in valid Gmail format"}
   

   if(!password.trim()) {newError.password="Password is required"}
    else if( !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)){
      newError.password="Password must be 8 chars with uppercase, lowercase, number & symbol"}
   
    setError(newError)
    return Object.keys(newError).length===0

    }

    const submit=async(e)=>{
        e.preventDefault();
    if(!Validation())return;

        try{
          const  res=await axios.post("http://localhost:3000/api/register",{
            name,email,password
        })
        alert(res.data.message)
        navigate("/dashboard")
        setName("");
      setEmail("");
      setPassword("");
      setError({});}
        catch(err){
            // Backend validation errors
            if(err.response&&err.response.data&&err.response.data.message){
              const backendMessage=err.response.data.message

              if(backendMessage.toLowerCase().includes("email already exists")){
                  setError({general:backendMessage})
              }
              else{
                setError({general:"Registration Failed Failed.please Try again Later"})
              }
              
              
            }
            else {
    setError({ general: "Something went wrong. Please try again." });
  }
  
     
        console.error(err.message);
      
        }

      
    }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "15px",
        }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>

        <form onSubmit={submit}>
          {errors.general && (
            <div className="alert alert-danger">{errors.general}</div>
          )}
          {/* Name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
             className={`form-control ${errors.name ? "is-invalid" : ""}`}
              id="name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
              id="email"
               value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
             {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              id="password"
               value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
             {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/" className="text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
