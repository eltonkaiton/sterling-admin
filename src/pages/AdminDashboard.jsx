// src/pages/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { FaUsers, FaFileAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';

// Simple web footer component
const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}>
        2025 © <span style={companyNameStyle}>Forge Reactor</span> | Forging Digital Innovation
      </p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#1A1F2E",
  padding: "12px 0",
  textAlign: "center",
  borderTop: "2px solid #FF6B35",
  marginTop: "40px",
};

const textStyle = {
  color: "#E2E8F0",
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.5px",
  margin: 0,
};

const companyNameStyle = {
  color: "#FF6B35",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const AdminDashboard = () => {
  const [summary, setSummary] = useState({});
  const [claimsByStatus, setClaimsByStatus] = useState([]);
  const [monthlyClaims, setMonthlyClaims] = useState([]);
  const [paymentsBreakdown, setPaymentsBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSummary(res.data.summary);
      setClaimsByStatus(res.data.claimsByStatus);
      setMonthlyClaims(res.data.monthlyClaims);
      setPaymentsBreakdown(res.data.paymentsBreakdown);
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5">Loading dashboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container py-4 d-flex flex-column min-vh-100">
      <h2 className="mb-4 fw-bold text-primary">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <SummaryCard icon={<FaUsers size={32} />} title="Total Users" value={summary.totalUsers} bg="primary" />
        <SummaryCard icon={<FaFileAlt size={32} />} title="Total Claims" value={summary.totalClaims} bg="success" />
        <SummaryCard icon={<FaMoneyBillWave size={32} />} title="Total Payments" value={summary.totalPayments} bg="warning" text="dark" />
        <SummaryCard icon={<FaClock size={32} />} title="Pending Claims" value={summary.pendingClaims} bg="danger" />
      </div>

      {/* Charts */}
      <div className="row g-4">
        <ChartCard title="Claims by Status">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsByStatus}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0d6efd" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Payments Breakdown">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentsBreakdown}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#198754"
                label
              />
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Monthly Claims" extraClass="mt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyClaims}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#6610f2" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Reusable Card Components
const SummaryCard = ({ icon, title, value, bg, text = "white" }) => (
  <div className="col-md-3">
    <div className={`card shadow-sm rounded-4 border-0 text-bg-${bg} text-${text} h-100`}>
      <div className="card-body d-flex flex-column align-items-start">
        {icon}
        <h6 className="fw-semibold">{title}</h6>
        <h2 className="fw-bold">{value || 0}</h2>
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, extraClass = "" }) => (
  <div className={`card shadow-sm rounded-4 p-3 ${extraClass}`}>
    <h5 className="fw-semibold mb-3">{title}</h5>
    {children}
  </div>
);

export default AdminDashboard;
