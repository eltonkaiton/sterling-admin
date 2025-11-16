import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditClaim = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    reference: '',
    insured: '',
    date: '',
    amount: '',
    status: 'pending',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ✅ Fetch claim data by ID
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const res = await axios.get(`https://sterling-project.onrender.com/api/claims/${id}`);
        if (res.data && res.data._id) {
          setForm({
            reference: res.data.reference || '',
            insured: res.data.insured || '',
            date: res.data.date ? res.data.date.slice(0, 10) : '',
            amount: res.data.amount || '',
            status: res.data.status || 'pending',
          });
        } else {
          setError('Claim not found');
        }
      } catch (err) {
        setError('Error loading claim');
      }
    };
    fetchClaim();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.patch(
        `https://sterling-project.onrender.com/api/claims/${id}`,
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.status === 200) {
        setMessage('✅ Claim updated successfully!');
        setTimeout(() => navigate('/claims'), 1500);
      } else {
        setError(res.data.message || 'Error updating claim');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || '❌ Server error. Try again.'
      );
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Edit Claim</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Reference</label>
          <input
            type="text"
            className="form-control"
            name="reference"
            value={form.reference}
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
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
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
            <option value="settled">Settled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Update Claim
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClaim;
