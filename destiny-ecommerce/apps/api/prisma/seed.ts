import { PrismaClient, UserRole, VendorStatus, CouponType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Destiny E-Commerce database...')

  // ===================== SEED USERS =====================
  const adminPassword = await bcrypt.hash('Admin@Destiny2024', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@destinyecommerce.cm' },
    update: {},
    create: {
      email: 'admin@destinyecommerce.cm',
      firstName: 'Destiny',
      lastName: 'Admin',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      emailVerified: true,
    },
  })

  const customerPassword = await bcrypt.hash('Customer@123', 12)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.cm' },
    update: {},
    create: {
      email: 'customer@test.cm',
      firstName: 'Amara',
      lastName: 'Ngoh',
      phone: '+237650000001',
      password: customerPassword,
      role: UserRole.CUSTOMER,
      emailVerified: true,
    },
  })

  console.log('✅ Users seeded')

  // ===================== SEED CATEGORIES =====================
  const categories = [
    { name: 'Smartphones', slug: 'smartphones', icon: '📱', description: 'Latest smartphones from top brands' },
    { name: 'Laptops', slug: 'laptops', icon: '💻', description: 'Powerful laptops for work and gaming' },
    { name: 'Tablets', slug: 'tablets', icon: '📟', description: 'Portable tablets for every need' },
    { name: 'Smart TVs', slug: 'smart-tvs', icon: '📺', description: 'Premium smart TVs for entertainment' },
    { name: 'Headphones', slug: 'headphones', icon: '🎧', description: 'Premium audio experience' },
    { name: 'Smart Watches', slug: 'smart-watches', icon: '⌚', description: 'Stylish smart watches' },
    { name: 'Cameras', slug: 'cameras', icon: '📷', description: 'Capture your best moments' },
    { name: 'Gaming', slug: 'gaming', icon: '🎮', description: 'Gaming consoles and accessories' },
    { name: 'Home Appliances', slug: 'home-appliances', icon: '🏠', description: 'Smart home appliances' },
    { name: 'Accessories', slug: 'accessories', icon: '🔌', description: 'Tech accessories' },
    { name: 'Speakers', slug: 'speakers', icon: '🔊', description: 'Portable and home speakers' },
    { name: 'Power Banks', slug: 'power-banks', icon: '🔋', description: 'Power banks and chargers' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    })
  }
  console.log('✅ Categories seeded')

  // ===================== SEED BRANDS =====================
  const brands = [
    { name: 'Samsung', slug: 'samsung', country: 'South Korea' },
    { name: 'Apple', slug: 'apple', country: 'USA' },
    { name: 'Tecno', slug: 'tecno', country: 'China/Africa' },
    { name: 'Infinix', slug: 'infinix', country: 'China/Africa' },
    { name: 'Xiaomi', slug: 'xiaomi', country: 'China' },
    { name: 'Huawei', slug: 'huawei', country: 'China' },
    { name: 'Sony', slug: 'sony', country: 'Japan' },
    { name: 'LG', slug: 'lg', country: 'South Korea' },
    { name: 'Dell', slug: 'dell', country: 'USA' },
    { name: 'Anker', slug: 'anker', country: 'USA' },
    { name: 'JBL', slug: 'jbl', country: 'USA' },
    { name: 'DJI', slug: 'dji', country: 'China' },
  ]

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: { ...brand, isActive: true },
    })
  }
  console.log('✅ Brands seeded')

  // ===================== SEED COUPONS =====================
  const coupons = [
    { code: 'DESTINY10', type: CouponType.PERCENTAGE, value: 10, minOrder: 30000, usageLimit: 1000, description: '10% off on all orders' },
    { code: 'WELCOME20', type: CouponType.PERCENTAGE, value: 20, minOrder: 50000, usageLimit: 500, description: '20% off for new customers' },
    { code: 'FLASH15', type: CouponType.PERCENTAGE, value: 15, minOrder: 25000, usageLimit: 200, description: '15% off flash sale' },
    { code: 'AFRICA25', type: CouponType.PERCENTAGE, value: 25, minOrder: 100000, usageLimit: 100, maxDiscount: 50000, description: '25% off (max 50,000 FCFA)' },
    { code: 'FREESHIP', type: CouponType.FREE_SHIPPING, value: 0, minOrder: 20000, usageLimit: 500, description: 'Free shipping on any order' },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        isActive: true,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    })
  }
  console.log('✅ Coupons seeded')

  // ===================== SEED BANNERS =====================
  const banners = [
    {
      title: 'New Arrivals 2024',
      subtitle: 'Discover the Latest Trends',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
      link: '/shop?filter=new',
      buttonText: 'Shop Now',
      position: 'hero',
      isActive: true,
      sortOrder: 1,
    },
    {
      title: 'Flash Sale — Up to 50% OFF',
      subtitle: 'Limited Time Deals',
      image: 'https://images.unsplash.com/photo-1611186871525-18547cdacd4f?w=1200',
      link: '/shop?filter=flash-sale',
      buttonText: 'Grab Deals',
      position: 'hero',
      isActive: true,
      sortOrder: 2,
    },
  ]

  for (const banner of banners) {
    await prisma.banner.create({ data: banner }).catch(() => {})
  }
  console.log('✅ Banners seeded')

  console.log('🎉 Destiny E-Commerce database seeded successfully!')
  console.log('')
  console.log('📧 Admin login: admin@destinyecommerce.cm / Admin@Destiny2024')
  console.log('📧 Customer login: customer@test.cm / Customer@123')
  console.log('🎫 Coupons: DESTINY10, WELCOME20, FLASH15, AFRICA25, FREESHIP')
}

main()
  .catch(e => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
