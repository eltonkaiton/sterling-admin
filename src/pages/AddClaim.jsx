import { useState } from 'react';
import axios from 'axios';

const AddClaim = () => {
  const [form, setForm] = useState({
    userName: '',
    userPhone: '',
    claimType: '',
    insured: '',
    amount: '',
    description: '',
    status: 'pending',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // ✅ saved at login

      if (!userId) {
        setError('❌ User not logged in.');
        return;
      }

      await axios.post(
        'https://sterling-project.onrender.com/api/claims',
        { ...form, userId }, // ✅ backend generates reference
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Claim added successfully!');
      setForm({
        userName: '',
        userPhone: '',
        claimType: '',
        insured: '',
        amount: '',
        description: '',
        status: 'pending',
      });
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Error adding claim');
      } else {
        setError('❌ Server error. Try again.');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Add Claim</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="userPhone"
            value={form.userPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Claim Type</label>
          <input
            type="text"
            className="form-control"
            name="claimType"
            value={form.claimType}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Insured</label>
          <input
            type="text"
            className="form-control"
            name="insured"
            value={form.insured}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Claim
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClaim;
