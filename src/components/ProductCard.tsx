import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist!');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const isWishlisted = isInWishlist(product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain transform transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50"
        >
          <Heart
            className={`${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'} hover:text-red-500 transition-colors`}
            size={20}
          />
        </button>
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center bg-green-100 px-2 py-1 rounded">
            <span className="text-sm font-medium text-green-800">{product.rating}★</span>
          </div>
        </div>

        {product.stock <= 5 && product.stock > 0 && (
          <p className="text-sm text-orange-600">Only {product.stock} left!</p>
        )}
        {product.stock === 0 && (
          <p className="text-sm text-red-600">Out of stock</p>
        )}
      </div>
    </Link>
  );
}