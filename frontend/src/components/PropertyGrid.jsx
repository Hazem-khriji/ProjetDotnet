import React from 'react';
import PropertyCard from './PropertyCard';

const PropertyGrid = ({ properties, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading properties</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-2">No properties found</p>
          <p className="text-gray-500">Try adjusting your search filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;

