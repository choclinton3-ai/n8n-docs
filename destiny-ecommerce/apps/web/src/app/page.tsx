import React from 'react'
import HeroSection from '@/components/home/HeroSection'
import CategoriesSection from '@/components/home/CategoriesSection'
import ProductSection from '@/components/home/ProductSection'
import FlashSaleSection from '@/components/home/FlashSaleSection'
import TrustSection from '@/components/home/TrustSection'
import BrandsSection from '@/components/home/BrandsSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import PromoSection from '@/components/home/PromoSection'
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} from '@/lib/data/products'

export default function HomePage() {
  const featured = getFeaturedProducts()
  const newArrivals = getNewArrivals()
  const bestSellers = getBestSellers()

  return (
    <>
      {/* Hero Slider */}
      <HeroSection />

      {/* Features Strip */}
      <TrustSection />

      {/* Shop by Category */}
      <CategoriesSection />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Just Landed"
        products={newArrivals}
        viewAllLink="/shop?filter=new"
        columns={4}
      />

      {/* Flash Sale */}
      <FlashSaleSection />

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        subtitle="Editor's Choice"
        products={featured}
        viewAllLink="/shop?filter=featured"
        accent={true}
        columns={4}
      />

      {/* Promo Banners */}
      <PromoSection />

      {/* Best Sellers */}
      <ProductSection
        title="Best Sellers"
        subtitle="Most Popular"
        products={bestSellers}
        viewAllLink="/shop?filter=best-sellers"
        columns={5}
      />

      {/* Brands */}
      <BrandsSection />

      {/* Testimonials */}
      <TestimonialsSection />
    </>
  )
}
