import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute'; // ✅

import AdminDashboard from './pages/AdminDashboard';
import Login from './components/Login'; // ✅

import Claims from './pages/Claims';
import AddClaim from './pages/AddClaim';
import EditClaim from './pages/EditClaim';

import Payments from './pages/Payments';
import AddPayment from './pages/AddPayment';

import Reports from './pages/Reports';
import Roles from './pages/Roles';
import Logout from './pages/Logout';

import ActiveUsers from './pages/Users/ActiveUsers';
import PendingUsers from './pages/Users/PendingUsers';
import SuspendedUsers from './pages/Users/SuspendedUsers';
import RejectedUsers from './pages/Users/RejectedUsers';
import AddUser from './pages/Users/AddUser';

import AddEmployee from './pages/Employees/AddEmployee';
import AllEmployees from './pages/Employees/AllEmployees'; // ✅ NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (Login) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes (Require Login) */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="d-flex">
                <Sidebar />
                <div className="flex-grow-1 p-4">
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/claims" element={<Claims />} />
                    <Route path="/claims/add" element={<AddClaim />} />
                    <Route path="/claims/edit/:id" element={<EditClaim />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/payments/add" element={<AddPayment />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/users/active" element={<ActiveUsers />} />
                    <Route path="/users/pending" element={<PendingUsers />} />
                    <Route path="/users/suspended" element={<SuspendedUsers />} />
                    <Route path="/users/rejected" element={<RejectedUsers />} />
                    <Route path="/users/add" element={<AddUser />} />
                    <Route path="/employees/add" element={<AddEmployee />} />
                    <Route path="/employees/all" element={<AllEmployees />} /> {/* ✅ NEW */}
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
