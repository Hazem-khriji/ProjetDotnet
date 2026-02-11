﻿import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PropertyCard = ({ property }) => {
  return (
    <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Property Image/Placeholder */}
      <div className="relative bg-gray-100 h-64 flex items-center justify-center">
        <Building2 className="w-16 h-16 text-gray-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">
            {property.type}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-orange-500 text-white hover:bg-orange-500">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Property Title */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {property.title}
        </h3>

        {/* Property Address */}
        <div className="flex items-start gap-2 text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">{property.address}</span>
        </div>

        {/* Price and Area */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">
            {property.price}
          </span>
          <span className="text-sm text-gray-500">
            {property.area}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          variant="outline" 
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

