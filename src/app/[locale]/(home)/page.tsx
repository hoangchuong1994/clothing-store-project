import { HeroSection } from '@/features/home/sections/HeroSection';
import { CategoriesSection } from '@/features/home/sections/CategoriesSection';
import { FeaturedProductsSection } from '@/features/home/sections/FeaturedProductsSection';
import { NewArrivalsSection } from '@/features/home/sections/NewArrivalsSection';
import { PromotionBanner } from '@/features/home/sections/PromotionBanner';
import { TestimonialsSection } from '@/features/home/sections/TestimonialsSection';
import { NewsletterSection } from '@/features/home/sections/NewsletterSection';

export const metadata = {
  title: 'Cyber Brand - Premium Streetwear x Cyber Fashion',
  description:
    'Streetwear meets cyber. Bold drops, limited pieces, infinite vibe. Shop exclusive Gen Z fashion.',
  keywords: [
    'streetwear',
    'cyberfashion',
    'genz',
    'clothing',
    'fashion',
    'limited edition',
    'cyber',
  ],
  openGraph: {
    title: 'Cyber Brand - Premium Streetwear x Cyber Fashion',
    description: 'Streetwear meets cyber. Bold drops, limited pieces, infinite vibe.',
    url: 'https://cyberbrand.com',
    siteName: 'Cyber Brand',
    type: 'website',
  },
};

export default function LocalePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* New Arrivals Section */}
      <NewArrivalsSection />

      {/* Promotion Banner */}
      <PromotionBanner />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Footer */}
    </>
  );
}
