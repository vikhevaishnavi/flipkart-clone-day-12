import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export function FloatingCart() {
  const cart = useStore((state) => state.cart);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      to="/cart"
      className="fixed bottom-4 right-4 bg-[#2874f0] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors group"
    >
      <div className="relative">
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {totalItems > 0 ? `${totalItems} items in cart` : 'Cart is empty'}
        </div>
      </div>
    </Link>
  );
}