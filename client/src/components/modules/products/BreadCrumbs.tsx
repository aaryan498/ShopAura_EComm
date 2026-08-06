'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

interface BreadCrumbsProps {
  productName: string;
  categoryName?: string; // Optional category name for a more complete path
  categoryId?: string; // Optional category ID for linking
}

const BreadCrumbs = ({ productName, categoryName, categoryId }: BreadCrumbsProps) => {
  return (
    <div className="text-sm text-muted-foreground flex items-center space-x-1 mb-6">
      <Link href="/" className="hover:text-indigo-600 transition-colors duration-200">
        Home
      </Link>
      <FiChevronRight className="h-4 w-4 text-gray-400" />
      {categoryName && categoryId && (
        <>
          <Link href={`/categories/${categoryId}`} className="hover:text-indigo-600 transition-colors duration-200">
            {categoryName}
          </Link>
          <FiChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}
      <span className="text-foreground font-medium">{productName}</span>
    </div>
  );
};

export default BreadCrumbs;