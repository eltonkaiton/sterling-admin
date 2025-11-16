// src/pages/Payments.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance with JWT

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch claims with payments
  const fetchPayments = async () => {
    try {
      const res = await api.get("/claims", {
        params: {
          search,
          page,
          limit: 5,
          paymentStatus: "paid", // only fetch paid claims
          sort: "desc",
        },
      });

      // Map claims to payment-like display
      const paidClaims = (res.data.claims || []).map((c) => ({
        _id: c._id,
        reference: c.reference,
        insured: c.fullName || c.insured || "-",
        date: c.paymentDate || c.updatedAt || "-",
        amount: c.paymentAmount || c.estimatedLoss || 0,
        method: c.paymentMethod || "-",
      }));

      setPayments(paidClaims);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error fetching payments from claims:", err);
      alert("Failed to fetch payments. Check your connection or login.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, search]);

  // Delete a claim/payment
  const deletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      try {
        await api.delete(`/claims/${id}`);
        fetchPayments();
      } catch (err) {
        console.error("Error deleting payment:", err);
        alert("Failed to delete payment.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Payments</h2>
        <button className="btn btn-primary" onClick={() => navigate("/claims/add")}>
          + Add Claim/Payment
        </button>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by reference, insured, or method"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchPayments()}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Reference</th>
            <th>Insured</th>
            <th>Payment Date</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((p) => (
              <tr key={p._id}>
                <td>{p.reference}</td>
                <td>{p.insured}</td>
                <td>{p.date !== "-" ? new Date(p.date).toLocaleDateString() : "-"}</td>
                <td>{p.amount.toLocaleString()}</td>
                <td>{p.method}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => deletePayment(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No payments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <button className="btn btn-outline-primary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button className="btn btn-outline-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Payments;
