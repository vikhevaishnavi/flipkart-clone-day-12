import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Star, X, Filter } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const BRANDS = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);
const RATINGS = [4, 3, 2, 1];
const DISCOUNTS = ['10% or more', '20% or more', '30% or more', '40% or more', '50% or more'];

export function AllProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(true);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Load initial filters from URL
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) {
      setSelectedCategories([category]);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Check if any filters are applied
  useEffect(() => {
    setIsFiltersApplied(
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      selectedRatings.length > 0 ||
      selectedDiscounts.length > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 500000 ||
      !includeOutOfStock ||
      sortBy !== 'popularity'
    );
  }, [selectedCategories, selectedBrands, selectedRatings, selectedDiscounts, priceRange, includeOutOfStock, sortBy]);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchQuery
        ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));
      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating));
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = includeOutOfStock || product.stock > 0;
      const matchesDiscount = selectedDiscounts.length === 0 || 
        selectedDiscounts.some(discount => {
          const percentage = parseInt(discount);
          return (product.discount || 0) >= percentage;
        });

      return matchesSearch && matchesCategory && matchesBrand && matchesRating && matchesPrice && matchesStock && matchesDiscount;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        case 'popularity':
        default:
          return b.rating * b.stock - a.rating * a.stock;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setSelectedDiscounts([]);
    setPriceRange([0, 500000]);
    setIncludeOutOfStock(true);
    setSortBy('popularity');
    setCurrentPage(1);
    setSearchQuery('');
    setSearchParams({});
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setShowFilters(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {selectedCategories.length === 1 
              ? selectedCategories[0]
              : searchQuery 
                ? `Search Results for "${searchQuery}"`
                : "All Products"}
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} products found
          </p>
        </div>
        <div className="flex gap-4">
          {isFiltersApplied && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 text-red-600"
            >
              <X size={20} />
              Reset Filters
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow hover:bg-opacity-90 transition-colors ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            <Filter size={20} />
            Filters
            {isFiltersApplied && (
              <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white p-4 rounded-lg shadow space-y-6">
            <div>
              <h3 className="font-medium mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full border rounded-md p-2"
              >
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full border rounded-md p-2"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full border rounded-md p-2"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => {
                        setSelectedCategories(prev =>
                          prev.includes(category)
                            ? prev.filter(c => c !== category)
                            : [...prev, category]
                        );
                        setCurrentPage(1);
                      }}
                      className="rounded"
                    />
                    {category}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Brands</h3>
              <div className="space-y-2">
                {BRANDS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => {
                        setSelectedBrands(prev =>
                          prev.includes(brand)
                            ? prev.filter(b => b !== brand)
                            : [...prev, brand]
                        );
                        setCurrentPage(1);
                      }}
                      className="rounded"
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Customer Ratings</h3>
              <div className="space-y-2">
                {RATINGS.map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRatings.includes(rating)}
                      onChange={() => {
                        setSelectedRatings(prev =>
                          prev.includes(rating)
                            ? prev.filter(r => r !== rating)
                            : [...prev, rating]
                        );
                        setCurrentPage(1);
                      }}
                      className="rounded"
                    />
                    <div className="flex items-center">
                      {rating}
                      <Star
                        size={16}
                        className="text-yellow-400 fill-yellow-400 ml-1"
                      />
                      & above
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Discounts</h3>
              <div className="space-y-2">
                {DISCOUNTS.map((discount) => (
                  <label key={discount} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedDiscounts.includes(discount)}
                      onChange={() => {
                        setSelectedDiscounts(prev =>
                          prev.includes(discount)
                            ? prev.filter(d => d !== discount)
                            : [...prev, discount]
                        );
                        setCurrentPage(1);
                      }}
                      className="rounded"
                    />
                    {discount}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Availability</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeOutOfStock}
                  onChange={(e) => {
                    setIncludeOutOfStock(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded"
                />
                Include Out of Stock
              </label>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-[#2874f0] text-white'
                        : 'border hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}