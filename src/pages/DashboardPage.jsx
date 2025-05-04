import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-green-800 mb-4">Welcome to your Dashboard!</h1>
            <button
                onClick={handleLogout}
                className="bg-green-700 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;