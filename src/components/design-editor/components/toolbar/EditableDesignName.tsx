'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { designService } from '@/services/designService';

type EditableDesignNameProps = {
  designId: string;
  initialName: string;
};

export function EditableDesignName({ designId, initialName }: EditableDesignNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    if (name === initialName || name.trim() === '') {
      setName(initialName);
      setIsEditing(false);
      return;
    }

    setIsEditing(false);
    const toastId = toast.loading('Renaming design...');

    try {
      const updatedDesign = await designService.updateDesign(designId, { name: name.trim() });
      if (updatedDesign) {
        toast.success('Design renamed successfully', { id: toastId });
      } else {
        toast.error('Failed to rename design', { id: toastId });
        setName(initialName); // Revert on failure
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error('An error occurred while renaming', { id: toastId });
      setName(initialName); // Revert on failure
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setName(initialName);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={handleNameChange}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="rounded-md border border-blue-300 bg-white px-2 py-1 text-sm font-medium text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200/50"
      title="Double-click to rename"
    >
      {name}
    </div>
  );
}
