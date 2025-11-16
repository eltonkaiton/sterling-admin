// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = "http://localhost:5000/api/auth"; // change if hosted

// Simple web footer component
const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>
        2025 © <span style={companyNameStyle}>Forge Reactor</span> | Forging Digital Innovation
      </p>
    </footer>
  );
};

// Footer styles
const footerStyle = {
  backgroundColor: "#1A1F2E",
  padding: "12px 0",
  textAlign: "center",
  borderTop: "2px solid #FF6B35",
  position: "absolute",
  bottom: 0,
  width: "100%",
};

const textStyle = {
  color: "#E2E8F0",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  margin: 0,
};

const companyNameStyle = {
  color: "#FF6B35",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "", acceptedTerms: false });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role === "admin") {
      navigate("/"); // Admin Dashboard
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.acceptedTerms) {
      return setError("You must accept the Terms and Conditions.");
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, {
        email: form.email,
        password: form.password,
        source: "web",
      });

      const { user, token } = res.data;

      if (!user || !token) return setError("Invalid response from server");

      if (user.status !== "active") return setError(`Account is ${user.status}. Access denied.`);
      if (user.role !== "admin") return setError("Access denied: Admins only");

      // Save session
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      navigate("/"); // Admin Dashboard
    } catch (err) {
      if (err.response) setError(err.response.data.message || "Login failed");
      else setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 0,
        }}
      ></div>

      <div
        className="card shadow p-4"
        style={{
          maxWidth: 400,
          width: "100%",
          borderRadius: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <h3 className="mb-3 text-center">Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="terms"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="terms">
              I accept the Terms and Conditions
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
