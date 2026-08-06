'use client';


import React, { useCallback, useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/modules/landing/ProductCard';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useProduct } from '@/hooks/useProduct';
import { Product } from '@/types/product.types';
import { useAuth } from '@/hooks/useAuth';

// Placeholder data for products
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones with Noise Cancellation',
    price: 129.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    rating: 4.5,
    reviews: 120
  },
  {
    id: '2',
    name: 'Smartwatch with Heart Rate Monitor and GPS',
    price: 199.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    rating: 4.2,
    reviews: 85
  },
  {
    id: '3',
    name: 'Premium Leather Wallet with RFID Protection',
    price: 49.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    rating: 4.8,
    reviews: 210
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair with Lumbar Support',
    price: 249.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8',
    rating: 4.0,
    reviews: 60
  },
  {
    id: '5',
    name: 'Portable Espresso Maker for Travel',
    price: 79.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
    rating: 4.6,
    reviews: 95
  },
  {
    id: '6',
    name: 'Organic Cotton Bedding Set - Queen Size',
    price: 159.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    rating: 4.7,
    reviews: 150
  },
  {
    id: '7',
    name: 'High-Performance Gaming Mouse with RGB Lighting',
    price: 69.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db',
    rating: 4.3,
    reviews: 180
  },
  {
    id: '8',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '9',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '10',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '11',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '12',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '13',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '14',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '15',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '16',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '17',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '18',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
  {
    id: '19',
    name: 'Vintage Style Ceramic Coffee Mugs (Set of 4)',
    price: 29.99,
    description: "hhishfbakbjdvbjabdvj",
    stock: 10,
    sku: "123456",
    imageUrl: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18',
    rating: 4.9,
    reviews: 300
  },
];
// The actual product data will come from the useProduct hook.

interface ProductGridProps {
  title: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title }: ProductGridProps) => {




  // If your useProduct hook needs the debouncedSearch value to filter, you would pass it here:
  // const { isLoading, products: fetchedProducts } = useProduct(debouncedSearch); // Example if useProduct supports search
  const { isLoading, products: fetchedProducts, getProducts, error, meta} = useProduct();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  // const meta = {
  //   limit: 8,
  //   page: 1,
  //   totalPages: 3,
  //   totalItems: 19,
  // }

  const isAdmin = user?.role === 'ADMIN';

  const limit = 12;

  useEffect(() => {
    getProducts({ page, limit, search: debouncedSearch });

  }, [getProducts, page, limit, debouncedSearch]);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };


  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);

    setTimeout(() => {
      setDebouncedSearch(value);
    }, 500);
  }, []);

  const generatePageNumbers = useCallback((currentPage: number, totalPages: number, pageRangeDisplayed: number = 2) => {
    const pages: (number | string)[] = [];
    const start = Math.max(1, currentPage - pageRangeDisplayed);
    const end = Math.min(totalPages, currentPage + pageRangeDisplayed);

    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground"
        >
          {title}
        </motion.h2>

        {/* Modern Rectangular Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2 }} // Slight delay after title animation
          className="mb-10 w-full max-w-4xl mx-auto relative" // Center and limit width
        >
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-3 pl-5 pr-12 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sm"
            onChange={handleSearchChange}
            value={search} // Make the input a controlled component
          />
          <button type="button" aria-label="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-indigo-600 transition-colors duration-200">
            <FiSearch size={20} />
          </button>
        </motion.div>
        {isLoading ? (
          // Loading State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center text-foreground"
          >
            <svg className="animate-spin h-8 w-8 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium">Loading products...</p>
          </motion.div>
        ) : fetchedProducts && fetchedProducts.length > 0 ? (
          <>
            {/* Products Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {fetchedProducts.map((product) => (
                <ProductCard key={product.id} product={product as Product} isAdmin={isAdmin} />
              ))}
            </motion.div>
            {/* Pagination */}
            { meta && meta.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-md bg-card text-foreground border border-border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors duration-200"
                  aria-label="Previous page"
                >
                  Previous
                </motion.button>

              </motion.div>
            )}
            
          </>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-xl shadow-md p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-16"
          >
            <FiPackage size={60} className="text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold text-foreground mb-3">
              {debouncedSearch
                ? `No products found for "${debouncedSearch}".`
                : "No products available at the moment."}
            </h3>
            {debouncedSearch && (
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or clear the filter to see more products.
              </p>
            )}
            {!debouncedSearch && (
              <p className="text-muted-foreground mb-6">
                It seems there are no products available right now. Please check back later!
              </p>
            )}
            <button
              onClick={() => {
                setSearch("");
                setDebouncedSearch("");
                // Optionally, trigger a refetch of all products if your useProduct hook supports it
                // e.g., useProduct.refetchAllProducts(); or pass a reset function from the hook
              }}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;