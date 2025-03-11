import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Reviews } from '../components/Reviews';
import { ReviewForm } from '../components/ReviewForm';
import toast from 'react-hot-toast';
import { products } from '../data/products';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { 
    addToCart, 
    addToWishlist,
    getProductReviews,
    getProductRating
  } = useStore();

  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:underline flex items-center justify-center gap-2"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  const reviews = getProductReviews(product.id);
  const { average: averageRating, total: totalReviews } = getProductRating(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    toast.success('Added to wishlist!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-lg shadow">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-contain"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded">
                <span>{averageRating.toFixed(1)}</span>
                <Star size={16} fill="white" />
              </div>
              <span className="text-gray-500">({totalReviews} reviews)</span>
            </div>
          </div>

          <div>
            <span className="text-4xl font-bold">₹{product.price}</span>
            {product.discount && (
              <div className="mt-2">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#2874f0] text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button
              onClick={handleAddToWishlist}
              className="flex-1 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Heart size={20} />
              Add to Wishlist
            </button>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-4 rounded">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <div className="font-medium">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-[#2874f0] text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Write a Review
          </button>
        </div>

        <Reviews
          reviews={reviews}
          averageRating={averageRating}
          totalReviews={totalReviews}
        />
      </div>

      {showReviewForm && (
        <ReviewForm
          productId={product.id}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}