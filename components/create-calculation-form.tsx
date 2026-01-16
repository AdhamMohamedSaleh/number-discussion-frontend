'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CreateCalculationFormProps {
  onSuccess: () => void;
}

interface FormData {
  value: string;
}

export function CreateCalculationForm({ onSuccess }: CreateCalculationFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const numValue = parseFloat(data.value);
    if (isNaN(numValue)) {
      toast.error('Invalid number');
      return;
    }

    try {
      await api.createCalculation({ value: numValue });
      toast.success('Discussion started!', {
        description: `Started with number ${numValue}`,
      });
      reset();
      onSuccess();
    } catch (err) {
      toast.error('Failed to create discussion', {
        description: err instanceof Error ? err.message : 'An error occurred',
      });
    }
  };

  return (
    <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <CardHeader>
        <CardTitle className="text-base">Start a New Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="Enter a starting number"
              step="any"
              {...register('value', {
                required: 'A number is required',
              })}
            />
            {errors.value && (
              <p className="text-sm text-destructive mt-1">{errors.value.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Start'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
