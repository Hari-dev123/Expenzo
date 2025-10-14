import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {


  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errors, seterrors] = useState({})

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/login", {
        email, password
      });
      localStorage.setItem("token", res.data.tokens);
      // Save user ID from backend response
      if (res.data.user && res.data.user._id) {
        localStorage.setItem("_id", res.data.user._id);
      }// must be set after login

      seterrors({});
      navigate("/dashboard")
      alert("User Logged in")
      setEmail("");
      setpassword("");

    }
    catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        const backendMessage = e.response.data.message
        seterrors({ general: backendMessage })
      }
      else {
        seterrors({ general: "Login Failed" })

      }




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
        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={submit}>
          {/* Email */}

          {errors.general && <div className="alert alert-danger">{errors.general}</div>}



          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); seterrors({}); }}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => { setpassword(e.target.value); seterrors({}); }}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="d-flex justify-content-between align-items-center mb-3">

            <a href="/" className="text-decoration-none">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-3 mb-0">
          Don't have an account?{" "}
          <Link to="/signin" className="text-decoration-none">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
