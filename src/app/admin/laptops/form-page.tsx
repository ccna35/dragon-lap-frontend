'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Laptop } from '@/types/api';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Loader2, 
  Image as ImageIcon,
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  Gamepad2,
  Settings,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const laptopSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  brand: z.string().min(2, 'Brand is required'),
  model: z.string().min(2, 'Model is required'),
  price: z.coerce.number().min(0, 'Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock must be non-negative'),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  cpu: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  gpu: z.string().optional(),
  screenSize: z.string().optional(),
  os: z.string().optional(),
  imageUrl: z.string().optional(),
  isPublished: z.boolean().default(true),
});

type LaptopFormValues = z.infer<typeof laptopSchema>;

export default function LaptopFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: laptop, isLoading: isFetching } = useQuery({
    queryKey: ['admin-laptop', id],
    queryFn: async () => {
      const res = await api.get<Laptop>(`/admin/laptops/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LaptopFormValues>({
    resolver: zodResolver(laptopSchema) as any,
    defaultValues: {
      isPublished: true,
      price: 0,
      stock: 0,
      title: '',
      brand: '',
      model: '',
    }
  });

  useEffect(() => {
    if (laptop) {
      reset({
        ...laptop,
        price: parseFloat(laptop.price),
        shortDescription: laptop.shortDescription || '',
        description: laptop.description || '',
        cpu: laptop.cpu || '',
        ram: laptop.ram || '',
        storage: laptop.storage || '',
        gpu: laptop.gpu || '',
        screenSize: laptop.screenSize || '',
        os: laptop.os || '',
        imageUrl: laptop.imageUrl || '',
      });
    }
  }, [laptop, reset]);

  const mutation = useMutation({
    mutationFn: async (data: LaptopFormValues) => {
      if (isEdit) {
        return api.patch(`/admin/laptops/${id}`, data);
      } else {
        return api.post('/admin/laptops', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-laptops'] });
      router.push('/admin/laptops');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to save product.');
    }
  });

  const isPublished = watch('isPublished');

  if (isEdit && isFetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6 max-w-5xl">
        
        <Link href="/admin/laptops" className="mb-6 flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111113] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#111113]">
              {isEdit ? 'Edit Product' : 'Add Product'}
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {isEdit ? 'Update product details and stock' : 'Add a new product to the catalog'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <label className="flex items-center gap-2 text-sm text-[#374151] cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={isPublished}
                 onChange={(e) => setValue('isPublished', e.target.checked)}
                 className="rounded border-[#D1D5DB] text-[#0057D9] focus:ring-[#0057D9]"
               />
               Published
             </label>
             <button 
              onClick={handleSubmit((data) => mutation.mutate(data))}
              disabled={mutation.isPending}
              className="btn-primary"
             >
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isEdit ? 'Save Changes' : 'Create Product'}
             </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="mb-5 text-base font-semibold text-[#111113]">Basic Information</h2>
                <div className="space-y-4">
                   <div>
                      <label className="label">Product Name</label>
                      <input {...register('title')} className={cn("input-field", errors.title && "border-red-400")} placeholder="e.g. MacBook Pro 16" />
                      {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Brand</label>
                        <input {...register('brand')} className={cn("input-field", errors.brand && "border-red-400")} placeholder="Apple" />
                        {errors.brand && <p className="mt-1 text-xs text-red-600">{errors.brand.message}</p>}
                      </div>
                      <div>
                        <label className="label">Model</label>
                        <input {...register('model')} className={cn("input-field", errors.model && "border-red-400")} placeholder="M3 Max" />
                        {errors.model && <p className="mt-1 text-xs text-red-600">{errors.model.message}</p>}
                      </div>
                   </div>

                   <div>
                      <label className="label">Short Description</label>
                      <input {...register('shortDescription')} className="input-field" placeholder="Brief overview of the product..." />
                   </div>

                   <div>
                      <label className="label">Full Description</label>
                      <textarea {...register('description')} className="input-field min-h-[150px] resize-none py-3" placeholder="Detailed product description..." />
                   </div>
                </div>
             </div>

             <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="mb-5 text-base font-semibold text-[#111113]">Media</h2>
                <div>
                   <label className="label">Image URL</label>
                   <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                      <input {...register('imageUrl')} className="input-field pl-9" placeholder="https://example.com/image.jpg" />
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="mb-5 text-base font-semibold text-[#111113]">Pricing & Inventory</h2>
                <div className="space-y-4">
                   <div>
                     <label className="label">Price (EGP)</label>
                     <input type="number" {...register('price')} className={cn("input-field", errors.price && "border-red-400")} placeholder="0.00" />
                     {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
                   </div>
                   <div>
                     <label className="label">Stock Quantity</label>
                     <input type="number" {...register('stock')} className={cn("input-field", errors.stock && "border-red-400")} placeholder="0" />
                     {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
                   </div>
                </div>
             </div>

             <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
                <h2 className="mb-5 text-base font-semibold text-[#111113]">Specifications</h2>
                <div className="space-y-4">
                   <div>
                     <label className="label flex items-center gap-1.5"><Cpu className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> CPU</label>
                     <input {...register('cpu')} className="input-field" placeholder="M3 Max" />
                   </div>
                   <div>
                     <label className="label flex items-center gap-1.5"><Gamepad2 className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> GPU</label>
                     <input {...register('gpu')} className="input-field" placeholder="40-core GPU" />
                   </div>
                   <div>
                     <label className="label flex items-center gap-1.5"><MemoryStick className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> RAM</label>
                     <input {...register('ram')} className="input-field" placeholder="48GB Unified" />
                   </div>
                   <div>
                     <label className="label flex items-center gap-1.5"><HardDrive className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> Storage</label>
                     <input {...register('storage')} className="input-field" placeholder="1TB SSD" />
                   </div>
                   <div>
                     <label className="label flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> Screen</label>
                     <input {...register('screenSize')} className="input-field" placeholder="16.2-inch Liquid Retina" />
                   </div>
                   <div>
                     <label className="label flex items-center gap-1.5"><Settings className="h-3.5 w-3.5 text-[#0057D9] shrink-0" /> OS</label>
                     <input {...register('os')} className="input-field" placeholder="macOS Sonoma" />
                   </div>
                </div>
             </div>
          </div>

        </form>
      </div>
    </div>
  );
}
