import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  FaBars, FaUser, FaUsers, FaFileInvoiceDollar, FaSignOutAlt,
  FaUserShield, FaClipboardList
} from 'react-icons/fa';

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEmployeeMenuOpen, setIsEmployeeMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleEmployeeMenu = () => setIsEmployeeMenuOpen(!isEmployeeMenuOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isSidebarOpen) {
      // Close dropdowns when collapsing sidebar
      setIsUserMenuOpen(false);
      setIsEmployeeMenuOpen(false);
    }
  };

  return (
    <div
      className="bg-dark text-white vh-100 p-3 d-flex flex-column"
      style={{ width: isSidebarOpen ? '250px' : '80px', transition: 'width 0.3s' }}
    >
      {/* Toggle Button */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        {isSidebarOpen && <h5 className="m-0">Sterling</h5>}
        <button className="btn btn-sm text-white" onClick={toggleSidebar}>
          <FaBars />
        </button>
      </div>

      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className="nav-item mb-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? "fw-bold text-warning" : "text-white"}`
            }
          >
            <FaClipboardList className="me-2" />
            {isSidebarOpen && 'Dashboard'}
          </NavLink>
        </li>

        {/* Users Dropdown */}
        <li className="nav-item mb-2">
          <button
            onClick={toggleUserMenu}
            className="btn btn-sm text-white w-100 text-start d-flex align-items-center"
          >
            <FaUsers className="me-2" />
            {isSidebarOpen && (
              <>
                Users <span className="ms-auto">{isUserMenuOpen ? '▾' : '▸'}</span>
              </>
            )}
          </button>

          {isUserMenuOpen && isSidebarOpen && (
            <ul className="nav flex-column ms-4 mt-2">
              <li className="nav-item mb-1">
                <NavLink to="/users/active" className="nav-link text-white">Active</NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/users/pending" className="nav-link text-white">Pending</NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/users/suspended" className="nav-link text-white">Suspended</NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/users/rejected" className="nav-link text-white">Rejected</NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/users/add" className="nav-link text-white">Add User</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Claims */}
        <li className="nav-item mb-2">
          <NavLink
            to="/claims"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? "fw-bold text-warning" : "text-white"}`
            }
          >
            <FaFileInvoiceDollar className="me-2" />
            {isSidebarOpen && 'Claims'}
          </NavLink>
        </li>

        {/* Payments */}
        <li className="nav-item mb-2">
          <NavLink
            to="/payments"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${isActive ? "fw-bold text-warning" : "text-white"}`
            }
          >
            <FaUserShield className="me-2" />
            {isSidebarOpen && 'Payments'}
          </NavLink>
        </li>

        {/* Employee Dropdown */}
        <li className="nav-item mb-2">
          <button
            onClick={toggleEmployeeMenu}
            className="btn btn-sm text-white w-100 text-start d-flex align-items-center"
          >
            <FaUser className="me-2" />
            {isSidebarOpen && (
              <>
                Employee <span className="ms-auto">{isEmployeeMenuOpen ? '▾' : '▸'}</span>
              </>
            )}
          </button>

          {isEmployeeMenuOpen && isSidebarOpen && (
            <ul className="nav flex-column ms-4 mt-2">
              <li className="nav-item mb-1">
                <NavLink to="/employees/all" className="nav-link text-white">All Employees</NavLink>
              </li>
              <li className="nav-item mb-1">
                <NavLink to="/employees/add" className="nav-link text-white">Add Employee</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Logout with confirmation */}
        <li className="nav-item mt-auto">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to log out?")) {
                localStorage.clear();
                window.location.href = "/login";
              }
            }}
            className="btn btn-sm text-white d-flex align-items-center w-100 text-start"
          >
            <FaSignOutAlt className="me-2" />
            {isSidebarOpen && 'Logout'}
          </button>
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
