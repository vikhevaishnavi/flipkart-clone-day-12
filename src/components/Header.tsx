import { Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { products } from '../data/products';

export function Header() {
  const navigate = useNavigate();
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-[#2874f0] text-white py-2.5 px-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Flipkart</span>
          <span className="text-xs italic">Explore Plus</span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="w-full py-2 px-4 rounded-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-gray-600"
            >
              <Search size={20} />
            </button>
          </div>
        </form>

        <nav className="flex items-center space-x-8">
          <Link to="/wishlist" className="flex items-center space-x-1 hover:text-gray-200">
            <Heart size={20} />
            <span>{wishlist.length > 0 && `(${wishlist.length})`}</span>
          </Link>
          
          <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-200">
            <ShoppingCart size={20} />
            <span>{cart.length > 0 && `(${cart.length})`}</span>
          </Link>
          
          <Link to="/account" className="flex items-center space-x-1 hover:text-gray-200">
            <User size={20} />
            <span>Login</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}