﻿import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Ruler, Eye, Calendar, Building2, Phone, Mail, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { propertyService, inquiryService } from '../lib/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState("");
  const [visitDate, setVisitDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await propertyService.getPropertyById(parseInt(id));
        setProperty(data);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  // Helper functions
  const getPropertyTypeName = (type) => {
    const typeMap = {
      0: 'Apartment',
      1: 'House',
      2: 'Villa',
      3: 'Land',
      4: 'Commercial'
    };
    return typeMap[type] || 'Property';
  };

  const getTransactionTypeName = (transaction) => {
    const transactionMap = {
      0: 'For Sale',
      1: 'For Rent'
    };
    return transactionMap[transaction] || '';
  };

  const getStatusName = (status) => {
    const statusMap = {
      0: 'Available',
      1: 'Pending',
      2: 'Sold',
      3: 'Rented'
    };
    return statusMap[status] || 'Unknown';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getImageUrl = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';
    
    let url = null;
    if (property?.primaryImageUrl) {
      url = property.primaryImageUrl;
    } else if (property?.images && property.images.length > 0) {
      url = property.images[0].imageUrl;
    }
    
    if (url && url.startsWith('/')) {
      return `${API_BASE_URL}${url}`;
    }
    
    return url;
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    
    if (!property?.id) {
      setSubmitError('Property not found');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    try {
      const inquiryData = {
        propertyId: property.id,
        message: message,
        phoneNumber: phoneNumber,
        preferredVisitDate: visitDate || undefined,
      };
      
      await inquiryService.createInquiry(inquiryData);
      
      setSubmitSuccess(true);
      // Clear form
      setPhoneNumber('');
      setMessage("I'm interested in this property...");
      setVisitDate('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error creating inquiry:', err);
      setSubmitError(err.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      <Navbar />
      
      {loading && (
        <div className="container mx-auto px-6 md:px-20 lg:px-32 py-24">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading property details...</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="container mx-auto px-6 md:px-20 lg:px-32 py-24">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Error Loading Property</p>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && property && (
      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            <Card className="bg-gray-100 border-gray-200 overflow-hidden mb-6">
              <div className="relative bg-gray-400 h-96 flex items-center justify-center">
                {getImageUrl() ? (
                  <img 
                    src={getImageUrl()} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Building2 className="w-24 h-24 text-gray-500" />
                )}
              </div>
            </Card>

            {/* Property Title and Price */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{property.address}{property.city ? `, ${property.city}` : ''}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </span>
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  {getPropertyTypeName(property.type)}
                </Badge>
                <Badge className="bg-green-600 text-white hover:bg-green-700">
                  {getTransactionTypeName(property.transaction)}
                </Badge>
                <Badge className="bg-cyan-500 text-white hover:bg-cyan-600">
                  {getStatusName(property.status)}
                </Badge>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Ruler className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="text-lg font-semibold text-gray-800">{property.area} m²</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Views</p>
                      <p className="text-lg font-semibold text-gray-800">{property.views || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Listed</p>
                      <p className="text-lg font-semibold text-gray-800">{formatDate(property.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-200 shadow-lg sticky top-24">
              <CardContent className="p-6">
                {/* Listed By Section */}
                <div className="mb-6">
                  <h3 className="text-gray-800 text-lg font-semibold mb-4">Listed By</h3>
                  
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-2xl font-bold">
                        {property.owner?.firstName?.charAt(0) || 'A'}
                      </span>
                    </div>
                    <h4 className="text-gray-800 text-lg font-semibold mb-2">
                      {property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : 'Agent'}
                    </h4>
                    {property.owner?.phoneNumber && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{property.owner.phoneNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  {/* Contact Form */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-gray-800 mb-4">
                      <Mail className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Interested in this property?</h3>
                    </div>
                  </div>

                  <form onSubmit={handleSendInquiry} className="space-y-4">
                    {/* Success Message */}
                    {submitSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-800 text-sm font-medium">
                          ✓ Your inquiry has been sent successfully! We'll get back to you soon.
                        </p>
                      </div>
                    )}

                    {/* Error Message */}
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <p className="text-red-800 text-sm font-medium">
                          ✗ {submitError}
                        </p>
                      </div>
                    )}

                    {/* Phone Number */}
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="tel"
                        placeholder="Your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder=""
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-600 focus-visible:ring-blue-600/50 focus-visible:ring-[3px] resize-none"
                        required
                      />
                    </div>

                    {/* Preferred Visit Date */}
                    <div>
                      <label className="block text-gray-600 text-sm font-medium mb-2">
                        Preferred Visit Date
                      </label>
                      <Input
                        type="datetime-local"
                        value={visitDate}
                        onChange={(e) => setVisitDate(e.target.value)}
                        className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-base"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyDetails;

