import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import Providers from './providers'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Destiny E-Commerce — Your Success, Our Destiny',
    template: '%s | Destiny E-Commerce',
  },
  description: "Cameroon's #1 electronics marketplace. Shop the latest smartphones, laptops, TVs, headphones & more with fast delivery and secure payments.",
  keywords: ['electronics', 'Cameroon', 'smartphones', 'laptops', 'Samsung', 'Apple', 'Tecno', 'e-commerce', 'Douala', 'Yaoundé'],
  authors: [{ name: 'Destiny E-Commerce' }],
  creator: 'Destiny E-Commerce',
  openGraph: {
    type: 'website',
    locale: 'en_CM',
    url: 'https://destinyecommerce.cm',
    title: 'Destiny E-Commerce — Your Success, Our Destiny',
    description: "Cameroon's #1 electronics marketplace",
    siteName: 'Destiny E-Commerce',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Destiny E-Commerce',
    description: "Cameroon's #1 electronics marketplace",
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#FF007F',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased bg-white text-gray-900">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif' },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
