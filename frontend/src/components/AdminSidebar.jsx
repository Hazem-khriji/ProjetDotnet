import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Home, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import logo from '/assets/logo.svg';

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const menuItems = [
        {
            name: 'Statistics',
            icon: BarChart3,
            path: '/admin/statistics',
        },
        {
            name: 'Properties',
            icon: Home,
            path: '/admin/properties',
        },
        {
            name: 'Users',
            icon: Users,
            path: '/admin/users',
        },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="w-64 bg-gray-900 min-h-screen">
            <div className="p-6 border-b border-gray-700">
                <img src={logo} alt="logo" className="mb-4" />
                <h2 className="text-xl font-bold text-white">Admin Panel</h2>
                <p className="text-sm text-gray-400 mt-1">Manage your platform</p>
            </div>

            <nav className="px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                'flex items-center gap-3 px-4 py-3 rounded transition-colors',
                                isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded transition-colors w-full text-gray-300 hover:bg-red-600 hover:text-white"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

