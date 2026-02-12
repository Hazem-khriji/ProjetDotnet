import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

const AddPropertyModal = ({ isOpen, onOpenChange, formData, onInputChange, onSubmit, images, onImagesChange }) => {
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length > 0) {
      const previews = files.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      
      setImagePreviews(prev => [...prev, ...previews]);
      onImagesChange([...(images || []), ...files]);
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = (images || []).filter((_, i) => i !== index);
    
    URL.revokeObjectURL(imagePreviews[index].url);
    
    setImagePreviews(newPreviews);
    onImagesChange(newImages);
  };

  const handleDialogChange = (open) => {
    if (!open) {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url));
      setImagePreviews([]);
    }
    onOpenChange(open);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
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

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Property Images
            </label>
            <div className="space-y-3">
              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Images</span>
                </label>
                <span className="text-xs text-gray-500">
                  {imagePreviews.length > 0 && `${imagePreviews.length} image(s) selected`}
                </span>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">{preview.name}</p>
                    </div>
                  ))}
                </div>
              )}
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

