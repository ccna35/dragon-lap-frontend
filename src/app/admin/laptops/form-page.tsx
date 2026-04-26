'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Laptop, Category } from '@/types/api';
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
  AlertCircle,
  X,
  Upload,
  Plus,
  Tag,
  LayoutGrid
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import axios from 'axios';
import Image from 'next/image';
import { CloudinarySignature } from '@/types/api';

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
  categoryId: z.string().default(''),
  isPublished: z.boolean(),
});

type LaptopFormValues = z.infer<typeof laptopSchema>;

export default function LaptopFormPage({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || params?.id as string;
  const isEdit = !!id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Image states
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<{file: File, id: string, preview: string}[]>([]);
  const [existingFeatured, setExistingFeatured] = useState<{url: string, publicId: string} | null>(null);
  const [existingGallery, setExistingGallery] = useState<{url: string, publicId: string}[]>([]);

  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const { data: laptop, isLoading: isFetching, isError, error: fetchError } = useQuery({
    queryKey: ['admin-laptop', id],
    queryFn: async () => {
      const res = await api.get<any>(`/admin/laptops/${id}`);
      // Handle both { data: laptop } and direct laptop response
      const data = res.data?.data || res.data;
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid product data received from API');
      }
      return data as Laptop;
    },
    enabled: isEdit && !!id,
    retry: 1,
  });
  
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/categories');
      return res.data;
    }
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
      categoryId: '',
    }
  });

  useEffect(() => {
    return () => {
      if (featuredPreview) URL.revokeObjectURL(featuredPreview);
      galleryFiles.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [featuredPreview, galleryFiles]);

  useEffect(() => {
    if (laptop && Object.keys(laptop).length > 0) {
      console.log('Populating form with laptop data:', laptop);
      reset({
        title: laptop.title || '',
        brand: laptop.brand || '',
        model: laptop.model || '',
        price: laptop.price ? (typeof laptop.price === 'string' ? parseFloat(laptop.price) : laptop.price) : 0,
        stock: laptop.stock != null ? (typeof laptop.stock === 'number' ? laptop.stock : parseInt(laptop.stock as any) || 0) : 0,
        shortDescription: laptop.shortDescription || '',
        description: laptop.description || '',
        cpu: laptop.cpu || '',
        ram: laptop.ram || '',
        storage: laptop.storage || '',
        gpu: laptop.gpu || '',
        screenSize: laptop.screenSize || '',
        os: laptop.os || '',
        categoryId: laptop.categoryId || '',
        isPublished: !!laptop.isPublished,
      });

      if (laptop.featuredImage) {
        setExistingFeatured({
          url: laptop.featuredImage.url,
          publicId: laptop.featuredImage.publicId
        });
      }
      
      if (laptop.galleryImages && laptop.galleryImages.length > 0) {
        setExistingGallery(laptop.galleryImages.map(img => ({
          url: img.url,
          publicId: img.publicId
        })));
      }
    }
  }, [laptop, reset]);

  const handleFeaturedSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedFile(file);
      setFeaturedPreview(URL.createObjectURL(file));
      setExistingFeatured(null); // Clear existing if new one selected
    }
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - (galleryFiles.length + existingGallery.length);
    const toAdd = files.slice(0, remaining);
    
    const newItems = toAdd.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      preview: URL.createObjectURL(file)
    }));
    
    setGalleryFiles(prev => [...prev, ...newItems]);
  };

  const removeGalleryFile = (id: string) => {
    setGalleryFiles(prev => prev.filter(f => f.id !== id));
  };

  const removeExistingGallery = (publicId: string) => {
    setExistingGallery(prev => prev.filter(img => img.publicId !== publicId));
  };

  const uploadToCloudinary = async (file: File, signature: CloudinarySignature) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signature.apiKey);
    formData.append('timestamp', signature.timestamp.toString());
    formData.append('signature', signature.signature);
    formData.append('folder', signature.folder);
    formData.append('public_id', signature.publicId);

    const res = await axios.post(signature.uploadUrl, formData);
    return {
      url: res.data.secure_url,
      publicId: res.data.public_id
    };
  };

  const mutation = useMutation({
    onMutate: () => {
      setError(null);
      setUploading(true);
    },
    onSettled: () => setUploading(false),
    mutationFn: async (data: LaptopFormValues) => {
      // Use the actual ID from the fetched laptop data if editing, 
      // as the 'id' from the URL might be a slug.
      let effectiveId = isEdit ? laptop?.id : id;
      
      if (isEdit && !effectiveId) {
        throw new Error('Laptop ID not found. Please wait for data to load or refresh.');
      }
      
      // Step 1: Create or Update basic info
      if (isEdit) {
        await api.patch(`/admin/laptops/${effectiveId}`, data);
      } else {
        const res = await api.post('/admin/laptops', data);
        effectiveId = res.data?.data?.id || res.data?.id;
      }

      if (!effectiveId) throw new Error('Failed to get laptop ID');

      // Step 2: Handle Images
      const slots: ('featured' | 'gallery_1' | 'gallery_2' | 'gallery_3')[] = [];
      if (featuredFile) slots.push('featured');
      
      galleryFiles.forEach((_, idx) => {
        const slotIdx = existingGallery.length + idx + 1;
        if (slotIdx <= 3) {
          slots.push(`gallery_${slotIdx}` as any);
        }
      });

      if (slots.length > 0 || featuredFile || galleryFiles.length > 0 || existingFeatured || existingGallery.length >= 0) {
        let finalFeatured = existingFeatured;
        let finalGallery = [...existingGallery];

        if (slots.length > 0) {
          // Get signatures
          const sigRes = await api.post(`/admin/laptops/${effectiveId}/images/sign`, { slots });
          const signatures: CloudinarySignature[] = sigRes.data?.data?.signatures || sigRes.data?.signatures || [];

          // Upload new files
          if (featuredFile) {
            const sig = signatures.find(s => s.slot === 'featured');
            if (sig) {
              finalFeatured = await uploadToCloudinary(featuredFile, sig);
            }
          }

          for (let i = 0; i < galleryFiles.length; i++) {
            const slotName = `gallery_${existingGallery.length + i + 1}`;
            const sig = signatures.find(s => s.slot === slotName);
            if (sig) {
              const uploaded = await uploadToCloudinary(galleryFiles[i].file, sig);
              finalGallery.push(uploaded);
            }
          }
        }

        // Step 3: Attach images to laptop
        // The API expects featured and gallery. If featured is missing, we might have an issue 
        // based on the schema, but usually we should have at least one.
        if (finalFeatured) {
          await api.patch(`/admin/laptops/${effectiveId}/images`, {
            featured: finalFeatured,
            gallery: finalGallery.slice(0, 3)
          });
        }
      }

      return effectiveId;
    },
    onSuccess: (effectiveId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-laptops'] });
      queryClient.invalidateQueries({ queryKey: ['admin-laptop', effectiveId] });
      if (id && id !== effectiveId) {
        queryClient.invalidateQueries({ queryKey: ['admin-laptop', id] });
      }
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

  const onFormSubmit: SubmitHandler<LaptopFormValues> = (data) => mutation.mutate(data);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8 md:px-6 max-w-5xl">
        
        <Link href="/admin/laptops" className="mb-6 flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111113] transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to inventory
        </Link>

        <form 
          onSubmit={handleSubmit(onFormSubmit)}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Header */}
          <div className="lg:col-span-3 mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[#E5E7EB] bg-white p-6">
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
                   {...register('isPublished')}
                   className="rounded border-[#D1D5DB] text-[#0057D9] focus:ring-[#0057D9]"
                 />
                 Published
               </label>
               <button 
                type="submit"
                disabled={mutation.isPending || uploading}
                className="btn-primary"
               >
                  {mutation.isPending || uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isEdit ? 'Save Changes' : 'Create Product'}
               </button>
            </div>
          </div>

          {/* Debug Info (Only visible during development or when empty) */}
          {isEdit && !laptop && !isFetching && (
            <div className="lg:col-span-3 mb-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-[10px] font-mono text-amber-800">
              Debug: ID={id} | Status={isFetching ? 'Loading' : 'Idle'} | Data={laptop ? 'Found' : 'Missing'} | Error={isError ? 'Yes' : 'No'}
            </div>
          )}

          {error && (
            <div className="lg:col-span-3 mb-2 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {(isError || fetchError) && (
            <div className="lg:col-span-3 mb-2 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>Error loading product: {(fetchError as any)?.response?.data?.message || (fetchError as any)?.message || 'Unknown error'}</p>
            </div>
          )}
          
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
                      <label className="label flex items-center gap-1.5"><LayoutGrid className="h-3.5 w-3.5 text-[#0057D9]" /> Category</label>
                      <select 
                        {...register('categoryId')} 
                        className="input-field cursor-pointer bg-white"
                      >
                        <option value="">Uncategorized</option>
                        {categories?.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
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
                
                <div className="space-y-6">
                   {/* Featured Image */}
                   <div>
                      <label className="label">Featured Image</label>
                      <div 
                        onClick={() => featuredInputRef.current?.click()}
                        className={cn(
                          "relative aspect-video w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-all flex flex-col items-center justify-center gap-2",
                          (featuredPreview || existingFeatured) && "border-solid border-transparent"
                        )}
                      >
                        {(featuredPreview || existingFeatured) ? (
                          <>
                            <Image 
                              src={featuredPreview || existingFeatured!.url} 
                              alt="Featured Preview" 
                              fill 
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 gap-4">
                               <Upload className="h-8 w-8 text-white cursor-pointer" />
                               <button 
                                 type="button"
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setFeaturedFile(null);
                                   setFeaturedPreview(null);
                                   setExistingFeatured(null);
                                 }}
                                 className="rounded-full bg-white/20 p-2 text-white hover:bg-red-500 transition-colors"
                               >
                                 <X className="h-6 w-6" />
                               </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="rounded-full bg-[#E5E7EB] p-3 text-[#6B7280]">
                               <ImageIcon className="h-6 w-6" />
                            </div>
                            <p className="text-xs text-[#6B7280] font-medium">Click to upload featured image</p>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={featuredInputRef} 
                          onChange={handleFeaturedSelect} 
                          className="hidden" 
                          accept="image/*" 
                        />
                      </div>
                   </div>

                   {/* Gallery Images */}
                   <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="label mb-0">Gallery Images (Up to 3)</label>
                        <span className="text-[10px] text-[#6B7280] font-medium">
                          {galleryFiles.length + existingGallery.length}/3
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {/* Existing Gallery */}
                        {existingGallery.map((img) => (
                          <div key={img.publicId} className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image src={img.url} alt="Gallery" fill className="object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeExistingGallery(img.publicId)}
                              className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* New Gallery Files */}
                        {galleryFiles.map((item) => (
                          <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden group">
                            <Image src={item.preview} alt="Gallery Preview" fill className="object-cover" />
                            {uploading && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                              </div>
                            )}
                            <button 
                              type="button"
                              onClick={() => removeGalleryFile(item.id)}
                              className="absolute top-1 right-1 h-6 w-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}

                        {/* Add Slot */}
                        {galleryFiles.length + existingGallery.length < 3 && (
                          <div 
                            onClick={() => galleryInputRef.current?.click()}
                            className="aspect-square rounded-lg border-2 border-dashed border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] transition-all flex flex-col items-center justify-center cursor-pointer"
                          >
                             <Plus className="h-5 w-5 text-[#9CA3AF]" />
                             <input 
                              type="file" 
                              ref={galleryInputRef} 
                              onChange={handleGallerySelect} 
                              className="hidden" 
                              accept="image/*" 
                              multiple 
                             />
                          </div>
                        )}
                      </div>
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
