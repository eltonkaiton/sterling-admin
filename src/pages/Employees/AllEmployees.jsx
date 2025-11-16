import { useEffect, useRef, useState } from "react";
import axios from "axios";

const AllEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false); // 👈 Prevent duplicate fetch in StrictMode

  useEffect(() => {
    if (fetched.current) return; // already fetched once
    fetched.current = true;

    const fetchEmployees = async () => {
      try {
        console.log("Fetching employees...");
        const res = await axios.get("https://sterling-project.onrender.com/api/employees");
        console.log("Fetched employees:", res.data);
        setEmployees(res.data.employees); // ✅ fix: only set employees array
      } catch (err) {
        console.error("Failed to fetch employees", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">All Employees</h2>

      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.fullName}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>{emp.position}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllEmployees;
