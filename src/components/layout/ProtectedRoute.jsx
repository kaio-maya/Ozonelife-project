import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { base44 } from '../../lib/base44';

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        base44.auth.isAuthenticated().then(setIsAuthenticated);
    }, []);

    if (isAuthenticated === null) {
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
