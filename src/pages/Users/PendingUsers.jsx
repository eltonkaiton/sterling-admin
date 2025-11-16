import { useEffect, useState } from 'react';

const PendingUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const LIMIT = 5;
  // ✅ Same as ActiveUsers
  const BACKEND_URL = 'http://localhost:5000/api/admin/users';

  // Fetch pending users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${BACKEND_URL}?status=pending&search=${encodeURIComponent(search)}&page=${page}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(Math.ceil((data.total || 0) / LIMIT));
    } catch (err) {
      console.error('Error fetching pending users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const updateStatus = async (id, newStatus) => {
    if (window.confirm(`Change status to "${newStatus}"?`)) {
      try {
        const res = await fetch(`${BACKEND_URL}/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Error updating status');
      }
    }
  };

  return (
    <div className="container mt-3">
      <h2>Pending Users</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <p>No pending users found.</p>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center">
            <button
              disabled={page <= 1}
              className="btn btn-outline-primary"
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              className="btn btn-outline-primary"
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PendingUsers;
