'use client';

import { Check, Edit, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const EditableName = ({ name, onSave }: { name: string; onSave: (newName: string) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedName.trim()) {
      onSave(editedName);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedName(name);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center">
      {isEditing
        ? (
            <div className="flex items-center gap-1">
              <Input
                value={editedName}
                onChange={e => setEditedName(e.target.value)}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="h-8 max-w-[180px] py-1 text-xs"
              />
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-green-600 hover:bg-green-50 hover:text-green-700"
                onClick={handleSave}
              >
                <Check className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={handleCancel}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          )
        : (
            <div className="flex items-center">
              <h4 className="font-medium text-gray-900 dark:text-white ">
                {name}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 size-6 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="size-3.5" />
              </Button>
            </div>
          )}
    </div>
  );
};
