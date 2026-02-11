import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PropertyFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  propertyType, 
  setPropertyType,
  transactionType,
  setTransactionType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onSearch
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-12">
      {/* Search Input */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-2 text-gray-600">Search</label>
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Type Select */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-2 text-gray-600">Type</label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="w-full bg-white border-gray-200 text-gray-800">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="house">House</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction Select */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-2 text-gray-600">Transaction</label>
        <Select value={transactionType} onValueChange={setTransactionType}>
          <SelectTrigger className="w-full bg-white border-gray-200 text-gray-800">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Min Price Input */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-2 text-gray-600">Min Price</label>
        <Input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Max Price Input */}
      <div className="lg:col-span-1">
        <label className="block text-sm font-medium mb-2 text-gray-600">Max Price</label>
        <Input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full bg-white border-gray-200 text-gray-800 placeholder:text-gray-400"
        />
      </div>

      {/* Search Button */}
      <div className="lg:col-span-1 flex items-end">
        <Button 
          onClick={onSearch}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PropertyFilters;

