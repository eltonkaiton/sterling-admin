import { useEffect, useState } from 'react';

const SuspendedUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `http://localhost:5000/api/users?status=suspended&search=${search}&page=${page}&limit=5`
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error('Error fetching suspended users:', err);
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const updateStatus = async (id, newStatus) => {
    if (window.confirm(`Change status to "${newStatus}"?`)) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        fetchUsers();
      } catch {
        alert('Error updating status');
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
      } catch {
        alert('Error deleting user');
      }
    }
  };

  return (
    <div className="container">
      <h2>Suspended Users</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
        />
      </div>

      {loading ? <p>Loading users...</p> : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : users.length === 0 ? (
        <p>No suspended users found.</p>
      ) : (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={() => updateStatus(u._id, 'active')}>Activate</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center">
            <button disabled={page <= 1} className="btn btn-outline-primary" onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page >= totalPages} className="btn btn-outline-primary" onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SuspendedUsers;
