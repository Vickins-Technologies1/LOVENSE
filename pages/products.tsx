// pages/products.tsx
import { useState, useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import styles from '../styles/Products.module.css';
import Image from 'next/image';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { useSession } from 'next-auth/react';
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
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Load wishlist from localStorage or server (if authenticated)
  useEffect(() => {
    if (session?.user) {
      // TODO: Fetch wishlist from server for authenticated user
      return;
    }
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
  }, [session]);

  // Persist wishlist
  useEffect(() => {
    if (session?.user) {
      // TODO: Save wishlist to server for authenticated user
      return;
    }
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Failed to save wishlist:', error);
    }
  }, [wishlist, session]);

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
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart!`, {
      position: 'top-right',
      autoClose: 2000,
      theme: 'light',
    });
  };

  const toggleWishlist = (id: number) => {
    if (!session?.user) {
      toast.info('Please sign in to add items to your wishlist', {
        position: 'top-right',
        autoClose: 2000,
        theme: 'light',
      });
      return;
    }
    setWishlist((prev) => {
      const isInWishlist = prev.includes(id);
      const updated = isInWishlist ? prev.filter((item) => item !== id) : [...prev, id];
      const product = products.find((p) => p.id === id);

      toast.info(
        isInWishlist
          ? `${product?.name} removed from wishlist`
          : `${product?.name} added to wishlist`,
        {
          position: 'top-right',
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
    <Layout title="Products - Lovense" description="Browse our premium pleasure products.">
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
            aria-label="Show all products"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterButton} ${
                filter === category ? styles.active : ''
              }`}
              onClick={() => setFilter(category)}
              data-aos="fade-right"
              data-aos-delay={categories.indexOf(category) * 100}
              aria-label={`Filter by ${category}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className={styles.productsGrid}>
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                className={styles.productCard}
                data-aos="fade-up"
                data-aos-delay={filteredProducts.indexOf(product) * 100}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={product.image}
                    alt={`Image of ${product.name}`}
                    width={200}
                    height={200}
                    className={styles.productImage}
                    loading="lazy"
                    sizes="(max-width: 768px) 150px, 200px"
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
          <div className={styles.modalOverlay} onClick={closeModal} role="presentation">
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
              ref={modalRef}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
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
                  alt={`Image of ${selectedProduct.name}`}
                  width={400}
                  height={400}
                  className={styles.modalImage}
                  priority
                  sizes="(max-width: 768px) 300px, 400px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h2 id="modal-title" className={styles.modalTitle}>
                {selectedProduct.name}
              </h2>
              <p className={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</p>
              <p className={styles.modalDescription}>
                {selectedProduct.description ||
                  'Experience unparalleled pleasure with this premium toy, designed for comfort and innovation.'}
              </p>
              <div className={styles.modalFeatures}>
                <h3 className={styles.featuresTitle}>Features</h3>
                <ul className={styles.featuresList}>
                  {selectedProduct.features?.length ? (
                    selectedProduct.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))
                  ) : (
                    <>
                      <li key="material">Body-safe materials</li>
                      <li key="app-control">App-controlled functionality</li>
                      <li key="design">Discreet design</li>
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
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products`);

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const products: Product[] = await res.json();

    return {
      props: {
        products,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('getStaticProps error:', errorMessage);
    return {
      props: {
        products: [],
      },
      revalidate: 60,
    };
  }
};