import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OrderConfirmation() {
  const navigate = useNavigate();
  const [isScratched, setIsScratched] = useState(false);
  const [reward] = useState('12 SuperCoins');

  useEffect(() => {
    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-8 text-center">
      <div className="bg-[#2874f0] text-white p-8 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-4">Order Placed</h1>
        <p className="text-xl mb-4">
          Total price for 3 items ₹365 + <span className="inline-flex items-center">⚡ 8</span>
        </p>
        <Link
          to="/orders"
          className="inline-flex items-center text-white hover:underline"
        >
          View Details <ChevronRight size={20} />
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
            <Gift size={40} className="text-yellow-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">You won a scratch card</h2>
        <p className="text-gray-600 mb-4">Tap to see what what you have won</p>
        
        <div 
          className={`relative w-48 h-24 mx-auto bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg cursor-pointer ${
            isScratched ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-500`}
          onClick={() => {
            setIsScratched(true);
            confetti({
              particleCount: 50,
              spread: 30,
              origin: { y: 0.7 }
            });
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white">Scratch here!</span>
          </div>
        </div>
        
        {isScratched && (
          <div className="mt-4 animate-fade-in">
            <p className="text-2xl font-bold text-blue-600 mb-2">
              Congratulations! 🎉
            </p>
            <p className="text-lg">You won {reward}!</p>
            <button
              className="mt-4 bg-[#2874f0] text-white px-6 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}