import { create } from 'zustand';
import { CartItem, Product, Review } from '../types';

interface Store {
  cart: CartItem[];
  wishlist: Product[];
  reviews: Review[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isInWishlist: (productId: number) => boolean;
  addReview: (review: Review) => void;
  getProductReviews: (productId: number) => Review[];
  getProductRating: (productId: number) => { average: number; total: number };
}

export const useStore = create<Store>((set, get) => ({
  cart: [],
  wishlist: [],
  reviews: [],
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    })),
  addToWishlist: (product) =>
    set((state) => {
      if (!state.wishlist.some(item => item.id === product.id)) {
        return { wishlist: [...state.wishlist, product] };
      }
      return state;
    }),
  removeFromWishlist: (productId) =>
    set((state) => ({
      wishlist: state.wishlist.filter((item) => item.id !== productId),
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),
  clearCart: () => set({ cart: [] }),
  isInWishlist: (productId) => {
    const state = get();
    return state.wishlist.some(item => item.id === productId);
  },
  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
    })),
  getProductReviews: (productId) => {
    const state = get();
    return state.reviews.filter(review => review.productId === productId);
  },
  getProductRating: (productId) => {
    const state = get();
    const productReviews = state.reviews.filter(review => review.productId === productId);
    const total = productReviews.length;
    const average = total > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / total
      : 0;
    return { average, total };
  },
}));