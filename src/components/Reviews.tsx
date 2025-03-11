import { useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export function Reviews({ reviews, averageRating, totalReviews }: ReviewsProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);

  const filteredReviews = selectedRating
    ? reviews.filter(review => review.rating === selectedRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'helpful':
        return (b.helpfulCount || 0) - (a.helpfulCount || 0);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const ratingCounts = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const aspectRatings = {
    camera: 4.2,
    battery: 4.2,
    display: 4.4,
    design: 4.3
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Ratings & Reviews</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-baseline gap-4 mb-6">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={`${
                        star <= Math.round(averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {totalReviews.toLocaleString()} ratings
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  className={`w-full flex items-center gap-2 p-2 rounded hover:bg-gray-50 ${
                    selectedRating === rating ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="w-12 text-sm">{rating}★</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2874f0]"
                      style={{
                        width: `${((ratingCounts[rating] || 0) / totalReviews) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="w-16 text-sm text-right text-gray-500">
                    {ratingCounts[rating]?.toLocaleString() || 0}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(aspectRatings).map(([aspect, rating]) => (
                <div key={aspect} className="text-center p-3 border rounded-lg">
                  <div className="font-medium capitalize mb-1">{aspect}</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-semibold">{rating}</span>
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {selectedRating 
                  ? `${ratingCounts[selectedRating]} Reviews with ${selectedRating} Stars`
                  : 'All Reviews'
                }
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="border rounded-md p-2"
              >
                <option value="recent">Most Recent</option>
                <option value="helpful">Most Helpful</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            <div className="space-y-6">
              {sortedReviews.map((review) => (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-[#2874f0] text-white px-2 py-1 rounded flex items-center gap-1">
                      <span>{review.rating}</span>
                      <Star size={14} fill="white" />
                    </div>
                    <span className="font-medium">{review.userName}</span>
                    <span className="text-gray-500">
                      • {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-4 mb-4">
                      {review.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Review photo ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90"
                        />
                      ))}
                    </div>
                  )}

                  {review.aspectRatings && Object.keys(review.aspectRatings).length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                      {Object.entries(review.aspectRatings).map(([aspect, rating]) => (
                        <div key={aspect} className="flex items-center gap-1 text-sm text-gray-600">
                          <span className="capitalize">{aspect}:</span>
                          <span className="font-medium">{rating}</span>
                          <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      <ThumbsUp size={16} />
                      Helpful ({review.helpfulCount || 0})
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      <MessageCircle size={16} />
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}