// app/components/FormValidator.js
export const validateProductForm = (formData) => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.subcategory.trim()) errors.subcategory = 'Subcategory is required';
    return errors;
  };
  
  export const validateAdditionalInfo = (formData) => {
    const errors = {};
    if (formData.listingType === 'sell') {
      if (!formData.price) errors.price = 'Price is required';
      if (!formData.location.trim()) errors.location = 'Location is required';
    }
    return errors;
  };