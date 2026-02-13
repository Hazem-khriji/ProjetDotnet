﻿import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddPropertyModal from '../components/AddPropertyModal';
import PropertyFilters from '../components/PropertyFilters';
import PropertyGrid from '../components/PropertyGrid';
import Pagination from '../components/Pagination';
import { API_ENDPOINTS, propertyService } from '../lib/api';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 4,
    totalCount: 0,
    totalPages: 0,
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: '',
    transaction: '',
    address: '',
    city: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    yearBuilt: ''
  });
  
  const [propertyImages, setPropertyImages] = useState([]);
  
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      };
      
      if (searchTerm && searchTerm.trim()) {
        params.searchTerm = searchTerm.trim();
      }
      
      if (propertyType !== 'all') {
        const typeMap = {
          'apartment': 0,
          'house': 1,
          'villa': 2,
          'land': 3,
          'commercial': 4,
        };
        params.type = typeMap[propertyType.toLowerCase()];
      }
      
      if (transactionType !== 'all') {
        const transactionMap = {
          'sale': 0,
          'rent': 1,
        };
        params.transaction = transactionMap[transactionType.toLowerCase()];
      }
      
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        params.minPrice = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        params.maxPrice = parseFloat(maxPrice);
      }
      
      const result = await propertyService.getProperties(params);
      
      setProperties(result.items || []);
      setPagination({
        pageNumber: result.pageNumber,
        pageSize: result.pageSize,
        totalCount: result.totalCount,
        totalPages: result.totalPages,
      });
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.pageNumber, pagination.pageSize, searchTerm, propertyType, transactionType, minPrice, maxPrice]);
  
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]); 

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, pageNumber: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images) => {
    setPropertyImages(images);
  };

  const handleSubmitProperty = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.price || 
        !formData.type || !formData.transaction || !formData.address || !formData.area) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('transaction', formData.transaction);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('area', formData.area);
      
      if (formData.city) formDataToSend.append('city', formData.city);
      if (formData.bedrooms) formDataToSend.append('bedrooms', formData.bedrooms);
      if (formData.bathrooms) formDataToSend.append('bathrooms', formData.bathrooms);
      if (formData.yearBuilt) formDataToSend.append('yearBuilt', formData.yearBuilt);
      
      propertyImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });
      
      const response = await fetch(API_ENDPOINTS.PROPERTIES.API, {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in as an Admin or Agent to add properties');
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const error = await response.json();
          throw new Error(error.error || error.message || 'Failed to create property');
        } else {
          throw new Error(`Failed to create property (Status: ${response.status})`);
        }
      }

      const result = await response.json();
      console.log('Property created successfully:', result);
      
      alert('Property created successfully!');
      
      setFormData({
        title: '',
        description: '',
        price: '',
        type: '',
        transaction: '',
        address: '',
        city: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        yearBuilt: ''
      });
      setPropertyImages([]);
      setIsModalOpen(false);
      

      await fetchProperties();
      
    } catch (error) {
      console.error('Error creating property:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
      <>
        <Navbar />
    <div className="min-h-screen bg-white pt-20">
      {/* Search Filters Section */}
      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">
              Find Your <span className="underline underline-offset-4 decoration-1 font-light">Dream Property</span>
            </h1>
            <p className="text-gray-500 max-w-80">
              Browse through our extensive collection of properties
            </p>
          </div>
          
          {/* Add Property Button */}
          <AddPropertyModal
            isOpen={isModalOpen}
            onOpenChange={setIsModalOpen}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmitProperty}
            images={propertyImages}
            onImagesChange={handleImagesChange}
          />
        </div>

        <PropertyFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          propertyType={propertyType}
          setPropertyType={setPropertyType}
          transactionType={transactionType}
          setTransactionType={setTransactionType}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          onSearch={handleSearch}
        />

        {/* Properties Grid */}
        <PropertyGrid 
          properties={properties} 
          loading={loading}
          error={error}
        />
        
        {/* Results Summary */}
        {!loading && !error && properties.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {((pagination.pageNumber - 1) * pagination.pageSize) + 1} - {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} properties
          </div>
        )}
        
        {/* Pagination */}
        <Pagination 
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
    <Footer />
      </>
  );
};

export default Properties;

