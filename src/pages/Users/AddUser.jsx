import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "client",
    password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ User added successfully!");
        setForm({ name: "", email: "", role: "client", password: "" });
      } else {
        setError(data.message || "❌ Error adding user");
      }
    } catch (err) {
      console.error("Add user error:", err);
      setError("❌ Server error. Try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Add New User</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="client">Client</option>
            <option value="admin">Admin</option>
            <option value="surveyor">Surveyor</option>
            <option value="claim_analyst">Claim Analyst</option>
            <option value="finance">Finance</option>
            <option value="loss_adjuster">Loss Adjuster</option>
            <option value="service_manager">Service Manager</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
