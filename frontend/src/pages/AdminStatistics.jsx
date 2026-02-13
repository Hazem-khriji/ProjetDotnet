import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Home } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { statisticsService } from '@/lib/api';

const AdminStatistics = () => {
    const [statistics, setStatistics] = useState({
        totalProperties: 0,
        totalUsers: 0,
        totalInquiries: 0,
        activeListings: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const data = await statisticsService.getDashboardStatistics();
                setStatistics({
                    totalProperties: data.totalProperties || 0,
                    totalUsers: data.totalUsers || 0,
                    totalInquiries: data.pendingRequests || 0,
                    activeListings: data.activeProperties || 0,
                });
                setError(null);
            } catch (err) {
                console.error('Failed to fetch statistics:', err);
                setError('Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const statCards = [
        {
            title: 'Total Properties',
            value: statistics.totalProperties,
            icon: Home,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Total Users',
            value: statistics.totalUsers,
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Inquiries',
            value: statistics.totalInquiries,
            icon: BarChart3,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            title: 'Active Listings',
            value: statistics.activeListings,
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Statistics</h1>
                <p className="text-gray-600">Overview of your platform's performance</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading statistics...</div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <Card key={stat.title} className="bg-white border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">
                                                {stat.title}
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                                {stat.value.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded ${stat.bgColor}`}>
                                            <Icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-white border border-gray-200 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Recent Activity
                            </h3>
                            <p className="text-gray-500">Activity chart will be displayed here</p>
                        </Card>

                        <Card className="bg-white border border-gray-200 shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Property Distribution
                            </h3>
                            <p className="text-gray-500">Property distribution chart will be displayed here</p>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminStatistics;

