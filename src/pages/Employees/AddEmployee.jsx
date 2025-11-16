import { useState } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    password: '',
    salary: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/employees/add',
        form,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setMessage('Employee added successfully!');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        password: '',
        salary: '',
      });
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        setMessage(err.response.data.message || 'Error adding employee');
      } else {
        // Network or other error
        setMessage('Server error.');
      }
    }
  };

  return (
    <div className="container">
      <h2 className="mb-3">Add New Employee</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={form.fullName}
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
          <label className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Position</label>
          <input
            type="text"
            className="form-control"
            name="position"
            value={form.position}
            onChange={handleChange}
          />
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

        <div className="col-md-6">
          <label className="form-label">Salary</label>
          <input
            type="number"
            className="form-control"
            name="salary"
            value={form.salary}
            onChange={handleChange}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
