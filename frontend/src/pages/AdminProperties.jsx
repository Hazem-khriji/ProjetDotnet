import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Eye, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { propertyService } from '@/lib/api';

const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalCount: 0,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        address: '',
        city: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        yearBuilt: '',
        type: 0,
        status: 0,
        transaction: 0,
        isFeatured: false,
    });
    const [images, setImages] = useState([]);

    const PropertyType = {
        House: 0,
        Apartment: 1,
        Villa: 2,
        Office: 3,
        Land: 4,
    };

    const PropertyStatus = {
        Available: 0,
        Sold: 1,
        Rented: 2,
        Pending: 3,
    };

    const TransactionType = {
        Sale: 0,
        Rent: 1,
    };

    useEffect(() => {
        fetchProperties();
    }, [pagination.currentPage, searchTerm]);

    const fetchProperties = async () => {
        setIsLoading(true);
        try {
            const result = await propertyService.getProperties({
                searchTerm: searchTerm || undefined,
                pageNumber: pagination.currentPage,
                pageSize: pagination.pageSize,
            });
            setProperties(result.items || []);
            setPagination({
                currentPage: result.currentPage || 1,
                pageSize: result.pageSize || 10,
                totalPages: result.totalPages || 1,
                totalCount: result.totalCount || 0,
            });
        } catch (error) {
            console.error('Error fetching properties:', error);
            alert('Failed to fetch properties: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            await propertyService.deleteProperty(id);
            alert('Property deleted successfully');
            fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            alert('Failed to delete property: ' + error.message);
        }
    };

    const handleOpenDialog = (property = null) => {
        if (property) {
            setEditingProperty(property);
            setFormData({
                title: property.title || '',
                description: property.description || '',
                price: property.price?.toString() || '',
                address: property.address || '',
                city: property.city || '',
                state: property.state || '',
                zipCode: property.zipCode || '',
                country: property.country || '',
                bedrooms: property.bedrooms?.toString() || '',
                bathrooms: property.bathrooms?.toString() || '',
                area: property.area?.toString() || '',
                yearBuilt: property.yearBuilt?.toString() || '',
                type: property.type ?? 0,
                status: property.status ?? 0,
                transaction: property.transaction ?? 0,
                isFeatured: property.isFeatured || false,
            });
        } else {
            setEditingProperty(null);
            setFormData({
                title: '',
                description: '',
                price: '',
                address: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
                bedrooms: '',
                bathrooms: '',
                area: '',
                yearBuilt: '',
                type: 0,
                status: 0,
                transaction: 0,
                isFeatured: false,
            });
        }
        setImages([]);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingProperty(null);
        setFormData({
            title: '',
            description: '',
            price: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            bedrooms: '',
            bathrooms: '',
            area: '',
            yearBuilt: '',
            type: 0,
            status: 0,
            transaction: 0,
            isFeatured: false,
        });
        setImages([]);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (editingProperty) {
                // Update existing property
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                    bedrooms: parseInt(formData.bedrooms) || 0,
                    bathrooms: parseInt(formData.bathrooms) || 0,
                    area: parseFloat(formData.area) || 0,
                    yearBuilt: parseInt(formData.yearBuilt) || 0,
                    type: parseInt(formData.type),
                    status: parseInt(formData.status),
                    transaction: parseInt(formData.transaction),
                    isFeatured: formData.isFeatured,
                };
                await propertyService.updateProperty(editingProperty.id, updateData);
                alert('Property updated successfully');
            } else {
                // Create new property
                const formDataToSend = new FormData();
                formDataToSend.append('Title', formData.title);
                formDataToSend.append('Description', formData.description);
                formDataToSend.append('Price', formData.price);
                formDataToSend.append('Address', formData.address);
                formDataToSend.append('City', formData.city);
                formDataToSend.append('State', formData.state);
                formDataToSend.append('ZipCode', formData.zipCode);
                formDataToSend.append('Country', formData.country);
                formDataToSend.append('Bedrooms', formData.bedrooms || '0');
                formDataToSend.append('Bathrooms', formData.bathrooms || '0');
                formDataToSend.append('Area', formData.area || '0');
                formDataToSend.append('YearBuilt', formData.yearBuilt || '0');
                formDataToSend.append('Type', formData.type.toString());
                formDataToSend.append('Status', formData.status.toString());
                formDataToSend.append('Transaction', formData.transaction.toString());
                formDataToSend.append('IsFeatured', formData.isFeatured.toString());
                
                images.forEach((image) => {
                    formDataToSend.append('Images', image);
                });

                await propertyService.createProperty(formDataToSend);
                alert('Property created successfully');
            }
            handleCloseDialog();
            fetchProperties();
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to save property: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getPropertyTypeLabel = (type) => {
        const types = ['House', 'Apartment', 'Villa', 'Office', 'Land'];
        return types[type] || 'Unknown';
    };

    const getPropertyStatusLabel = (status) => {
        const statuses = ['Available', 'Sold', 'Rented', 'Pending'];
        return statuses[status] || 'Unknown';
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties Management</h1>
                    <p className="text-gray-600">Manage all properties on the platform</p>
                </div>
                <button 
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2 transition-colors"
                    onClick={() => handleOpenDialog()}
                >
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
                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading properties...</div>
                ) : (
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
                                {properties.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No properties found
                                        </td>
                                    </tr>
                                ) : (
                                    properties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {property.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {property.city}, {property.state}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {getPropertyTypeLabel(property.type)}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                ${property.price?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        property.status === 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : property.status === 1
                                                            ? 'bg-red-100 text-red-800'
                                                            : property.status === 2
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}
                                                >
                                                    {getPropertyStatusLabel(property.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        onClick={() => handleOpenDialog(property)}
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination */}
                {!isLoading && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} of{' '}
                            {pagination.totalCount} results
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                                disabled={pagination.currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </Card>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingProperty ? 'Edit Property' : 'Add New Property'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="type">Type *</Label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value={0}>House</option>
                                        <option value={1}>Apartment</option>
                                        <option value={2}>Villa</option>
                                        <option value={3}>Office</option>
                                        <option value={4}>Land</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="status">Status *</Label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value={0}>Available</option>
                                        <option value={1}>Sold</option>
                                        <option value={2}>Rented</option>
                                        <option value={3}>Pending</option>
                                    </select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="transaction">Transaction Type *</Label>
                                    <select
                                        id="transaction"
                                        name="transaction"
                                        value={formData.transaction}
                                        onChange={handleInputChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        required
                                    >
                                        <option value={0}>Sale</option>
                                        <option value={1}>Rent</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="bedrooms">Bedrooms</Label>
                                    <Input
                                        id="bedrooms"
                                        name="bedrooms"
                                        type="number"
                                        value={formData.bedrooms}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="bathrooms">Bathrooms</Label>
                                    <Input
                                        id="bathrooms"
                                        name="bathrooms"
                                        type="number"
                                        value={formData.bathrooms}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="area">Area (sq ft)</Label>
                                    <Input
                                        id="area"
                                        name="area"
                                        type="number"
                                        step="0.01"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="yearBuilt">Year Built</Label>
                                <Input
                                    id="yearBuilt"
                                    name="yearBuilt"
                                    type="number"
                                    value={formData.yearBuilt}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {!editingProperty && (
                                <div className="grid gap-2">
                                    <Label htmlFor="images">Images</Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Upload property images (optional)
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    id="isFeatured"
                                    name="isFeatured"
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    className="rounded border-gray-300"
                                />
                                <Label htmlFor="isFeatured">Featured Property</Label>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : editingProperty ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProperties;

