'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ImageIcon, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { DesignCreationStepsDialog } from '@/components/design-editor/components/dialogs/DesignCreationStepsDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@/utils/supabase/client';

type DesignType = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  path: (locale: string, designId?: string) => string;
};

const DESIGN_TYPES: DesignType[] = [
  {
    id: 'blank',
    title: 'Blank Design',
    description: 'Start with a blank canvas and unleash your creativity',
    icon: <Plus className="size-10" />,
    color: 'text-blue-500',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-blue-600',
    path: (locale, designId) => `/${locale}/design/${designId}`,
  },
  {
    id: 'image-to-qr',
    title: 'Image to QR',
    description: 'Transform your images into interactive QR codes',
    icon: <ImageIcon className="size-10" />,
    color: 'text-purple-500',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-red-600',
    comingSoon: true,
    path: (locale, designId) => `/${locale}/design/image-to-qr/${designId}`,
  },
  // {
  //   id: 'pdf-to-qr',
  //   title: 'PDF to QR',
  //   description: 'Convert your PDF documents into scannable QR codes',
  //   icon: <FileText className="size-10" />,
  //   color: 'text-red-500',
  //   gradientFrom: 'from-red-500',
  //   gradientTo: 'to-red-600',
  //   comingSoon: true,
  //   path: locale => `/${locale}/design`,
  // },
  // {
  //   id: 'wifi-to-qr',
  //   title: 'WiFi to QR',
  //   description: 'Generate QR codes for instant WiFi access',
  //   icon: <Wifi className="size-10" />,
  //   color: 'text-green-500',
  //   gradientFrom: 'from-green-500',
  //   gradientTo: 'to-green-600',
  //   comingSoon: true,
  //   path: locale => `/${locale}/design`,
  // },
];

type DesignTypeCardProps = {
  type: DesignType;
  onClick: () => void;
  index: number;
};

function DesignTypeCard({ type, onClick, index }: DesignTypeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br ${type.gradientFrom} ${type.gradientTo} shadow-xl transition-all duration-300 ${
        type.comingSoon ? 'opacity-80' : ''
      }`}
      onClick={type.comingSoon ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-white/90 transition-opacity duration-300" />

      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${type.gradientFrom} ${type.gradientTo}`} />
        <div className={`absolute -bottom-10 -left-10 size-32 rounded-full bg-gradient-to-tl ${type.gradientFrom} ${type.gradientTo} opacity-50`} />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center p-6">
        <motion.div
          className={`mb-5 flex size-20 items-center justify-center rounded-xl ${type.color} bg-white shadow-lg`}
          initial={{ scale: 1 }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {type.icon}
        </motion.div>

        <motion.h3
          className={`mb-2 text-xl font-bold ${type.color}`}
          initial={{ y: 0 }}
          animate={{ y: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {type.title}
        </motion.h3>

        <motion.p
          className="text-center text-sm text-gray-600"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {type.description}
        </motion.p>

        {type.comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
            <div className={`rounded-full bg-gradient-to-r ${type.gradientFrom} ${type.gradientTo} px-4 py-2 text-sm font-medium text-white shadow-lg`}>
              Coming Soon
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

type DesignTypeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
};

export function DesignTypeDialog({ open, onOpenChange, locale }: DesignTypeDialogProps) {
  const router = useRouter();
  const [selectedDesignType, setSelectedDesignType] = useState<DesignType | null>(null);
  const [creationDialogOpen, setCreationDialogOpen] = useState(false);

  const handleTypeSelect = (type: DesignType) => {
    if (type.comingSoon) {
      return;
    }

    setSelectedDesignType(type);
    setCreationDialogOpen(true);
  };

  const handleCreationComplete = (designId: string) => {
    if (selectedDesignType) {
      // Navigate to the appropriate design page
      router.push(selectedDesignType.path(locale, designId));
    }
  };

  // Check if user is logged in
  const checkUserAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in to create designs');
      router.push(`/${locale}/sign-in`);
      return false;
    }

    return true;
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-4xl overflow-hidden border-none bg-gradient-to-br from-white via-slate-50 to-blue-50 p-0 shadow-2xl">
            {/* Custom close button positioned correctly */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-4 top-4 z-20 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 size-80 rounded-full bg-blue-100/70 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-indigo-100/70 blur-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] [background-size:20px_20px]"></div>
            </div>

            <div className="relative z-10 px-8 py-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-center text-3xl font-bold text-gray-900">
                  Create Your Design
                </DialogTitle>
                <DialogDescription className="mx-auto max-w-xl text-center text-base text-gray-600">
                  Choose a design type to get started with your next creative project
                </DialogDescription>
              </DialogHeader>

              <motion.div
                className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {DESIGN_TYPES.map((type, index) => (
                  <DesignTypeCard
                    key={type.id}
                    type={type}
                    index={index}
                    onClick={async () => {
                      const isAuthenticated = await checkUserAuth();
                      if (isAuthenticated) {
                        handleTypeSelect(type);
                      }
                    }}
                  />
                ))}
              </motion.div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onOpenChange(false)}
                  className="text-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Design Creation Steps Dialog */}
      {selectedDesignType && (
        <DesignCreationStepsDialog
          key={selectedDesignType.id}
          open={creationDialogOpen}
          onOpenChange={setCreationDialogOpen}
          locale={locale}
          designTypeName={selectedDesignType.title}
          onComplete={handleCreationComplete}
        />
      )}
    </AnimatePresence>
  );
}
