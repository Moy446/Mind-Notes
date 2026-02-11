import {useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay error en la URL
        const error = searchParams.get('error');
        
        if (error) {
            // Si hay error, redirigir al login con mensaje de error
            navigate(`/login?error=${error}`);
        } else {
            // Si no hay error, las cookies ya fueron establecidas por el backend
            // El backend debería haber redirigido directamente, pero por si acaso
            navigate('/login');
        }
    }, [searchParams, navigate]);   
    
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Autenticando con Google...</h2>
            <p>Redirigiendo...</p>
        </div>
    );
}