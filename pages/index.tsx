import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import { Package, Award, LifeBuoy, Smartphone } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Discover Pleasure with Lovense</h1>
          <p className={styles.heroSubtitle}>
            Indulge in our exclusive range of premium, body-safe toys crafted for solo adventures or intimate connections.
          </p>
          <Link href="/products" className={styles.heroButton}>
            Shop Now
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/lvp.png"
            alt="Lovense Product"
            width={500}
            height={410}
            className={styles.heroProductImage}
            priority
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Bestsellers</h2>
        <p className={styles.sectionSubtitle}>
          Explore top-rated toys loved by our community for their design and performance.
        </p>
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <Image
                src={product.image}
                alt={product.title}
                width={240}
                height={160}
                className={styles.cardImage}
              />
              <h3 className={styles.cardTitle}>{product.title}</h3>
              <p className={styles.cardText}>{product.description}</p>
              <Link href={`/products`} className={styles.cardButton}>
                Discover More
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={styles.whyChooseUs}>
        <h2 className={styles.sectionTitle}>Why Lovense?</h2>
        <p className={styles.sectionSubtitle}>
          Discover what sets us apart in delivering unparalleled pleasure.
        </p>
        <div className={styles.featuresGrid}>
          {[
            {
              icon: <Package size={48} className={styles.featureIcon} />,
              title: 'Discreet Shipping',
              description: 'Your privacy is our priority with plain packaging and confidential delivery.',
            },
            {
              icon: <Award size={48} className={styles.featureIcon} />,
              title: 'Premium Quality',
              description: 'Crafted with body-safe materials for safe and luxurious experiences.',
            },
            {
              icon: <LifeBuoy size={48} className={styles.featureIcon} />,
              title: '24/7 Support',
              description: 'Our team is here to assist you anytime, anywhere.',
            },
            {
              icon: <Smartphone size={48} className={styles.featureIcon} />,
              title: 'Smart Technology',
              description: 'App-controlled toys for seamless solo or long-distance play.',
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={styles.featureCard}
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              <div className={styles.featureIconWrapper}>{feature.icon}</div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>


      {/* Blog/Guide Teaser */}
      <section className={styles.blogSection}>
        <h2 className={styles.sectionTitle}>Explore Pleasure</h2>
        <p className={styles.sectionSubtitle}>
          Dive into our guides and stories for tips, tricks, and inspiration.
        </p>
        <div className={styles.blogGrid}>
          {[
            {
              image: '/lovense-logo.png',
              title: 'Beginner’s Guide to Lovense Toys',
              excerpt: 'New to pleasure toys? Start your journey with confidence.',
              category: 'Guides',
            },
            {
              image: '/lovense-logo.png',
              title: 'Spicing Up Long-Distance Love',
              excerpt: 'Keep the spark alive no matter the distance.',
              category: 'Relationships',
            },
            {
              image: '/lovense-logo.png',
              title: 'Self-Care & Pleasure',
              excerpt: 'Why prioritizing yourself feels so good.',
              category: 'Wellness',
            },
          ].map((post, index) => (
            <div
              key={index}
              className={styles.blogCard}
              style={{ marginTop: index % 2 === 1 ? '2rem' : '0' }}
            >
              <div className={styles.blogImageWrapper}>
                <Image
                  src={post.image}
                  alt={post.title}
                  width={300}
                  height={200}
                  className={styles.blogImage}
                />
                <div className={styles.blogOverlay}>
                  <Link href="/blog" className={styles.blogOverlayButton}>
                    Read Now
                  </Link>
                </div>
              </div>
              <span className={styles.blogCategory}>{post.category}</span>
              <h3 className={styles.blogTitle}>{post.title}</h3>
              <p className={styles.blogExcerpt}>{post.excerpt}</p>
              <Link href="/blog" className={styles.blogButton}>
                Read More
              </Link>
            </div>
          ))}
        </div>
      </section>

{/* CTA */}
<section className={styles.cta} data-aos="fade-up">
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Ready to Elevate Your Pleasure?</h2>
          <p className={styles.ctaText}>
            Discover toys that blend elegance, innovation, and intimacy for unforgettable moments.
          </p>
          <div className={styles.ctaActions}>
            <Link href="/products" className={styles.ctaButton}>
              Explore the Collection
            </Link>
            <Link href="/about" className={styles.ctaSecondary}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}