// src/components/UsersTable.jsx
import { useEffect, useState } from 'react';

const UsersTable = ({ status = 'pending' }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const LIMIT = 5;
  const BACKEND_URL = 'https://sterling-project.onrender.com/api/users'; // replace with local IP if needed

  // Fetch users with filters, pagination, search
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${BACKEND_URL}?status=${status}&search=${encodeURIComponent(
          search
        )}&page=${page}&limit=${LIMIT}`
      );

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(`Error fetching ${status} users:`, err);
      setError(`Failed to load ${status} users. Please try again.`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [status, page]);

  const handleSearch = () => {
    setPage(1);
    fetchUsers();
  };

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    try {
      const res = await fetch(`${BACKEND_URL}/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchUsers();
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`${BACKEND_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (err) {
      alert(`Error deleting user: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <h2>{status.charAt(0).toUpperCase() + status.slice(1)} Users</h2>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <p>No {status} users found.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateStatus(u._id, 'active')}
                    >
                      Activate
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateStatus(u._id, 'rejected')}
                    >
                      Reject
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-outline-primary"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersTable;
