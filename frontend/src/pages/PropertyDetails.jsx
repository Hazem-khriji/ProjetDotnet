import React, { useState } from 'react';
import { MapPin, Ruler, Eye, Calendar, Building2, Phone, Mail, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PropertyDetails = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState("I'm interested in this property...");
  const [visitDate, setVisitDate] = useState('');

  // Sample property data
  const property = {
    id: 1,
    title: 'Modern Downtown Apartment',
    address: '123 Main Street, Downtown, NY 10001',
    price: '$450,000',
    area: '85.5 m²',
    type: 'Apartment',
    status: 'Available',
    views: 0,
    listedDate: 'Jan 31, 2026',
    description: 'Stunning 2-bedroom apartment in the heart of downtown. Features modern amenities, city views, and walking distance to shops and restaurants.',
    agent: {
      name: 'John Agent',
      phone: '+1-555-0101',
      initial: 'J'
    }
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    console.log('Inquiry sent:', { phoneNumber, message, visitDate });
  };

  return (
    <div className="w-full overflow-hidden bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 md:px-20 lg:px-32 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2">
            {/* Property Image */}
            <Card className="bg-gray-100 border-gray-200 overflow-hidden mb-6">
              <div className="relative bg-gray-400 h-96 flex items-center justify-center">
                <Building2 className="w-24 h-24 text-gray-500" />
              </div>
            </Card>

            {/* Property Title and Price */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 mb-4">
                <MapPin className="w-5 h-5" />
                <span>{property.address}</span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-blue-600">
                  {property.price}
                </span>
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  {property.type}
                </Badge>
                <Badge className="bg-cyan-500 text-white hover:bg-cyan-600">
                  {property.status}
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
                      <p className="text-lg font-semibold text-gray-800">{property.area}</p>
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
                      <p className="text-lg font-semibold text-gray-800">{property.views}</p>
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
                      <p className="text-lg font-semibold text-gray-800">{property.listedDate}</p>
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
                      <span className="text-white text-2xl font-bold">{property.agent.initial}</span>
                    </div>
                    <h4 className="text-gray-800 text-lg font-semibold mb-2">{property.agent.name}</h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Phone className="w-4 h-4" />
                      <span>{property.agent.phone}</span>
                    </div>
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
                        placeholder="I'm interested in this property..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="w-full bg-white border border-gray-200 text-gray-800 placeholder:text-gray-400 rounded-md px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-600 focus-visible:ring-blue-600/50 focus-visible:ring-[3px] resize-none"
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
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;

