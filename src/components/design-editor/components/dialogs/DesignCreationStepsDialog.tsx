'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { DESIGN_EDITOR_CONFIG } from '@/components/design-editor/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { designService } from '@/services/designService';
import { createClient } from '@/utils/supabase/client';

// Form validation schema
const designFormSchema = z.object({
  name: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

type DesignFormValues = z.infer<typeof designFormSchema>;

type DesignCreationStepsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  designTypeName: string;
  onComplete: (designId: string) => void;
};

export function DesignCreationStepsDialog({
  open,
  onOpenChange,
  locale,
  designTypeName,
  onComplete,
}: DesignCreationStepsDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [step]);

  // Initialize form
  const form = useForm<DesignFormValues>({
    resolver: zodResolver(designFormSchema),
    defaultValues: {
      name: `New ${designTypeName}`,
      description: '',
    },
  });

  const nextStep = (e?: React.MouseEvent) => {
    // Prevent default form submission if event is provided
    if (e) {
      e.preventDefault();
    }

    if (step === 1) {
      const nameResult = form.trigger('name');
      if (!nameResult) {
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const onSubmit = async (data: DesignFormValues) => {
    setIsSubmitting(true);

    try {
      // Get the current user
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('You must be logged in to create designs');
        router.push(`/${locale}/sign-in`);
        return;
      }

      // Generate a UUID for the new design
      const designId = crypto.randomUUID();

      // Create the design in Supabase
      const newDesign = await designService.createDesign({
        id: designId,
        user_id: user.id,
        name: data.name,
        description: data.description,
        canvas_data: {
          canvasJSON: { objects: [] },
          width: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.WIDTH,
          height: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.HEIGHT,
          backgroundColor: DESIGN_EDITOR_CONFIG.DEFAULT_CANVAS.BACKGROUND_COLOR,
        },
        preview_url: null,
        is_template: false,
        is_public: false,
      });

      if (newDesign) {
        toast.success('Design created successfully');
        onComplete(designId);
      } else {
        toast.error('Failed to create design');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error creating design:', error);
      toast.error('Error creating design');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl overflow-hidden border-none bg-gradient-to-br from-white via-slate-50 to-blue-50 p-0 shadow-2xl">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 size-80 rounded-full bg-blue-100/70 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-indigo-100/70 blur-3xl"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(99,102,241,0.1)_1px,transparent_0)] [background-size:20px_20px]"></div>
            </div>

            <div className="relative z-10 px-8 py-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-center text-3xl font-bold text-gray-900">
                  {step === 1 ? 'Name Your Design' : 'Add a Description'}
                </DialogTitle>
                <DialogDescription className="mx-auto max-w-xl text-center text-base text-gray-600">
                  {step === 1
                    ? 'Give your design a meaningful name'
                    : 'Add a description to help you remember what this design is for'}
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={(e) => {
                    if (step !== 2) {
                      e.preventDefault();
                      return;
                    }
                    form.handleSubmit(onSubmit)(e);
                  }}
                  className="space-y-6"
                >
                  {/* Step 1: Name */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a title for your design"
                                {...field}
                                className="h-12 text-lg"
                                ref={inputRef}
                              />
                            </FormControl>
                            <FormDescription>
                              This will be displayed as the title of your design
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Step 2: Description */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="Enter a description for your design..."
                                  className="h-32 resize-none"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Add a description to help you remember what this design is for.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => (step === 1 ? onOpenChange(false) : prevStep())}
                      disabled={isSubmitting}
                    >
                      {step === 1 ? 'Cancel' : 'Back'}
                    </Button>

                    {step < 2
                      ? (
                          <Button
                            type="button"
                            onClick={e => nextStep(e)}
                          >
                            Next
                            <ChevronRight className="ml-1 size-4" />
                          </Button>
                        )
                      : (
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                              ? (
                                  <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Creating...
                                  </>
                                )
                              : (
                                  'Create Design'
                                )}
                          </Button>
                        )}
                  </div>
                </form>
              </Form>

              {/* Step indicator */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {[1, 2].map(s => (
                    <div
                      key={s}
                      className={`flex size-8 items-center justify-center rounded-full ${
                        s === step
                          ? 'bg-blue-500 text-white'
                          : s < step
                            ? 'bg-blue-100 text-blue-500'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {s < step ? <Check className="size-4" /> : s}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
