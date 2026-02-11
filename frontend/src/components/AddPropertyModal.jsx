﻿﻿import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const AddPropertyModal = ({ isOpen, onOpenChange, formData, onInputChange, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., Luxury Family Villa"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              maxLength={200}
              required
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe the property..."
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              maxLength={2000}
              required
              className="min-h-[100px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Price and Area Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Price <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => onInputChange('price', e.target.value)}
                min={0}
                step="0.01"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Area (m²) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.area}
                onChange={(e) => onInputChange('area', e.target.value)}
                min={1}
                max={10000}
                step="0.1"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Type and Transaction Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Property Type <span className="text-red-500">*</span>
              </label>
              <Select value={formData.type} onValueChange={(value) => onInputChange('type', value)} required>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Transaction Type <span className="text-red-500">*</span>
              </label>
              <Select value={formData.transaction} onValueChange={(value) => onInputChange('transaction', value)} required>
                <SelectTrigger className="bg-white border-gray-200">
                  <SelectValue placeholder="Select transaction" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              Address <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="e.g., 123 Main Street"
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              maxLength={500}
              required
              className="bg-white border-gray-200"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-600">
              City
            </label>
            <Input
              type="text"
              placeholder="e.g., New York"
              value={formData.city}
              onChange={(e) => onInputChange('city', e.target.value)}
              maxLength={100}
              className="bg-white border-gray-200"
            />
          </div>

          {/* Bedrooms, Bathrooms, Year Built Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Bedrooms
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.bedrooms}
                onChange={(e) => onInputChange('bedrooms', e.target.value)}
                min={0}
                max={50}
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Bathrooms
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.bathrooms}
                onChange={(e) => onInputChange('bathrooms', e.target.value)}
                min={0}
                max={50}
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-600">
                Year Built
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.yearBuilt}
                onChange={(e) => onInputChange('yearBuilt', e.target.value)}
                min={1800}
                max={2050}
                className="bg-white border-gray-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Property
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPropertyModal;

