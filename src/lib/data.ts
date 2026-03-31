// Mock data for the e-commerce store

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating?: number;
  reviews?: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Hoodies',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    slug: 'hoodies',
  },
  {
    id: '2',
    name: 'T-Shirts',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    slug: 'tshirts',
  },
  {
    id: '3',
    name: 'Pants',
    image:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80',
    slug: 'pants',
  },
  {
    id: '4',
    name: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    slug: 'accessories',
  },
];

export const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Cyber Oversized Hoodie',
    price: 89.99,
    originalPrice: 129.99,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'Hoodies',
    badge: 'SALE',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Neon Grid T-Shirt',
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    category: 'T-Shirts',
    badge: 'NEW',
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Streetwear Cargo Pants',
    price: 99.99,
    originalPrice: 149.99,
    image:
      'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=600&q=80',
    category: 'Pants',
    badge: 'HOT',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '4',
    name: 'Premium Snapback Cap',
    price: 39.99,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: 4.6,
    reviews: 73,
  },
];

export const newArrivals: Product[] = [
  {
    id: '5',
    name: 'Limited Edition Jersey',
    price: 129.99,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    category: 'T-Shirts',
    badge: 'LIMITED',
    rating: 5.0,
    reviews: 32,
  },
  {
    id: '6',
    name: 'Techwear Jacket',
    price: 199.99,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
    category: 'Outerwear',
    badge: 'NEW',
    rating: 4.9,
    reviews: 45,
  },
  {
    id: '7',
    name: 'Vintage Denim',
    price: 119.99,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80',
    category: 'Pants',
    badge: 'TRENDING',
    rating: 4.8,
    reviews: 67,
  },
  {
    id: '8',
    name: 'Cyber Backpack',
    price: 159.99,
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    category: 'Accessories',
    rating: 4.7,
    reviews: 54,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    author: 'Alex Chen',
    role: 'Fashion Influencer',
    content:
      'The quality and design are insane. Every piece hits different. This is THE brand for Gen Z.',
    rating: 5,
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
  },
  {
    id: '2',
    author: 'Jordan Smith',
    role: 'Streetwear Enthusiast',
    content:
      'Finally a brand that gets the streetwear culture. The attention to detail is unmatched.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  },
  {
    id: '3',
    author: 'Taylor Williams',
    role: 'Student',
    content: 'Affordable pricing with premium quality. Been waiting for a brand like this forever!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
  },
];
