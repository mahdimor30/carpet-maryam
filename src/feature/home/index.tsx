import { Hero } from './components/hero'
import { CategoryShowcase } from './components/category-showcase'
import { FeaturedProducts } from './components/featured-products'
import { ValueProps } from './components/value-props'
import { HowItWorks } from './components/how-it-works'
import { CustomOrder } from './components/custom-order'
import { ConsultationBanner } from './components/consultation-banner'
import { InstagramGallery } from './components/instagram-gallery'
import { Footer } from './components/footer'
import type { HomeCategory } from '@/feature/products/server/queries/get-home-categories'
import type { HomeProduct } from '@/feature/products/server/queries/get-home-products'

export default function HomePage({
  featuredProducts,
  galleryProducts,
  categories,
}: {
  featuredProducts: HomeProduct[]
  galleryProducts: HomeProduct[]
  categories: HomeCategory[]
}) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <CategoryShowcase categories={categories} />
        <FeaturedProducts products={featuredProducts} />
        <ValueProps />
        <HowItWorks />
        <CustomOrder />
        <ConsultationBanner />
        <InstagramGallery products={galleryProducts} />
      </main>

      <Footer />
    </div>
  )
}
