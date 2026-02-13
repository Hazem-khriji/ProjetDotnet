import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import AdminSidebar from '@/components/AdminSidebar';

const AdminLayout = () => {
    const { user, isAuthenticated } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    const isAdmin = user?.roles?.includes('Admin');
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <main className="flex-1 px-6 md:px-20 lg:px-32 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

