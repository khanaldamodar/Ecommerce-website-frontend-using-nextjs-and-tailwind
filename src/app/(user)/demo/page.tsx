'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const PlaceOrder = () => {
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
      
      const orderData = {
          total_amount: 299.99,
          items: [
              { product_id: 1, quantity: 2, price:  99.99 },
              { product_id: 5, quantity: 1, price: 990 }
            ]
        };
        
        try {
            const token = Cookies.get('auth_token'); // adjust based on your auth system
            setLoading(true);
      const response = await axios.post('http://localhost:8000/api/orders', orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Order Placed:', response.data);
    } catch (error) {
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
};

export default PlaceOrder;
