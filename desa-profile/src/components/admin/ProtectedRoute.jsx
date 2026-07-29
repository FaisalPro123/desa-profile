import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

/**
 * adminOnly=true  → only role:'admin' can access
 * adminOnly=false → any logged-in user can access (admin | viewer | user)
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/admin/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/admin/dashboard" replace />;
  return children;
}
