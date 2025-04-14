import React from 'react';
import { useState } from 'react';
import Layout from '../../components/Layout';
import { products, Product } from '../../data/products';

export default function Products() {
  const [productList, setProductList] = useState<Product[]>(products);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {productList.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <h2 className="text-xl">{product.name}</h2>
            <p>${product.price.toFixed(2)}</p>
            <button className="bg-blue-500 text-white px-4 py-2 mt-2">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </Layout>
  );
}