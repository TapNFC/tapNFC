'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { validateTextUrl } from '@/validations/TextUrlValidation';

type VCardFormProps = {
  onSave: (vCardData: VCardData) => void;
  onCancel: () => void;
  existingData?: VCardData;
};

export type VCardData = {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  website: string;
  address: string;
};

type VCardErrors = {
  firstName?: string;
  lastName?: string;
  company?: string;
  jobTitle?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  general?: string;
};

export function VCardForm({ onSave, onCancel, existingData }: VCardFormProps) {
  const [formData, setFormData] = useState<VCardData>({
    firstName: existingData?.firstName || '',
    lastName: existingData?.lastName || '',
    company: existingData?.company || '',
    jobTitle: existingData?.jobTitle || '',
    dateOfBirth: existingData?.dateOfBirth || '',
    phone: existingData?.phone || '',
    email: existingData?.email || '',
    website: existingData?.website || '',
    address: existingData?.address || '',
  });

  const [errors, setErrors] = useState<VCardErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof VCardData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof VCardErrors]) {
      setErrors(prev => ({ ...prev, [field as keyof VCardErrors]: undefined }));
    }
  };

  // Profile picture functionality removed

  const validateForm = (): boolean => {
    const newErrors: VCardErrors = {};

    // First name is required
    if (!formData.firstName || formData.firstName.trim() === '') {
      newErrors.firstName = 'First name is required';
    }

    // Email validation if provided
    if (formData.email && !validateTextUrl(formData.email, 'email').isValid) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation if provided
    if (formData.phone && !validateTextUrl(formData.phone, 'phone').isValid) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Website validation if provided
    if (formData.website && !formData.website.startsWith('http://') && !formData.website.startsWith('https://')) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving vCard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Profile picture removed */}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="firstName" className="mb-1 block text-sm font-medium text-gray-700">
            First Name
          </Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={e => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="mb-1 block text-sm font-medium text-gray-700">
            Last Name
          </Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={e => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            className={errors.lastName ? 'border-red-500' : ''}
          />
        </div>
      </div>

      {/* Company and Job Title */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="company" className="mb-1 block text-sm font-medium text-gray-700">
            Company
          </Label>
          <Input
            id="company"
            value={formData.company}
            onChange={e => handleInputChange('company', e.target.value)}
            placeholder="QR Management"
          />
        </div>
        <div>
          <Label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-gray-700">
            Job Title
          </Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={e => handleInputChange('jobTitle', e.target.value)}
            placeholder="Software Developer"
          />
        </div>
      </div>

      {/* Date of Birth */}
      <div>
        <Label htmlFor="dateOfBirth" className="mb-1 block text-sm font-medium text-gray-700">
          Date of Birth
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={e => handleInputChange('dateOfBirth', e.target.value)}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </Label>
          <Input
            id="phone"
            type="text"
            value={formData.phone}
            onChange={e => handleInputChange('phone', e.target.value)}
            placeholder="+1234567890"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="text"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder="john@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <Label htmlFor="website" className="mb-1 block text-sm font-medium text-gray-700">
          Website
        </Label>
        <Input
          id="website"
          type="text"
          value={formData.website}
          onChange={e => handleInputChange('website', e.target.value)}
          placeholder="https://example.com"
          className={errors.website ? 'border-red-500' : ''}
        />
        {errors.website && (
          <p className="mt-1 text-xs text-red-500">{errors.website}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address" className="mb-1 block text-sm font-medium text-gray-700">
          Address
        </Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={e => handleInputChange('address', e.target.value)}
          placeholder="123 Main St, City, State, ZIP"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create vCard'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
