// src/pages/Claims.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Axios instance with JWT
import jsPDF from "jspdf";
import "jspdf-autotable";

const Claims = () => {
  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch claims from backend with search & pagination
  const fetchClaims = async () => {
    try {
      const res = await api.get("/claims", {
        params: { search, page, limit: 5, sort: "desc" },
      });
      setClaims(res.data.claims || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      console.error("Error fetching claims:", err);
      alert("Failed to fetch claims. Check your connection or login.");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [page, search]);

  // Delete a claim
  const deleteClaim = async (id) => {
    if (window.confirm("Are you sure you want to delete this claim?")) {
      try {
        await api.delete(`/claims/${id}`);
        fetchClaims();
      } catch (err) {
        console.error("Error deleting claim:", err);
        alert("Failed to delete claim.");
      }
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => navigate(`/claims/edit/${id}`);

  // Download all claims as PDF
  const downloadAllReceipts = async () => {
    try {
      const res = await api.get("/claims", { params: { all: true, sort: "desc" } });
      const data = res.data.claims;
      if (!data?.length) return alert("No claims available to download.");

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Sterling Marine Adjusters", 20, 20);
      doc.setFontSize(12);
      doc.text("Claims Report (Admin Dashboard)", 20, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 40);

      const rows = data.map((c) => [
        c.reference || "-",
        c.fullName || "-",
        c.typeOfLoss || "-",
        c.vesselName || "-",
        c.incidentDate || "-",
        c.estimatedLoss != null ? c.estimatedLoss.toLocaleString() : "-",
        c.status || "-",
      ]);

      doc.autoTable({
        startY: 50,
        head: [["Reference", "Claimant", "Type", "Vessel", "Incident Date", "Estimated Loss", "Status"]],
        body: rows,
      });

      doc.save("Claims_Report.pdf");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate claims report.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Claims</h2>
        <div>
          <button className="btn btn-success me-2" onClick={downloadAllReceipts}>
            📄 Download All Claims
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/claims/add")}>
            + Add Claim
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Search by reference, claimant, or vessel"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          onKeyDown={(e) => e.key === "Enter" && fetchClaims()}
        />
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Reference</th>
            <th>Claimant</th>
            <th>Type</th>
            <th>Vessel</th>
            <th>Incident Date</th>
            <th>Estimated Loss</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {claims.length > 0 ? (
            claims.map((c) => (
              <tr key={c._id}>
                <td>{c.reference || "-"}</td>
                <td>{c.fullName || "-"}</td>
                <td>{c.typeOfLoss || "-"}</td>
                <td>{c.vesselName || "-"}</td>
                <td>{c.incidentDate || "-"}</td>
                <td>{c.estimatedLoss != null ? c.estimatedLoss.toLocaleString() : "-"}</td>
                <td>{c.status || "-"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(c._id)}>
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteClaim(c._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No claims found.
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

export default Claims;
