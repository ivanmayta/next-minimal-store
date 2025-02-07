'use client';

import { useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Cart } from '@/components/cart';
import { type Product } from '@/lib/products';
import { useCart } from './cart-context';

export function AddToCart({ product }: { product: Product }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(() => {
    addToCart(product); // Solo pasamos el producto, sin tamaño
    setIsCartOpen(true);
  }, [addToCart, product]);

  const productName = product.id
    .split('-')
    .slice(0, -1)
    .join('-')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-[320px] mx-auto">
        <motion.div className="flex flex-col items-center">
          {/* Product Name */}
          <motion.div className="h-8 relative w-full flex justify-center items-center overflow-hidden">
            <motion.p className="font-medium font-mono uppercase">
              {productName}
            </motion.p>
          </motion.div>

          {/* Add to Cart Button */}
          <motion.div className="mt-8 relative w-full h-12">
            <motion.button
              onClick={handleAddToCart}
              className="size-12 flex items-center justify-center bg-white absolute left-1/2 -translate-x-1/2"
              aria-label="Add to cart"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Cart Component */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </motion.div>
  );
}