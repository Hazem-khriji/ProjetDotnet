﻿import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddPropertyModal from '../components/AddPropertyModal';
import PropertyFilters from '../components/PropertyFilters';
import PropertyGrid from '../components/PropertyGrid';
import { API_ENDPOINTS } from '../lib/api';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  
  const properties = [
    {
      id: 1,
      title: 'Luxury Family Villa',
      address: '456 Oak Avenue, Suburbia, NY 10002',
      price: '$750,000',
      area: '220 m²',
      type: 'Villa',
      isFeatured: true,
      image: null,
    },
    {
      id: 2,
      title: 'Modern Downtown Apartment',
      address: '123 Main Street, Downtown, NY 10001',
      price: '$450,000',
      area: '85.5 m²',
      type: 'Apartment',
      isFeatured: true,
      image: null,
    },
    {
      id: 3,
      title: 'Commercial Office Space',
      address: '321 Business Blvd, Financial District, NY 10004',
      price: '$3,500',
      area: '150 m²',
      type: 'Commercial',
      isFeatured: false,
      image: null,
    },
    {
      id: 4,
      title: 'Cozy Studio Apartment',
      address: '789 Pine Street, Midtown, NY 10003',
      price: '$1,800',
      area: '45 m²',
      type: 'Apartment',
      isFeatured: false,
      image: null,
    },
  ];

  const handleSearch = () => {
    console.log('Searching with:', { searchTerm, propertyType, transactionType, minPrice, maxPrice });
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
        credentials: 'include', // Use cookie-based auth instead of Bearer token
        body: formDataToSend
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('You must be logged in as an Admin or Agent to add properties');
        }
        
        // Try to parse error message from response
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
        <PropertyGrid properties={properties} />
      </div>
    </div>
    <Footer />
      </>
  );
};

export default Properties;

