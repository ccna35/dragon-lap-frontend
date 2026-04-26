'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api-client';
import { Category } from '@/types/api';
import { 
  LayoutGrid, 
  Plus, 
  Loader2, 
  AlertCircle, 
  Edit2, 
  Trash2, 
  X,
  Save,
  ArrowLeft
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(160),
  description: z.string().max(500).optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const res = await api.get<Category[]>('/admin/categories');
      return res.data;
    }
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      if (editingId) {
        return api.patch(`/admin/categories/${editingId}`, data);
      }
      return api.post('/admin/categories', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      cancelEdit();
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Operation failed');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    }
  });

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setIsAdding(false);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
  };

  const startAdd = () => {
    setEditingId(null);
    setIsAdding(true);
    reset({
      name: '',
      slug: '',
      description: '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setError(null);
    reset();
  };

  const onSubmit = (data: CategoryFormValues) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0057D9]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-2">
            <Link href="/admin" className="hover:text-[#0057D9] transition-colors">Admin</Link>
            <span>/</span>
            <span className="font-medium text-[#111113]">Categories</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#111113] flex items-center gap-3">
            <LayoutGrid className="h-8 w-8 text-[#0057D9]" />
            Category Management
          </h1>
        </div>
        {!isAdding && !editingId && (
          <button 
            onClick={startAdd}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add New Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List Column */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB] text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4 hidden md:table-cell">Description</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {categories?.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#111113]">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs text-[#0057D9] bg-[#EEF4FF] px-1.5 py-0.5 rounded">{cat.slug}</code>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-xs text-[#6B7280] line-clamp-1">{cat.description || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => startEdit(cat)}
                          className="p-1.5 text-[#6B7280] hover:text-[#0057D9] hover:bg-[#EEF4FF] rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this category? Products in this category will become uncategorized.')) {
                              deleteMutation.mutate(cat.id);
                            }
                          }}
                          className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!categories?.length && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-sm text-[#9CA3AF]">
                      No categories found. Click "Add New Category" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-1">
          {(isAdding || editingId) ? (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 sticky top-8 shadow-md border-t-4 border-t-[#0057D9]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#111113]">
                  {editingId ? 'Edit Category' : 'New Category'}
                </h2>
                <button onClick={cancelEdit} className="text-[#9CA3AF] hover:text-[#111113]">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label">Category Name</label>
                  <input 
                    {...register('name')}
                    onChange={(e) => {
                      register('name').onChange(e);
                      if (!editingId) {
                        setValue('slug', e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''));
                      }
                    }}
                    className="input-field" 
                    placeholder="e.g. Gaming Laptops" 
                  />
                  {errors.name && <p className="mt-1 text-[10px] text-red-600 font-medium">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label">URL Slug</label>
                  <input {...register('slug')} className="input-field font-mono text-xs" placeholder="gaming-laptops" />
                  {errors.slug && <p className="mt-1 text-[10px] text-red-600 font-medium">{errors.slug.message}</p>}
                </div>

                <div>
                  <label className="label">Description (Optional)</label>
                  <textarea 
                    {...register('description')} 
                    className="input-field min-h-[100px] resize-none" 
                    placeholder="Briefly describe this category..." 
                  />
                  {errors.description && <p className="mt-1 text-[10px] text-red-600 font-medium">{errors.description.message}</p>}
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={mutation.isPending}
                    className="btn-primary flex-1 py-2 text-xs"
                  >
                    {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {editingId ? 'Save Changes' : 'Create Category'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="btn-secondary py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-[#E5E7EB] p-8 text-center bg-[#F9FAFB]/50">
              <LayoutGrid className="mx-auto h-12 w-12 text-[#D1D5DB] mb-4" />
              <p className="text-sm font-medium text-[#6B7280]">Select a category to edit or create a new one to organize your inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
