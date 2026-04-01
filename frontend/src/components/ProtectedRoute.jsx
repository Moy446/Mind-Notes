import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading, authenticated } = useContext(AuthContext);

  // Mientras se verifica la sesión, muestra un loader
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Verificando autenticación...
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!authenticated || !user) {
    return <Navigate to="/Login" replace />;
  }

  // Si el rol no coincide, redirige a la ruta correcta según su rol
  if (requiredRole && user.role !== requiredRole) {
    const redirectPath = user.role === 'psicologo'
      ? `/psicologo/chat/${user.id}`
      : `/paciente/chat/${user.id}`;
    return <Navigate to={redirectPath} replace />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
}