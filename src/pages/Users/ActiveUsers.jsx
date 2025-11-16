import { useEffect, useState } from 'react';

const ActiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // For editing user
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('');

  const LIMIT = 5;
  const BACKEND_URL = 'http://localhost:5000/api/users'; // ✅ Updated

  // Fetch active users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `${BACKEND_URL}?status=active&search=${encodeURIComponent(search)}&page=${page}&limit=${LIMIT}`
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(Math.ceil((data.total || 0) / LIMIT));
    } catch (err) {
      console.error('Error fetching active users:', err);
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

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`${BACKEND_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete user');
        fetchUsers();
      } catch (err) {
        alert(err.message || 'Error deleting user');
      }
    }
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
  };

  const saveEdit = async () => {
    if (!editName || !editEmail || !editRole) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail, role: editRole }),
      });

      // ✅ Safe JSON parsing
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }

      if (!res.ok) throw new Error(data.message || 'Failed to update user');

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      alert(err.message || 'Error updating user');
    }
  };

  const cancelEdit = () => setEditingUser(null);

  return (
    <div className="container mt-3">
      <h2>Active Users</h2>
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
        <p>No active users found.</p>
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
                    <button className="btn btn-primary btn-sm me-2" onClick={() => startEdit(u)}>Edit</button>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => updateStatus(u._id, 'suspended')}>Suspend</button>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>Edit User</h5>
              <div className="mb-2">
                <input className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
              </div>
              <div className="mb-2">
                <input className="form-control" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email" />
              </div>
              <div className="mb-2">
                <select className="form-control" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                  <option value="claim_analyst">Claim Analyst</option>
                  <option value="loss_adjuster">Loss Adjuster</option>
                  <option value="finance">Finance</option>
                  <option value="service_manager">Service Manager</option>
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={cancelEdit}>Cancel</button>
                <button className="btn btn-success" onClick={saveEdit}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveUsers;
