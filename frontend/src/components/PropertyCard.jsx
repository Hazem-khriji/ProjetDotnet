import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Home, Bed, Bath } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
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

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get image URL
  const getImageUrl = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';
    
    let url = null;
    if (property.primaryImageUrl) {
      url = property.primaryImageUrl;
    } else if (property.images && property.images.length > 0) {
      url = property.images[0].imageUrl;
    }
    
    // If URL is relative, prepend the API base URL
    if (url && url.startsWith('/')) {
      return `${API_BASE_URL}${url}`;
    }
    
    return url;
  };

  const imageUrl = getImageUrl();
  
  const handleImageError = (e) => {
    console.error('Image failed to load:', imageUrl);
    console.log('Property data:', property);
    e.target.style.display = 'none';
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Property Image/Placeholder */}
      <div className="relative bg-gray-100 h-64 flex items-center justify-center">
        {imageUrl ? (
          <>
            <img 
              src={imageUrl} 
              alt={property.title} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            {/* Fallback icon if image fails to load */}
            <Building2 className="w-16 h-16 text-gray-300 absolute" style={{ display: 'none' }} />
          </>
        ) : (
          <Building2 className="w-16 h-16 text-gray-300" />
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          <Badge className="bg-blue-600 text-white hover:bg-blue-600">
            {getPropertyTypeName(property.type)}
          </Badge>
          {property.isFeatured && (
            <Badge className="bg-orange-500 text-white hover:bg-orange-500">
              Featured
            </Badge>
          )}
          <Badge className="bg-green-600 text-white hover:bg-green-600">
            {getTransactionTypeName(property.transaction)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Property Title */}
        <h3 className="text-lg font-semibold mb-3 text-gray-800 line-clamp-2">
          {property.title}
        </h3>

        {/* Property Address */}
        <div className="flex items-start gap-2 text-gray-600 text-sm mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2">
            {property.address}
            {property.city && `, ${property.city}`}
          </span>
        </div>

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms) && (
          <div className="flex items-center gap-4 text-gray-600 text-sm mb-4">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
          </div>
        )}

        {/* Price and Area */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm text-gray-500">
            {property.area} m²
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          variant="outline" 
          className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          onClick={() => navigate(`/property/${property.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

