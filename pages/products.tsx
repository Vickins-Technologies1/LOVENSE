// pages/products.tsx
import React, { useState, useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import styles from '../styles/Products.module.css';
import Image from 'next/image';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCartStore } from '../store/cartStore';
import AOS from 'aos';
import 'aos/dist/aos.css';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  features?: string[];
}

interface ProductsPageProps {
  products: Product[];
}

export default function Products({ products }: ProductsPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filter, setFilter] = useState('all');
  const [wishlist, setWishlist] = useState<number[]>([]);

  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
    return () => AOS.refresh(); // Clean up on unmount
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to parse wishlist:', error);
      setWishlist([]);
    }
  }, []);

  // Persist wishlist
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [wishlist]);

  // Modal: Close on Escape + trap focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }

      if (e.key === 'Tab' && selectedProduct && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    if (selectedProduct) {
      window.addEventListener('keydown', handleKeyDown);
      firstFocusableRef.current?.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct]);

  const handleAddToCart = (product: Product) => {
    useCartStore.getState().addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 2000,
      theme: 'light',
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const isInWishlist = prev.includes(id);
      const updated = isInWishlist ? prev.filter((item) => item !== id) : [...prev, id];
      const product = products.find((p) => p.id === id);

      toast.info(
        isInWishlist
          ? `${product?.name} removed from wishlist`
          : `${product?.name} added to wishlist`,
        {
          position: 'bottom-right',
          autoClose: 2000,
          theme: 'light',
        }
      );

      return updated;
    });
  };

  const openModal = (product: Product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const filteredProducts = products.filter((product) =>
    filter === 'all' ? true : product.category.toLowerCase() === filter.toLowerCase()
  );

  const categories = Array.from(new Set(products.map((p) => p.category.toLowerCase())));

  return (
    <Layout>
      <section className={styles.productsSection}>
        <h1 className={styles.sectionTitle}>Our Pleasure Collection</h1>
        <p className={styles.sectionSubtitle}>
          Discover toys crafted for intimacy, innovation, and joy.
        </p>

        {/* Filter Bar */}
        <div className={styles.filterBar} data-aos="fade-down">
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {categories.map((category, index) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                filter === category ? styles.active : ''
              }`}
              onClick={() => setFilter(category)}
              data-aos="fade-right"
              data-aos-delay={index * 100}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length ? (
            filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={styles.productCard}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={200}
                    height={200}
                    className={styles.productImage}
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                  <button
                    className={styles.wishlistButton}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label={
                      wishlist.includes(product.id)
                        ? `Remove ${product.name} from wishlist`
                        : `Add ${product.name} to wishlist`
                    }
                  >
                    <Heart
                      size={20}
                      fill={wishlist.includes(product.id) ? '#e60073' : 'none'}
                      color={wishlist.includes(product.id) ? '#e60073' : '#666'}
                    />
                  </button>
                </div>
                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                <div className={styles.productActions}>
                  <button
                    className={styles.viewButton}
                    onClick={() => openModal(product)}
                    aria-label={`View details for ${product.name}`}
                  >
                    View Details
                  </button>
                  <button
                    className={styles.cartButton}
                    onClick={() => handleAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart size={18} className="inline mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noProducts}>No products found in this category.</p>
          )}
        </div>

        {/* Modal */}
        {selectedProduct && (
          <div className={styles.modalOverlay} onClick={closeModal}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
            >
              <button
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Close product details modal"
                ref={firstFocusableRef}
              >
                <X size={24} />
              </button>
              <div className={styles.modalImageWrapper}>
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  width={400}
                  height={400}
                  className={styles.modalImage}
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h2 className={styles.modalTitle}>{selectedProduct.name}</h2>
              <p className={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</p>
              <p className={styles.modalDescription}>
                {selectedProduct.description ||
                  'Experience unparalleled pleasure with this premium toy, designed for comfort and innovation.'}
              </p>
              <div className={styles.modalFeatures}>
                <h3 className={styles.featuresTitle}>Features</h3>
                <ul className={styles.featuresList}>
                  {selectedProduct.features?.length ? (
                    selectedProduct.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))
                  ) : (
                    <>
                      <li>Body-safe materials</li>
                      <li>App-controlled functionality</li>
                      <li>Discreet design</li>
                    </>
                  )}
                </ul>
              </div>
              <button
                className={styles.modalCartButton}
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  closeModal();
                }}
                aria-label={`Add ${selectedProduct.name} to cart`}
              >
                <ShoppingCart size={18} className="inline mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </section>

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const products: Product[] = await res.json();

    return {
      props: {
        products,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('getStaticProps error:', error);
    return {
      props: {
        products: [],
      },
      revalidate: 60,
    };
  }
};