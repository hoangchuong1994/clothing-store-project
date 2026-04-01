import { HeroSection } from '@/components/sections/HeroSection';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { FeaturedProductsSection } from '@/components/sections/FeaturedProductsSection';
import { NewArrivalsSection } from '@/components/sections/NewArrivalsSection';
import { PromotionBanner } from '@/components/sections/PromotionBanner';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';
import { Footer } from '@/components/sections/Footer';

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
    <main className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-slate-950 to-slate-900">
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
      <Footer />
    </main>
  );
}
