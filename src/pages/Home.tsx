import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { products } from '../data/products';

const categories = [
  { name: "Electronics", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Furniture", icon: "🏠" },
  { name: "Beauty & Personal Care", icon: "✨" },
  { name: "Sports & Fitness", icon: "⚽" }
];

const banners = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1600&h=400&fit=crop",
    title: "Sale offers on flights",
    subtitle: "Fares From ₹1,199",
    cta: "Book now",
    code: "FLYFK",
    link: "/flight-bookings"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=400&fit=crop",
    title: "Premium Headphones",
    subtitle: "Up to 50% off",
    cta: "Shop Now",
    code: "AUDIO50",
    link: "/products?category=Electronics"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&h=400&fit=crop",
    title: "Smart Watches",
    subtitle: "Starting from ₹999",
    cta: "Explore",
    code: "WATCH999",
    link: "/products?category=Electronics"
  }
];

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4 space-x-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="flex flex-col items-center group"
              >
                <div className={`text-3xl p-4 rounded-full transition-colors ${
                  category.name === selectedCategory
                    ? 'bg-blue-100'
                    : 'group-hover:bg-gray-100'
                }`}>
                  {category.icon}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-800">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-lg h-[400px] group">
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="text-white ml-16 max-w-lg">
                  <h1 className="text-5xl font-bold mb-4">{banner.title}</h1>
                  <p className="text-2xl mb-6">{banner.subtitle}</p>
                  {banner.code && (
                    <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg inline-block mb-6">
                      <span className="text-lg">Use code: </span>
                      <span className="font-mono font-bold">{banner.code}</span>
                    </div>
                  )}
                  <Link
                    to={banner.link}
                    className="bg-[#2874f0] text-white px-8 py-3 rounded-lg inline-block hover:bg-blue-600 transition-colors"
                  >
                    {banner.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBanner === index
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Top Offers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Top Offers!</h2>
          <div className="flex items-center gap-4">
            <Link
              to="/products"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* Featured Electronics */}
      {(!selectedCategory || selectedCategory === 'Electronics') && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Electronics</h2>
            <Link
              to="/products?category=Electronics"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(product => product.category === 'Electronics')
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      )}

      {/* Fashion Collection */}
      {(!selectedCategory || selectedCategory === 'Fashion') && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Fashion Collection</h2>
            <Link
              to="/products?category=Fashion"
              className="text-blue-600 hover:underline text-sm"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products
              .filter(product => product.category === 'Fashion')
              .slice(0, 4)
              .map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}