// src/pages/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page after a short delay (for UX)
    const timer = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div>
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-center">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
