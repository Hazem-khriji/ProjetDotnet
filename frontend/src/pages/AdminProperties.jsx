import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // TODO: Fetch properties from API
        // For now, using mock data
        setProperties([
            {
                id: 1,
                title: 'Modern Villa in Downtown',
                type: 'Villa',
                price: 450000,
                status: 'Active',
                location: 'New York, NY',
            },
            {
                id: 2,
                title: 'Luxury Apartment',
                type: 'Apartment',
                price: 320000,
                status: 'Active',
                location: 'Los Angeles, CA',
            },
            {
                id: 3,
                title: 'Cozy House',
                type: 'House',
                price: 280000,
                status: 'Pending',
                location: 'Chicago, IL',
            },
        ]);
    }, []);

    const filteredProperties = properties.filter((property) =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        // TODO: Implement delete functionality
        if (confirm('Are you sure you want to delete this property?')) {
            setProperties(properties.filter((p) => p.id !== id));
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
                    <p className="text-gray-600">Manage all properties on the platform</p>
                </div>
                <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Property
                </button>
            </div>

            <Card className="bg-white border border-gray-200 shadow-lg p-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                        type="text"
                        placeholder="Search properties by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Property
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProperties.map((property) => (
                                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {property.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {property.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {property.type}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        ${property.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                property.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {property.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="View"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                onClick={() => handleDelete(property.id)}
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default AdminProperties;

