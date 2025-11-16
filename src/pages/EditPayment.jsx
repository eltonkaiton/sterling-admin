import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    payer: '',
    amount: '',
    date: '',
    method: '',
    status: 'pending',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch existing payment details
  useEffect(() => {
    axios.get(`http://localhost:5000/api/payments/${id}`)
      .then(res => {
        if (res.data && res.data.payment) {
          const { payer, amount, date, method, status } = res.data.payment;
          setForm({
            payer,
            amount,
            date: date ? date.split('T')[0] : '',
            method,
            status,
          });
        } else {
          setError('Payment not found');
        }
      })
      .catch(() => setError('Error loading payment'));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await axios.put(`http://localhost:5000/api/payments/${id}`, form);

      if (res.status === 200) {
        setMessage('Payment updated successfully');
        setTimeout(() => navigate('/payments'), 1000);
      } else {
        setError(res.data?.message || 'Error updating payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Try again.');
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Edit Payment</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Payer</label>
          <input
            type="text"
            className="form-control"
            name="payer"
            value={form.payer}
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
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            name="method"
            value={form.method}
            onChange={handleChange}
          >
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
          </select>
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
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Update Payment</button>
        </div>
      </form>
    </div>
  );
};

export default EditPayment;
