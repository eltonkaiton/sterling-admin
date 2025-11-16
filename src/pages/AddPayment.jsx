import { useState } from 'react';
import axios from 'axios';

const AddPayment = () => {
  const [form, setForm] = useState({
    reference: '',
    claimant: '',
    amount: '',
    method: 'bank',
    date: '',
    status: 'pending',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/payments', form, {
        headers: { 'Content-Type': 'application/json' },
      });

      setMessage('✅ Payment recorded successfully!');
      setForm({
        reference: '',
        claimant: '',
        amount: '',
        method: 'bank',
        date: '',
        status: 'pending',
      });

      // auto-clear message
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || '❌ Error submitting payment. Try again.';
      setError(errorMsg);

      // auto-clear error
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Add Payment</h2>

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
          <label className="form-label">Claimant</label>
          <input
            type="text"
            className="form-control"
            name="claimant"
            value={form.claimant}
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
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            name="method"
            value={form.method}
            onChange={handleChange}
          >
            <option value="bank">Bank</option>
            <option value="cheque">Cheque</option>
            <option value="mpesa">Mpesa</option>
          </select>
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
          <label className="form-label">Status</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPayment;
