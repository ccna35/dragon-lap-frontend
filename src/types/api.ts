export type Role = 'ADMIN' | 'CUSTOMER';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD';

export type LaptopImageKind = 'FEATURED' | 'GALLERY';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LaptopImage {
  id: string;
  kind: LaptopImageKind;
  url: string;
  publicId: string;
  position: number;
}

export interface Laptop {
  id: string;
  title: string;
  slug: string;
  brand: string;
  model: string;
  price: string; // decimal string
  stock: number;
  shortDescription?: string | null;
  description?: string | null;
  cpu?: string | null;
  ram?: string | null;
  storage?: string | null;
  gpu?: string | null;
  screenSize?: string | null;
  os?: string | null;
  categoryId?: string | null;
  category?: Category | null;
  featuredImage?: LaptopImage | null;
  galleryImages: LaptopImage[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// Image Upload DTOs
export interface SignLaptopImagesDto {
  slots?: ('featured' | 'gallery_1' | 'gallery_2' | 'gallery_3')[];
}

export interface CloudinarySignature {
  slot: string;
  uploadUrl: string;
  cloudName: string;
  apiKey: string;
  folder: string;
  publicId: string;
  timestamp: number;
  signature: string;
}

export interface SignedUploadResponse {
  laptopId: string;
  signatures: CloudinarySignature[];
}

export interface LaptopImageInputDto {
  url: string;
  publicId: string;
}

export interface SetLaptopImagesDto {
  featured: LaptopImageInputDto;
  gallery: LaptopImageInputDto[];
}

export interface UserPublic {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserLoginView {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface CartItemWithLaptop {
  id: string;
  userId: string;
  laptopId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  laptop: Laptop;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  fullName: string;
  phone: string;
  alternatePhone?: string | null;
  city: string;
  area: string;
  streetAddress: string;
  notes?: string | null;
  subtotal: string;
  shippingFee: string;
  total: string;
  placedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  laptopId?: string | null;
  laptopTitleSnapshot: string;
  unitPriceSnapshot: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderWithItemsAndUser extends OrderWithItems {
  user: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
}

export interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface AdminStats {
  totalRevenue: string;
  ordersCount: number;
  customersCount: number;
  lowStockCount: number;
  salesHistory: {
    date: string;
    amount: string;
  }[];
  recentOrders: OrderWithItemsAndUser[];
}
