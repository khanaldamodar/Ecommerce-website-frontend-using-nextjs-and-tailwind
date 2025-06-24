"use client"
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Package, Star } from 'lucide-react';


interface ProductType{
  name: string;
  description: string;
  short_description?: string;
  price: string;
  compare_price?: string;
  stock: number;
  low_stock: number;
  image_url?: string;
  is_active: boolean;
  is_featured: boolean;
  brand?: string;
  vendor?: string;
  product_type?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: number | null;
  id: number;
  updated_by?: string | null;
  weight?: string | null;
  
}

const ProductsTable = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your actual API endpoint
  const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Uncomment and modify this when you have your API endpoint
        const response = await fetch("http://localhost:8000/api/products", {
          headers: {
            'Content-Type': 'application/json',
         
          },
          cache: 'no-cache', 
    });
        const data = await response.json();
        console.log(data)
        setProducts(data);
        setLoading(false);
        

        
        setError(null);
      } catch (err) {
        setError('Failed to fetch products. Please check your API endpoint.');
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStockStatus = (stock, lowStock) => {
    if (stock === 0) return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' };
    if (stock <= lowStock) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
    return { text: 'In Stock', className: 'bg-green-100 text-green-800' };
  };

  const Badge = ({ children, className }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-50 min-h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="ml-2 text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="h-6 w-6 mr-2 text-blue-600" />
            Products Inventory
          </h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => {
                const stockStatus = getStockStatus(product.stock, product.low_stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.image_url ? (
                            <img 
                              className="h-10 w-10 rounded-lg object-cover" 
                              src={product.image_url} 
                              alt={product.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                            <Package className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: #{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={product.description}>
                        {product.description}
                      </div>
                      {product.short_description && (
                        <div className="text-sm text-gray-500 max-w-xs truncate" title={product.short_description}>
                          {product.short_description}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                      {product.compare_price && (
                        <div className="text-sm text-gray-500 line-through">
                          {formatPrice(product.compare_price)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-medium text-gray-900">{product.stock}</div>
                      {product.low_stock > 0 && (
                        <div className="text-xs text-gray-500">Low: {product.low_stock}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Badge className={stockStatus.className}>
                        {stockStatus.text}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.brand || '-'}</div>
                      {product.vendor && (
                        <div className="text-sm text-gray-500">{product.vendor}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.created_by || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(product.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {product.is_featured ? (
                        <Star className="h-5 w-5 text-yellow-500 mx-auto" fill="currentColor" />
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="text-gray-500">No products found.</div>
          </div>
        )}
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing {products.length} products total
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsTable;